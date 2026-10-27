/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClothingItem } from '../types/clothing';
import { MusinsaProduct, MusinsaSearchResponse } from '../types/musinsa';
import { generateMusinsaQuery } from '../utils/musinsaQuery';
import { ShoppingBag, ChevronDown, ChevronUp, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface MusinsaProductSearchProps {
  item: ClothingItem;
  selectedStyle: string;
  preferredColor?: string;
  gender?: string;
  initialProducts?: MusinsaProduct[] | null;
}

export const MusinsaProductSearch: React.FC<MusinsaProductSearchProps> = ({
  item,
  selectedStyle,
  preferredColor,
  gender,
  initialProducts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<MusinsaProduct[] | null>(initialProducts || null);
  const [hasError, setHasError] = useState(false);

  // Sync initial products if provided from parent
  React.useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setHasError(false);
    }
  }, [initialProducts]);

  const query = generateMusinsaQuery(item, selectedStyle, preferredColor, gender);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Toggle open state
    const nextState = !isOpen;
    setIsOpen(nextState);

    // If opening and not yet fetched, fetch from server API
    if (nextState && products === null && !isLoading) {
      setIsLoading(true);
      setHasError(false);

      try {
        const res = await fetch('/api/musinsa/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: MusinsaSearchResponse = await res.json();

        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setHasError(false);
        } else {
          // No items or error returned
          setProducts([]);
          setHasError(true);
        }
      } catch (err) {
        console.error('Failed to search Musinsa items:', err);
        setProducts([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mt-2.5 pt-2.5 border-t border-stone-200/80">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition flex items-center justify-between gap-1 shadow-2xs"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span>🛍️</span>
          <span className="truncate">무신사에서 비슷한 상품 보기</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        )}
      </button>

      {/* Expanded Results Section */}
      {isOpen && (
        <div className="mt-2.5 p-3 rounded-xl bg-white border border-stone-200/90 shadow-xs space-y-2.5 animate-fade-in text-left">
          {/* Query Banner */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 border-b border-stone-100 pb-2">
            <span className="font-mono text-stone-700 truncate">
              검색어: <strong className="font-semibold text-stone-900">"{query}"</strong>
            </span>
            <span className="text-[10px] text-stone-400 shrink-0 ml-1">
              무신사 실시간
            </span>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-stone-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-stone-800" />
              <span>무신사 상품을 불러오는 중...</span>
            </div>
          )}

          {/* Error or No Results State */}
          {!isLoading && (hasError || (products && products.length === 0)) && (
            <div className="py-4 px-3 bg-stone-50 rounded-lg text-center space-y-1">
              <p className="text-xs font-medium text-stone-600 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
                <span>현재 무신사 상품 정보를 불러올 수 없습니다.</span>
              </p>
              <p className="text-[10px] text-stone-400">
                (API 키 미설정 또는 검색 결과 없음)
              </p>
            </div>
          )}

          {/* Product Cards (Up to 3 products) */}
          {!isLoading && products && products.length > 0 && (
            <div className="space-y-2">
              {products.map((prod, idx) => (
                <a
                  key={idx}
                  href={prod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/item flex items-center gap-2.5 p-2 rounded-lg bg-stone-50 hover:bg-stone-100/90 border border-stone-200/60 transition"
                >
                  {/* Photo */}
                  <div className="w-12 h-14 rounded-md bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition"
                        onError={(e) => {
                          // Hide broken image placeholder
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px]">
                        사진
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {prod.brand && (
                      <p className="text-[10px] font-bold text-stone-500 uppercase tracking-tight truncate">
                        {prod.brand}
                      </p>
                    )}
                    <h5 className="text-xs font-bold text-stone-900 group-hover/item:text-blue-600 transition truncate">
                      {prod.title}
                    </h5>
                    {prod.price && (
                      <p className="text-xs font-extrabold text-stone-900 mt-0.5">
                        {prod.price}
                      </p>
                    )}
                  </div>

                  {/* External Link Icon */}
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-900 shrink-0 ml-1 transition" />
                </a>
              ))}

              <p className="text-[10px] text-stone-400 pt-1 text-center">
                ※ 무신사 상품은 참고용 구매 링크이며 내 옷장에는 추가되지 않습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
