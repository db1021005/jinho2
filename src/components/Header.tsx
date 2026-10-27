/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Shirt, Layers, BookmarkCheck, HeartHandshake } from 'lucide-react';

export type TabType = 'recommend' | 'closet' | 'catalog' | 'saved';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  closetCount: number;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  closetCount,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('recommend')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-stone-900 font-serif">
                  Style Pick
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold border border-stone-200">
                  스타일 픽
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                내 옷장 옷으로 완성하는 데일리 맞춤 코디
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('recommend')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'recommend'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>코디 추천</span>
            </button>

            <button
              onClick={() => setActiveTab('closet')}
              className={`relative flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'closet'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>내 옷장</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeTab === 'closet'
                    ? 'bg-amber-400 text-stone-950'
                    : 'bg-stone-200 text-stone-800'
                }`}
              >
                {closetCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">전체 의상</span>
              <span>도감</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`relative flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden sm:inline">저장한 코디</span>
              <span className="sm:hidden">저장</span>
              {savedCount > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activeTab === 'saved'
                      ? 'bg-rose-400 text-white'
                      : 'bg-stone-200 text-stone-800'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
