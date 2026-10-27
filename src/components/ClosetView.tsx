/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Category, ClothingItem } from '../types/clothing';
import { CATEGORIES, MASTER_CLOTHING_LIST } from '../data/clothingData';
import {
  Shirt,
  Trash2,
  Sparkles,
  Search,
  Plus,
  Check,
  X,
  AlertCircle,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ClosetViewProps {
  closetIds: Set<string>;
  onToggleItem: (item: ClothingItem) => void;
  onAddCapsuleWardrobe: () => void;
  onSelectAll: () => void;
  onClearCloset: () => void;
  onOpenItemModal: (item: ClothingItem) => void;
  onGoToRecommend: () => void;
  onGoToCatalog: () => void;
}

export const ClosetView: React.FC<ClosetViewProps> = ({
  closetIds,
  onToggleItem,
  onAddCapsuleWardrobe,
  onSelectAll,
  onClearCloset,
  onOpenItemModal,
  onGoToRecommend,
  onGoToCatalog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add modal filter states
  const [addCategory, setAddCategory] = useState<string>('전체');
  const [addGender, setAddGender] = useState<string>('전체');
  const [addSearch, setAddSearch] = useState('');

  // Get items in user closet
  const closetItems = MASTER_CLOTHING_LIST.filter((item) => closetIds.has(item.id));

  // Category counts
  const topCount = closetItems.filter((i) => i.카테고리 === '상의').length;
  const outerCount = closetItems.filter((i) => i.카테고리 === '아우터').length;
  const bottomCount = closetItems.filter((i) => i.카테고리 === '하의').length;
  const shoeCount = closetItems.filter((i) => i.카테고리 === '신발').length;

  const totalTops = MASTER_CLOTHING_LIST.filter((i) => i.카테고리 === '상의').length;
  const totalOuters = MASTER_CLOTHING_LIST.filter((i) => i.카테고리 === '아우터').length;
  const totalBottoms = MASTER_CLOTHING_LIST.filter((i) => i.카테고리 === '하의').length;
  const totalShoes = MASTER_CLOTHING_LIST.filter((i) => i.카테고리 === '신발').length;

  // Category Order Definition
  const categoryOrder: Record<string, number> = {
    상의: 1,
    아우터: 2,
    하의: 3,
    신발: 4,
  };

  // Filtered items in closet (strictly sorted by category: 상의 -> 아우터 -> 하의 -> 신발)
  const filteredItems = closetItems
    .filter((item) => {
      const matchesCategory =
        selectedCategory === '전체' || item.카테고리 === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.이름.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.색상.some((c) => c.includes(searchQuery)) ||
        item.스타일.some((s) => s.includes(searchQuery));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const catDiff = (categoryOrder[a.카테고리] || 99) - (categoryOrder[b.카테고리] || 99);
      if (catDiff !== 0) return catDiff;
      return a.id.localeCompare(b.id);
    });

  // Filtered items for Add Modal
  const candidateAddItems = MASTER_CLOTHING_LIST.filter((item) => {
    const matchesCat = addCategory === '전체' || item.카테고리 === addCategory;
    const matchesGen =
      addGender === '전체' ||
      item.gender === addGender ||
      (!item.gender && addGender === '공용');
    const matchesSrch =
      addSearch === '' ||
      item.이름.toLowerCase().includes(addSearch.toLowerCase()) ||
      item.색상.some((c) => c.includes(addSearch)) ||
      item.스타일.some((s) => s.includes(addSearch));
    return matchesCat && matchesGen && matchesSrch;
  });

  const canRecommend = topCount > 0 && bottomCount > 0 && shoeCount > 0;

  return (
    <div className="space-y-6">
      {/* Overview & Stats Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shirt className="w-5 h-5 text-stone-900" />
              <h2 className="text-xl font-bold text-stone-900">내 옷장 (My Closet)</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-900 text-white">
                {closetItems.length}벌 보유
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              실제로 소장하고 계신 옷들을 자유롭게 추가하고 빼보세요. Style Pick은 여기에 담긴 옷만 활용하여 코디를 완성합니다.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="옷장에 새 옷 추가하기"
            >
              <Plus className="w-4 h-4" />
              <span>+ 옷장에 새 옷 추가하기</span>
            </button>

            <button
              onClick={onAddCapsuleWardrobe}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="기본 필수템 원클릭 추가"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>기본 캡슐 옷장 세트 담기</span>
            </button>

            <button
              onClick={onSelectAll}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
              title="전체 옷 담기"
            >
              전체 담기 ({MASTER_CLOTHING_LIST.length}벌)
            </button>

            {closetItems.length > 0 && (
              <button
                onClick={onClearCloset}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-stone-600 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title="내 옷장 초기화"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>옷장 비우기</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Breakdown Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div
            onClick={() => setSelectedCategory('상의')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              selectedCategory === '상의'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-100 bg-stone-50/50 hover:bg-stone-100/60'
            }`}
          >
            <div className="text-xs text-stone-500 font-medium">상의</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">
              {topCount} <span className="text-xs font-normal text-stone-400">/ {totalTops}</span>
            </div>
            {topCount === 0 && (
              <span className="text-[10px] text-rose-500 font-semibold">필수 추가 필요</span>
            )}
          </div>

          <div
            onClick={() => setSelectedCategory('아우터')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              selectedCategory === '아우터'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-100 bg-stone-50/50 hover:bg-stone-100/60'
            }`}
          >
            <div className="text-xs text-stone-500 font-medium">아우터</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">
              {outerCount} <span className="text-xs font-normal text-stone-400">/ {totalOuters}</span>
            </div>
            <span className="text-[10px] text-stone-400">간절기/겨울 필수</span>
          </div>

          <div
            onClick={() => setSelectedCategory('하의')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              selectedCategory === '하의'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-100 bg-stone-50/50 hover:bg-stone-100/60'
            }`}
          >
            <div className="text-xs text-stone-500 font-medium">하의</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">
              {bottomCount} <span className="text-xs font-normal text-stone-400">/ {totalBottoms}</span>
            </div>
            {bottomCount === 0 && (
              <span className="text-[10px] text-rose-500 font-semibold">필수 추가 필요</span>
            )}
          </div>

          <div
            onClick={() => setSelectedCategory('신발')}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              selectedCategory === '신발'
                ? 'border-stone-900 bg-stone-50'
                : 'border-stone-100 bg-stone-50/50 hover:bg-stone-100/60'
            }`}
          >
            <div className="text-xs text-stone-500 font-medium">신발</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">
              {shoeCount} <span className="text-xs font-normal text-stone-400">/ {totalShoes}</span>
            </div>
            {shoeCount === 0 && (
              <span className="text-[10px] text-rose-500 font-semibold">필수 추가 필요</span>
            )}
          </div>
        </div>

        {/* Readiness Status Banner */}
        <div className="mt-4">
          {canRecommend ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>상의, 하의, 신발이 모두 준비되어 맞춤 코디 추천을 받을 수 있습니다!</span>
              </span>
              <button
                onClick={onGoToRecommend}
                className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline underline-offset-2 shrink-0 ml-2"
              >
                <span>코디 추천받기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="text-amber-900 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  코디를 조합하려면 <strong>상의, 하의, 신발이 최소 1벌씩</strong> 필요합니다.
                </span>
              </span>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 underline underline-offset-2 shrink-0 cursor-pointer"
              >
                <span>+ 지금 바로 옷장에 추가하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
              {cat !== '전체' && (
                <span className="ml-1 text-[10px] text-stone-400">
                  (
                  {cat === '상의'
                    ? topCount
                    : cat === '아우터'
                    ? outerCount
                    : cat === '하의'
                    ? bottomCount
                    : shoeCount}
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="내 옷장에서 검색 (셔츠, 슬랙스...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition"
          />
        </div>
      </div>

      {/* Empty State */}
      {closetItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center">
            <Shirt className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            내 옷장에 담긴 옷이 아직 없습니다
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            가지고 계신 옷을 옷장에 추가하거나, 버튼 한 번으로 기본 캡슐 옷장을 채워보세요!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ 옷장에 새 옷 추가하기</span>
            </button>
            <button
              onClick={onAddCapsuleWardrobe}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>기본 캡슐 옷장 세트 담기</span>
            </button>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
          검색 조건에 맞는 옷이 내 옷장에 없습니다.
        </div>
      ) : (
        /* Items Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Quick Add Card */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="aspect-[4/5] rounded-2xl border-2 border-dashed border-stone-300 hover:border-blue-600 hover:bg-blue-50/40 transition flex flex-col items-center justify-center p-4 text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-stone-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-stone-500 flex items-center justify-center mb-2.5 transition shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-stone-800 group-hover:text-blue-600">
              새 옷 추가하기
            </span>
            <span className="text-[10px] text-stone-400 mt-1">
              보유한 옷 골라 담기
            </span>
          </button>

          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItemModal(item)}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md hover:border-stone-900 transition flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.이름}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                    {item.카테고리}
                  </span>

                  {item.gender && (
                    <span className="absolute top-2 left-12 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-stone-800/70 text-stone-200 backdrop-blur-sm">
                      {item.gender}
                    </span>
                  )}

                  {/* Remove Button on Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleItem(item);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/95 text-stone-700 hover:bg-rose-500 hover:text-white transition shadow-sm cursor-pointer"
                    title="옷장에서 빼기"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-600 transition truncate">
                    {item.이름}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {item.색상.join(', ')} · {item.계절.join('/')}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-3 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleItem(item);
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                  title="내 옷장에서 이 옷 빼기"
                >
                  <X className="w-3 h-3" />
                  <span>옷장에서 빼기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* IN-TAB MODAL: + 옷장에 새 옷 추가하기 (추가 & 빼기 양방향 관리) */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>옷장에 옷 추가 및 관리</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                    현재 담김: {closetIds.size}벌
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  클릭 한 번으로 내 옷장에 옷을 추가하거나 뺄 수 있습니다.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 transition cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-4 border-b border-stone-100 space-y-3 bg-white">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="추가할 옷 검색 (예: 블라우스, 셔츠, 트위드, 니트, 부츠, 레드...)"
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition"
                />
              </div>

              {/* Category & Gender Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Category Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setAddCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        addCategory === cat
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Gender Tabs */}
                <div className="flex items-center gap-1">
                  {['전체', '남성', '여성', '공용'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setAddGender(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        addGender === g
                          ? 'bg-blue-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Items Grid */}
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {candidateAddItems.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs">
                  검색 결과와 일치하는 의류가 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {candidateAddItems.map((item) => {
                    const isInCloset = closetIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border transition flex flex-col justify-between ${
                          isInCloset
                            ? 'border-blue-500 bg-blue-50/30'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div>
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 mb-2">
                            <img
                              src={item.image}
                              alt={item.이름}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-900/80 text-white">
                              {item.카테고리}
                            </span>
                            {item.gender && (
                              <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-800/80 text-stone-200">
                                {item.gender}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mb-0.5">
                            <span
                              className="w-2 h-2 rounded-full border border-stone-300"
                              style={{ backgroundColor: item.hex }}
                            />
                            <h5 className="font-bold text-xs text-stone-900 truncate">
                              {item.이름}
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate">
                            {item.색상.join(', ')}
                          </p>
                        </div>

                        {/* Toggle Button */}
                        <div className="mt-2.5">
                          {isInCloset ? (
                            <button
                              onClick={() => onToggleItem(item)}
                              className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-rose-600 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 group/btn cursor-pointer"
                              title="옷장에서 빼기"
                            >
                              <Check className="w-3 h-3 group-hover/btn:hidden" />
                              <X className="w-3 h-3 hidden group-hover/btn:inline" />
                              <span className="group-hover/btn:hidden">담김</span>
                              <span className="hidden group-hover/btn:inline">옷장에서 빼기</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleItem(item)}
                              className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                              title="내 옷장에 추가하기"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ 옷장에 추가</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50">
              <span className="text-xs text-stone-500">
                현재 내 옷장: <strong className="text-stone-900 font-bold">{closetIds.size}벌</strong> 담김
              </span>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
