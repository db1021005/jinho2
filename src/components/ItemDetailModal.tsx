/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClothingItem } from '../types/clothing';
import { X, Check, Plus, Tag, CloudSun, Calendar, Compass, Palette, KeyRound } from 'lucide-react';
import { MusinsaProductSearch } from './MusinsaProductSearch';

interface ItemDetailModalProps {
  item: ClothingItem | null;
  isInCloset: boolean;
  onToggleCloset: (item: ClothingItem) => void;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isInCloset,
  onToggleCloset,
  onClose,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 backdrop-blur-md rounded-full shadow-sm transition"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image & Header */}
        <div className="relative h-64 bg-stone-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.이름}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/90 text-stone-900 backdrop-blur-sm">
                  {item.카테고리}
                </span>
                {item.gender && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm ${
                      item.gender === '여성'
                        ? 'bg-rose-100/90 text-rose-800'
                        : item.gender === '남성'
                        ? 'bg-blue-100/90 text-blue-800'
                        : 'bg-stone-200/90 text-stone-800'
                    }`}
                  >
                    {item.gender}
                  </span>
                )}
                <span className="text-xs text-white/80 font-mono">
                  ID: {item.id}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {item.이름}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-stone-600 leading-relaxed">
            {item.desc}
          </p>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* 색상 */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col gap-1.5">
              <span className="text-stone-500 font-medium flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-700" />
                대표 색상
              </span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {item.색상.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-800 font-medium"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: item.hex }}
                    />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* 계절 */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col gap-1.5">
              <span className="text-stone-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-700" />
                적합 계절
              </span>
              <div className="flex flex-wrap gap-1">
                {item.계절.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* 날씨 */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col gap-1.5">
              <span className="text-stone-500 font-medium flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-stone-700" />
                추천 날씨
              </span>
              <div className="flex flex-wrap gap-1">
                {item.날씨.map((w) => (
                  <span key={w} className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 font-medium">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* 스타일 */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col gap-1.5">
              <span className="text-stone-500 font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-700" />
                스타일 무드
              </span>
              <div className="flex flex-wrap gap-1">
                {item.스타일.map((st) => (
                  <span key={st} className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 font-medium">
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* 상황 */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-stone-500 font-medium flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-stone-700" />
                추천 상황 (TPO)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.상황.map((sit) => (
                  <span key={sit} className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 font-medium">
                    {sit}
                  </span>
                ))}
              </div>
            </div>

            {/* 이미지 검색용 영어 키워드 */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col gap-1 sm:col-span-2">
              <span className="text-stone-500 font-medium flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-stone-700" />
                이미지 검색용 영어 키워드
              </span>
              <code className="text-stone-700 bg-white px-2 py-1 rounded border border-stone-200 font-mono text-[11px]">
                {item.키워드}
              </code>
            </div>
          </div>

          {/* Musinsa Search in Modal */}
          <div className="pt-2">
            <MusinsaProductSearch
              item={item}
              selectedStyle={item.스타일[0] || '캐주얼'}
              gender={item.gender === '여성' ? '여성' : '남성'}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {isInCloset ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                내 옷장에 등록되어 있습니다
              </span>
            ) : (
              <span>내 옷장에 등록되지 않은 옷입니다</span>
            )}
          </div>
          <button
            onClick={() => onToggleCloset(item)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-sm ${
              isInCloset
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                : 'bg-stone-900 hover:bg-black text-white'
            }`}
          >
            {isInCloset ? (
              <>
                <X className="w-4 h-4" />
                내 옷장에서 빼기
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                내 옷장에 추가하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
