/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ClothingItem,
  OutfitCombination,
  StylingCondition,
} from '../types/clothing';
import { MatchingResult } from '../utils/outfitMatcher';
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Shirt,
  Info,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Plus,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MusinsaProductSearch } from './MusinsaProductSearch';
import { generateMusinsaQuery } from '../utils/musinsaQuery';
import { MusinsaProduct } from '../types/musinsa';

interface OutfitResultViewProps {
  matchingResult: MatchingResult;
  condition: StylingCondition;
  onOpenItemModal: (item: ClothingItem) => void;
  onAddToCloset: (item: ClothingItem) => void;
  onAddCapsuleWardrobe: () => void;
  onGoToClosetTab: () => void;
  onSaveOutfit: (outfit: OutfitCombination) => void;
  isOutfitSaved: (outfitId: string) => boolean;
}

export const OutfitResultView: React.FC<OutfitResultViewProps> = ({
  matchingResult,
  condition,
  onOpenItemModal,
  onAddToCloset,
  onAddCapsuleWardrobe,
  onGoToClosetTab,
  onSaveOutfit,
  isOutfitSaved,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitCombination | null>(
    matchingResult.bestPick
  );
  const [copied, setCopied] = useState(false);

  // Map of pieceId -> MusinsaProduct[] for real Musinsa product photos
  const [pieceMusinsaMap, setPieceMusinsaMap] = useState<Record<string, MusinsaProduct[]>>({});
  const [loadingPieces, setLoadingPieces] = useState<Record<string, boolean>>({});

  // Update selected outfit when bestPick changes
  React.useEffect(() => {
    setSelectedOutfit(matchingResult.bestPick);
  }, [matchingResult.bestPick]);

  const activeOutfit = selectedOutfit || matchingResult.bestPick;

  // Fetch real Musinsa product photos for each piece in active outfit
  React.useEffect(() => {
    if (!activeOutfit) return;

    const pieces = [
      activeOutfit.outer,
      activeOutfit.top,
      activeOutfit.bottom,
      activeOutfit.shoes,
    ].filter(Boolean) as ClothingItem[];

    pieces.forEach(async (piece) => {
      const query = generateMusinsaQuery(piece, condition.style, piece.색상[0], condition.gender);
      const cacheKey = `${piece.id}-${condition.gender}-${condition.style}`;

      if (pieceMusinsaMap[cacheKey] !== undefined) return;

      setLoadingPieces((prev) => ({ ...prev, [piece.id]: true }));
      try {
        const res = await fetch('/api/musinsa/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setPieceMusinsaMap((prev) => ({
            ...prev,
            [cacheKey]: data.products,
            [piece.id]: data.products,
          }));
        }
      } catch (err) {
        console.error('Failed to load piece Musinsa product:', err);
      } finally {
        setLoadingPieces((prev) => ({ ...prev, [piece.id]: false }));
      }
    });
  }, [activeOutfit?.id, condition.gender, condition.style]);

  // Handle Save
  const handleSave = (outfit: OutfitCombination) => {
    onSaveOutfit(outfit);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0F172A', '#F59E0B', '#3B82F6', '#10B981'],
    });
  };

  // Copy outfit summary to clipboard
  const handleCopy = () => {
    if (!activeOutfit) return;
    const pieces = [
      activeOutfit.outer ? `[아우터] ${activeOutfit.outer.이름}` : null,
      `[상의] ${activeOutfit.top.이름}`,
      `[하의] ${activeOutfit.bottom.이름}`,
      `[신발] ${activeOutfit.shoes.이름}`,
    ]
      .filter(Boolean)
      .join('\n');

    const text = `[Style Pick 코디 추천 - ${activeOutfit.moodTag}]\n매칭 점수: ${activeOutfit.score}점 (${activeOutfit.colorHarmony})\n\n${pieces}\n\n💡 스타일링 팁: ${activeOutfit.stylingTip}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Empty Closet or Missing Categories View
  if (!matchingResult.hasMinimumItems) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 sm:p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
          <Shirt className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-stone-900 mb-2">
          {matchingResult.missingCategories.length === 3
            ? '내 옷장이 비어있어요!'
            : '코디를 완성하기 위한 옷이 더 필요해요'}
        </h3>

        <p className="text-stone-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Style Pick은 <strong>오직 내 옷장에 담긴 옷만 사용해서</strong> 실용적인 코디를 추천합니다.
          <br />
          {matchingResult.missingCategories.length > 0 && (
            <span className="inline-block mt-2 font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs">
              부족한 카테고리: {matchingResult.missingCategories.join(', ')} (최소 1개씩 필요)
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAddCapsuleWardrobe}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>기본 캡슐 옷장 세트 담기 (빠른 시작)</span>
          </button>

          <button
            onClick={onGoToClosetTab}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Shirt className="w-4 h-4" />
            <span>전체 목록에서 직접 옷 담기</span>
          </button>
        </div>
      </div>
    );
  }

  if (!activeOutfit) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
        <Info className="w-10 h-10 text-stone-400 mx-auto mb-3" />
        <p className="text-stone-700 font-medium">
          현재 선택된 조건에 부합하는 코디 조합을 찾지 못했습니다.
        </p>
        <p className="text-stone-500 text-xs mt-1">
          옷장에 옷을 더 추가하거나, 다른 조건(계절/날씨/스타일)을 선택해 보세요.
        </p>
      </div>
    );
  }

  const isSaved = isOutfitSaved(activeOutfit.id);

  return (
    <div className="space-y-6">
      {/* ================= HERO BEST PICK ================= */}
      <div className="bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-stone-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-stone-950" />
                  오늘의 베스트 픽
                </span>
                <span className="text-xs text-stone-300 font-medium">
                  {matchingResult.totalCombinationsEvaluated}개 조합 중 엄선
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {activeOutfit.moodTag}
              </h3>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Match Score Badge */}
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[10px] text-stone-300 uppercase leading-none">매칭 지수</div>
                  <div className="text-lg font-black text-emerald-400 leading-tight">
                    {activeOutfit.score}%
                  </div>
                </div>
              </div>

              {/* Color Harmony Badge */}
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-stone-200 flex items-center gap-2">
                <span>🎨 {activeOutfit.colorHarmony}</span>
                {activeOutfit.recommendedPalette && (
                  <div className="flex items-center -space-x-1" title={activeOutfit.recommendedPalette.description}>
                    {activeOutfit.recommendedPalette.paletteColors.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Outfit Pieces Visual Collage */}
        <div className="p-6">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>착용 아이템 구성 (내 옷장 소장품)</span>
            <span className="text-[11px] text-stone-500 font-normal">
              카드를 클릭하면 상세 정보를 볼 수 있습니다
            </span>
          </div>

          <div
            className={`grid gap-3 sm:gap-4 ${
              activeOutfit.outer
                ? 'grid-cols-2 sm:grid-cols-4'
                : 'grid-cols-3'
            }`}
          >
            {/* Outer (Optional) */}
            {activeOutfit.outer && (() => {
              const outerProducts = pieceMusinsaMap[activeOutfit.outer.id];
              const outerMusinsa = outerProducts?.[0];
              const outerImg = outerMusinsa?.image || activeOutfit.outer.image;

              return (
                <div
                  onClick={() => onOpenItemModal(activeOutfit.outer!)}
                  className="group relative bg-stone-50 rounded-xl border border-stone-200 overflow-hidden hover:border-stone-900 transition cursor-pointer shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={outerImg}
                      alt={outerMusinsa?.title || activeOutfit.outer.이름}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                      아우터
                    </span>
                    {outerMusinsa && (
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold bg-black/85 text-white backdrop-blur-sm truncate text-left">
                        🛍️ {outerMusinsa.brand ? `${outerMusinsa.brand} · ` : ''}{outerMusinsa.price}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition truncate">
                      {activeOutfit.outer.이름}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: activeOutfit.outer.hex }}
                      />
                      <span className="truncate">{activeOutfit.outer.색상.join(', ')}</span>
                    </div>

                    {/* Musinsa Search Button */}
                    <MusinsaProductSearch
                      item={activeOutfit.outer}
                      selectedStyle={condition.style}
                      preferredColor={condition.preferredColor}
                      gender={condition.gender}
                      initialProducts={outerProducts}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Top */}
            {(() => {
              const topProducts = pieceMusinsaMap[activeOutfit.top.id];
              const topMusinsa = topProducts?.[0];
              const topImg = topMusinsa?.image || activeOutfit.top.image;

              return (
                <div
                  onClick={() => onOpenItemModal(activeOutfit.top)}
                  className="group relative bg-stone-50 rounded-xl border border-stone-200 overflow-hidden hover:border-stone-900 transition cursor-pointer shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={topImg}
                      alt={topMusinsa?.title || activeOutfit.top.이름}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                      상의
                    </span>
                    {topMusinsa && (
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold bg-black/85 text-white backdrop-blur-sm truncate text-left">
                        🛍️ {topMusinsa.brand ? `${topMusinsa.brand} · ` : ''}{topMusinsa.price}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition truncate">
                      {activeOutfit.top.이름}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: activeOutfit.top.hex }}
                      />
                      <span className="truncate">{activeOutfit.top.색상.join(', ')}</span>
                    </div>

                    {/* Musinsa Search Button */}
                    <MusinsaProductSearch
                      item={activeOutfit.top}
                      selectedStyle={condition.style}
                      preferredColor={condition.preferredColor}
                      gender={condition.gender}
                      initialProducts={topProducts}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Bottom */}
            {(() => {
              const bottomProducts = pieceMusinsaMap[activeOutfit.bottom.id];
              const bottomMusinsa = bottomProducts?.[0];
              const bottomImg = bottomMusinsa?.image || activeOutfit.bottom.image;

              return (
                <div
                  onClick={() => onOpenItemModal(activeOutfit.bottom)}
                  className="group relative bg-stone-50 rounded-xl border border-stone-200 overflow-hidden hover:border-stone-900 transition cursor-pointer shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={bottomImg}
                      alt={bottomMusinsa?.title || activeOutfit.bottom.이름}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                      하의
                    </span>
                    {bottomMusinsa && (
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold bg-black/85 text-white backdrop-blur-sm truncate text-left">
                        🛍️ {bottomMusinsa.brand ? `${bottomMusinsa.brand} · ` : ''}{bottomMusinsa.price}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition truncate">
                      {activeOutfit.bottom.이름}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: activeOutfit.bottom.hex }}
                      />
                      <span className="truncate">{activeOutfit.bottom.색상.join(', ')}</span>
                    </div>

                    {/* Musinsa Search Button */}
                    <MusinsaProductSearch
                      item={activeOutfit.bottom}
                      selectedStyle={condition.style}
                      preferredColor={condition.preferredColor}
                      gender={condition.gender}
                      initialProducts={bottomProducts}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Shoes */}
            {(() => {
              const shoesProducts = pieceMusinsaMap[activeOutfit.shoes.id];
              const shoesMusinsa = shoesProducts?.[0];
              const shoesImg = shoesMusinsa?.image || activeOutfit.shoes.image;

              return (
                <div
                  onClick={() => onOpenItemModal(activeOutfit.shoes)}
                  className="group relative bg-stone-50 rounded-xl border border-stone-200 overflow-hidden hover:border-stone-900 transition cursor-pointer shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                    <img
                      src={shoesImg}
                      alt={shoesMusinsa?.title || activeOutfit.shoes.이름}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                      신발
                    </span>
                    {shoesMusinsa && (
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold bg-black/85 text-white backdrop-blur-sm truncate text-left">
                        🛍️ {shoesMusinsa.brand ? `${shoesMusinsa.brand} · ` : ''}{shoesMusinsa.price}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition truncate">
                      {activeOutfit.shoes.이름}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: activeOutfit.shoes.hex }}
                      />
                      <span className="truncate">{activeOutfit.shoes.색상.join(', ')}</span>
                    </div>

                    {/* Musinsa Search Button */}
                    <MusinsaProductSearch
                      item={activeOutfit.shoes}
                      selectedStyle={condition.style}
                      preferredColor={condition.preferredColor}
                      gender={condition.gender}
                      initialProducts={shoesProducts}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Rationale & Styling Tip */}
          <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Match Reasons */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
              <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                추천 이유
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
                {activeOutfit.matchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-stone-400 mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stylist Tip */}
            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80">
              <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                스타일리스트 연출 팁
              </h5>
              <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
                {activeOutfit.stylingTip}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-stone-500">
              색상 조화: <strong className="text-stone-800">{activeOutfit.colorHarmony}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
                title="코디 구성 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>코디 텍스트 복사</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSave(activeOutfit)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                    : 'bg-stone-900 hover:bg-black text-white'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>저장됨</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>코디 북마크 저장</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ALTERNATIVE OUTFITS ================= */}
      {matchingResult.alternatives.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>다른 추천 조합 (대안 코디)</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600">
                  {matchingResult.alternatives.length}개
                </span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                클릭하면 위의 메인 화면에서 상세 구성을 비교할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {matchingResult.alternatives.map((alt) => {
              const isSelected = activeOutfit.id === alt.id;
              const isAltSaved = isOutfitSaved(alt.id);

              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedOutfit(alt)}
                  className={`rounded-xl border p-4 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900 ring-offset-1'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-800 truncate">
                        {alt.moodTag}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {alt.score}%
                      </span>
                    </div>

                    {/* Miniature thumbnail row */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {alt.outer && (
                        <img
                          src={alt.outer.image}
                          alt={alt.outer.이름}
                          className="w-10 h-12 rounded object-cover border border-stone-200"
                        />
                      )}
                      <img
                        src={alt.top.image}
                        alt={alt.top.이름}
                        className="w-10 h-12 rounded object-cover border border-stone-200"
                      />
                      <img
                        src={alt.bottom.image}
                        alt={alt.bottom.이름}
                        className="w-10 h-12 rounded object-cover border border-stone-200"
                      />
                      <img
                        src={alt.shoes.image}
                        alt={alt.shoes.이름}
                        className="w-10 h-12 rounded object-cover border border-stone-200"
                      />
                    </div>

                    {/* Pieces name text */}
                    <div className="text-xs text-stone-600 space-y-0.5 mb-3">
                      {alt.outer && <p className="truncate">• [아우터] {alt.outer.이름}</p>}
                      <p className="truncate">• [상의] {alt.top.이름}</p>
                      <p className="truncate">• [하의] {alt.bottom.이름}</p>
                      <p className="truncate">• [신발] {alt.shoes.이름}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-[11px] text-stone-500 truncate">
                      {alt.colorHarmony}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(alt);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-500 transition"
                      title="저장"
                    >
                      {isAltSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-rose-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= WISHLIST / MISSING PIECES ================= */}
      {matchingResult.wishlistSuggestions.length > 0 && (
        <div className="bg-gradient-to-br from-stone-50 to-stone-100/60 rounded-2xl border border-stone-200/80 p-6">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-4 h-4 text-stone-700" />
            <h4 className="text-sm font-bold text-stone-900">
              내 옷장에 추가하면 코디가 더욱 완벽해질 추천 아이템
            </h4>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            현재 조건에 꼭 맞지만 옷장에 등록되지 않은 에센셜 아이템입니다. 소장하고 계시다면 '+ 옷장에 추가'를 눌러보세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {matchingResult.wishlistSuggestions.map(({ item, reason }) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={item.image}
                      alt={item.이름}
                      className="w-12 h-14 rounded-lg object-cover border border-stone-100 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase">
                        {item.카테고리}
                      </span>
                      <h5 className="font-bold text-stone-900 text-sm">
                        {item.이름}
                      </h5>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 mb-3">
                    {reason}
                  </p>
                </div>

                <button
                  onClick={() => onAddToCloset(item)}
                  className="w-full py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-semibold transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>내 옷장에 추가</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
