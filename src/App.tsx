/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ClothingItem,
  OutfitCombination,
  SavedOutfit,
  StylingCondition,
} from './types/clothing';
import {
  CAPSULE_WARDROBE_IDS,
  FEMALE_CAPSULE_WARDROBE_IDS,
  MASTER_CLOTHING_LIST,
} from './data/clothingData';
import { recommendOutfits } from './utils/outfitMatcher';
import { Header, TabType } from './components/Header';
import { ConditionSelector } from './components/ConditionSelector';
import { OutfitResultView } from './components/OutfitResultView';
import { ClosetView } from './components/ClosetView';
import { CatalogView } from './components/CatalogView';
import { SavedOutfitsView } from './components/SavedOutfitsView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { Check, Sparkles, Shirt, Layers, BookmarkCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_CLOSET = 'style_pick_closet_ids_v1';
const STORAGE_KEY_SAVED = 'style_pick_saved_outfits_v1';

export default function App() {
  // Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('recommend');

  // Closet IDs: Initially empty as required ("처음 실행했을 때 내 옷장은 비어 있어야 해.")
  // We check localStorage so the user's choices are preserved during testing.
  const [closetIds, setClosetIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLOSET);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set<string>(parsed);
        }
      }
    } catch {
      // fallback to empty set
    }
    return new Set<string>(); // initially empty!
  });

  // Saved Outfits
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Styling Condition State
  const [condition, setCondition] = useState<StylingCondition>({
    gender: '남성',
    season: '가을',
    weather: '선선함',
    situation: '데이트',
    style: '캐주얼',
  });

  // Modal Item Detail
  const [detailItem, setDetailItem] = useState<ClothingItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Sync closetIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CLOSET,
        JSON.stringify(Array.from(closetIds))
      );
    } catch (e) {
      console.error(e);
    }
  }, [closetIds]);

  // Sync savedOutfits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedOutfits));
    } catch (e) {
      console.error(e);
    }
  }, [savedOutfits]);

  // Items currently in user closet
  const closetItems = useMemo(() => {
    return MASTER_CLOTHING_LIST.filter((item) => closetIds.has(item.id));
  }, [closetIds]);

  // Compute Outfit Recommendation strictly using closetItems
  const matchingResult = useMemo(() => {
    return recommendOutfits(closetItems, condition);
  }, [closetItems, condition]);

  // Handlers for Closet
  const handleToggleItem = (item: ClothingItem) => {
    setClosetIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        showToast(`'${item.이름}'을(를) 내 옷장에서 뺐습니다.`);
      } else {
        next.add(item.id);
        showToast(`'${item.이름}'을(를) 내 옷장에 추가했습니다!`);
      }
      return next;
    });
  };

  // Add Capsule Wardrobe preset
  const handleAddCapsuleWardrobe = () => {
    const presetIds =
      condition.gender === '여성'
        ? FEMALE_CAPSULE_WARDROBE_IDS
        : CAPSULE_WARDROBE_IDS;

    setClosetIds((prev) => {
      const next = new Set(prev);
      presetIds.forEach((id) => next.add(id));
      return next;
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    const label =
      condition.gender === '여성'
        ? `여성 기본 캡슐 세트(${presetIds.length}벌)`
        : `남성 기본 캡슐 세트(${presetIds.length}벌)`;
    showToast(`${label}를 내 옷장에 담았습니다!`);
  };

  // Select All items
  const handleSelectAll = () => {
    const allIds = new Set(MASTER_CLOTHING_LIST.map((item) => item.id));
    setClosetIds(allIds);
    showToast(`전체 ${MASTER_CLOTHING_LIST.length}벌 의상을 모두 내 옷장에 담았습니다.`);
  };

  // Clear Closet
  const handleClearCloset = () => {
    setClosetIds(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY_CLOSET);
    } catch (e) {
      console.error(e);
    }
    showToast('내 옷장을 모두 비웠습니다.');
  };

  // Save Outfit
  const handleSaveOutfit = (outfit: OutfitCombination) => {
    if (savedOutfits.some((s) => s.outfit.id === outfit.id)) {
      showToast('이미 저장된 코디입니다.');
      return;
    }

    const newSaved: SavedOutfit = {
      id: `saved-${Date.now()}`,
      name: `${condition.gender} ${condition.season} ${outfit.moodTag}`,
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      condition: { ...condition },
      outfit,
    };

    setSavedOutfits((prev) => [newSaved, ...prev]);
    showToast('코디를 룩북에 저장했습니다!');
  };

  const handleRemoveSaved = (id: string) => {
    setSavedOutfits((prev) => prev.filter((s) => s.id !== id));
    showToast('저장된 코디를 삭제했습니다.');
  };

  const isOutfitSaved = (outfitId: string) => {
    return savedOutfits.some((s) => s.outfit.id === outfitId);
  };

  // Apply condition from saved outfit
  const handleApplyCondition = (saved: SavedOutfit) => {
    setCondition(saved.condition);
    setActiveTab('recommend');
    showToast('저장된 코디의 조건을 적용했습니다.');
  };

  // Reset conditions to default
  const handleResetCondition = () => {
    setCondition({
      gender: '남성',
      season: '가을',
      weather: '선선함',
      situation: '데이트',
      style: '캐주얼',
    });
    showToast('조건을 기본값으로 초기화했습니다.');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col selection:bg-stone-900 selection:text-white pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        closetCount={closetIds.size}
        savedCount={savedOutfits.length}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Tab 1: 코디 추천 */}
        {activeTab === 'recommend' && (
          <div className="space-y-6">
            <ConditionSelector
              condition={condition}
              onChange={setCondition}
              onReset={handleResetCondition}
              onSubmit={() => {
                showToast('조건을 반영하여 맞춤 코디를 추천했습니다!');
              }}
              isClosetEmpty={closetIds.size === 0}
            />

            <OutfitResultView
              matchingResult={matchingResult}
              condition={condition}
              onOpenItemModal={(item) => setDetailItem(item)}
              onAddToCloset={handleToggleItem}
              onAddCapsuleWardrobe={handleAddCapsuleWardrobe}
              onGoToClosetTab={() => setActiveTab('closet')}
              onSaveOutfit={handleSaveOutfit}
              isOutfitSaved={isOutfitSaved}
            />
          </div>
        )}

        {/* Tab 2: 내 옷장 */}
        {activeTab === 'closet' && (
          <ClosetView
            closetIds={closetIds}
            onToggleItem={handleToggleItem}
            onAddCapsuleWardrobe={handleAddCapsuleWardrobe}
            onSelectAll={handleSelectAll}
            onClearCloset={handleClearCloset}
            onOpenItemModal={(item) => setDetailItem(item)}
            onGoToRecommend={() => setActiveTab('recommend')}
            onGoToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* Tab 3: 전체 의상 도감 */}
        {activeTab === 'catalog' && (
          <CatalogView
            closetIds={closetIds}
            onToggleItem={handleToggleItem}
            onOpenItemModal={(item) => setDetailItem(item)}
            onSelectAll={handleSelectAll}
          />
        )}

        {/* Tab 4: 저장한 코디 */}
        {activeTab === 'saved' && (
          <SavedOutfitsView
            savedOutfits={savedOutfits}
            onRemoveSaved={handleRemoveSaved}
            onOpenItemModal={(item) => setDetailItem(item)}
            onApplyCondition={handleApplyCondition}
            onGoToRecommend={() => setActiveTab('recommend')}
          />
        )}
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={detailItem}
        isInCloset={detailItem ? closetIds.has(detailItem.id) : false}
        onToggleCloset={(item) => handleToggleItem(item)}
        onClose={() => setDetailItem(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-serif font-bold text-stone-900">Style Pick</span>
            <span>· 내 옷장 맞춤 코디 큐레이션 웹앱</span>
          </div>
          <div className="text-stone-400">
            총 {MASTER_CLOTHING_LIST.length}개 에센셜 마스터 의류 아이템 지원
          </div>
        </div>
      </footer>
    </div>
  );
}
