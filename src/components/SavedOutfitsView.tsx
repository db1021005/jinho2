/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClothingItem, SavedOutfit } from '../types/clothing';
import {
  BookmarkCheck,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Share2,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

interface SavedOutfitsViewProps {
  savedOutfits: SavedOutfit[];
  onRemoveSaved: (id: string) => void;
  onOpenItemModal: (item: ClothingItem) => void;
  onApplyCondition: (saved: SavedOutfit) => void;
  onGoToRecommend: () => void;
}

export const SavedOutfitsView: React.FC<SavedOutfitsViewProps> = ({
  savedOutfits,
  onRemoveSaved,
  onOpenItemModal,
  onApplyCondition,
  onGoToRecommend,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (saved: SavedOutfit) => {
    const o = saved.outfit;
    const pieces = [
      o.outer ? `[아우터] ${o.outer.이름}` : null,
      `[상의] ${o.top.이름}`,
      `[하의] ${o.bottom.이름}`,
      `[신발] ${o.shoes.이름}`,
    ]
      .filter(Boolean)
      .join(', ');

    const text = `[Style Pick 저장 코디]\n${saved.name} (${o.score}점)\n조건: ${saved.condition.season} · ${saved.condition.weather} · ${saved.condition.situation} · ${saved.condition.style}\n구성: ${pieces}\n팁: ${o.stylingTip}`;

    navigator.clipboard.writeText(text);
    setCopiedId(saved.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (savedOutfits.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">
          저장한 코디가 없습니다
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
          마음에 드는 추천 코디의 북마크 아이콘을 누르면 이곳에 나만의 룩북으로 저장됩니다.
        </p>
        <button
          onClick={onGoToRecommend}
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 mx-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>코디 추천받으러 가기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookmarkCheck className="w-5 h-5 text-stone-900" />
            <h2 className="text-xl font-bold text-stone-900">저장한 코디 룩북</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-900 text-white">
              {savedOutfits.length}개 저장됨
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            저장해둔 나만의 베스트 코디와 당시의 날씨, 상황 조건을 언제든 확인하고 다시 적용할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savedOutfits.map((saved) => {
          const o = saved.outfit;
          const isCopied = copiedId === saved.id;

          return (
            <div
              key={saved.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:border-stone-400 transition flex flex-col justify-between"
            >
              <div>
                {/* Header Bar */}
                <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {saved.createdAt}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">
                      {saved.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {o.score}%
                    </span>

                    <button
                      onClick={() => onRemoveSaved(saved.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-white transition"
                      title="저장 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Condition Pills */}
                <div className="px-4 py-2 bg-stone-50/50 border-b border-stone-100 flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                    {saved.condition.season}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                    {saved.condition.weather}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                    {saved.condition.situation}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                    #{saved.condition.style}
                  </span>
                  {saved.condition.preferredColor !== '상관없음' && (
                    <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                      선호: {saved.condition.preferredColor}
                    </span>
                  )}
                </div>

                {/* Visual Collage */}
                <div className="p-4">
                  <div
                    className={`grid gap-2 ${
                      o.outer ? 'grid-cols-4' : 'grid-cols-3'
                    }`}
                  >
                    {o.outer && (
                      <div
                        onClick={() => onOpenItemModal(o.outer!)}
                        className="group aspect-[3/4] rounded-lg bg-stone-100 overflow-hidden relative cursor-pointer border border-stone-200"
                      >
                        <img
                          src={o.outer.image}
                          alt={o.outer.이름}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/70 text-white">
                          아우터
                        </span>
                      </div>
                    )}
                    <div
                      onClick={() => onOpenItemModal(o.top)}
                      className="group aspect-[3/4] rounded-lg bg-stone-100 overflow-hidden relative cursor-pointer border border-stone-200"
                    >
                      <img
                        src={o.top.image}
                        alt={o.top.이름}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/70 text-white">
                        상의
                      </span>
                    </div>
                    <div
                      onClick={() => onOpenItemModal(o.bottom)}
                      className="group aspect-[3/4] rounded-lg bg-stone-100 overflow-hidden relative cursor-pointer border border-stone-200"
                    >
                      <img
                        src={o.bottom.image}
                        alt={o.bottom.이름}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/70 text-white">
                        하의
                      </span>
                    </div>
                    <div
                      onClick={() => onOpenItemModal(o.shoes)}
                      className="group aspect-[3/4] rounded-lg bg-stone-100 overflow-hidden relative cursor-pointer border border-stone-200"
                    >
                      <img
                        src={o.shoes.image}
                        alt={o.shoes.이름}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/70 text-white">
                        신발
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 line-clamp-2">
                    💡 {o.stylingTip}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(saved)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold transition flex items-center gap-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>텍스트 복사</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onApplyCondition(saved)}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>이 조건 적용하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
