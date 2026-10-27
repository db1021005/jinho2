/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClothingItem } from '../types/clothing';
import { CATEGORIES, MASTER_CLOTHING_LIST } from '../data/clothingData';
import {
  Check,
  Plus,
  Search,
  Filter,
  Eye,
  Shirt,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CatalogViewProps {
  closetIds: Set<string>;
  onToggleItem: (item: ClothingItem) => void;
  onOpenItemModal: (item: ClothingItem) => void;
  onSelectAll: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  closetIds,
  onToggleItem,
  onOpenItemModal,
  onSelectAll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedGender, setSelectedGender] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('전체');

  // Filter logic
  const filteredList = MASTER_CLOTHING_LIST.filter((item) => {
    const matchesCategory =
      selectedCategory === '전체' || item.카테고리 === selectedCategory;
    const matchesGender =
      selectedGender === '전체' ||
      item.gender === selectedGender ||
      (selectedGender !== '공용' && item.gender === '공용') ||
      (!item.gender && selectedGender === '공용');
    const matchesSearch =
      searchQuery === '' ||
      item.이름.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.키워드.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.색상.some((c) => c.includes(searchQuery));
    const matchesStyle =
      selectedStyleFilter === '전체' || item.스타일.includes(selectedStyleFilter as any);

    return matchesCategory && matchesGender && matchesSearch && matchesStyle;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-stone-900" />
              <h2 className="text-xl font-bold text-stone-900">
                전체 의상 도감 ({MASTER_CLOTHING_LIST.length}벌)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                내 옷장 담김: {closetIds.size} / {MASTER_CLOTHING_LIST.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              소장하고 있는 옷의 체크박스를 눌러 내 옷장에 등록해보세요. 성별, 카테고리, 색상(레드, 그린, 버건디 등)별로 확인하고 세부 정보를 볼 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition"
            >
              모든 옷 내 옷장에 담기
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category & Gender Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Gender Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              {['전체', '남성', '여성', '공용'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedGender === g
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="의상 이름, 색상, 키워드 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredList.map((item) => {
          const isInCloset = closetIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onOpenItemModal(item)}
              className={`group bg-white rounded-2xl border transition flex flex-col justify-between overflow-hidden cursor-pointer ${
                isInCloset
                  ? 'border-stone-900 shadow-sm ring-1 ring-stone-900/10'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.이름}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                    {item.카테고리}
                  </span>

                  {/* Closet Checkmark Indicator */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleItem(item);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg shadow-sm transition flex items-center justify-center ${
                      isInCloset
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white/90 text-stone-600 hover:bg-stone-900 hover:text-white'
                    }`}
                    title={isInCloset ? '내 옷장에서 제거' : '내 옷장에 추가'}
                  >
                    {isInCloset ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.id}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {item.계절.join('/')}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition truncate">
                    {item.이름}
                  </h4>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs text-stone-600 truncate">
                      {item.색상.join(', ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.스타일.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600"
                      >
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleItem(item);
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1.5 ${
                    isInCloset
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                      : 'bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700'
                  }`}
                >
                  {isInCloset ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>내 옷장 소장 중</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>내 옷장에 추가</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
