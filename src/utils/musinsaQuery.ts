/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClothingItem } from '../types/clothing';

/**
 * 추천된 의상명 뒤에 사용자가 선택한 4번 스타일과 5번 선호 색상을 해시태그(#) 형태로 결합하여
 * 무신사 맞춤 검색어를 생성합니다.
 *
 * 예:
 * - 추천 의상: "흰 반팔", 스타일: "캐주얼", 선호 색상: "화이트"
 *   → "흰 반팔 #캐주얼 #화이트"
 * - 추천 의상: "흑청 데님", 스타일: "스트릿", 선호 색상: "블랙"
 *   → "흑청 데님 #스트릿 #블랙"
 * - 추천 의상: "검정 슬랙스", 스타일: "미니멀", 선호 색상: "블랙"
 *   → "검정 슬랙스 #미니멀 #블랙"
 * - 추천 의상: "니트", 스타일: "댄디", 선호 색상: "네이비"
 *   → "니트 #댄디 #네이비"
 * - 선호 색상이 '상관없음'인 경우 해당 의류의 대표 색상을 해시태그로 반영
 */
export function generateMusinsaQuery(
  item: ClothingItem,
  selectedStyle?: string,
  preferredColor?: string,
  gender?: string
): string {
  if (!item || !item.이름) return '';

  const itemName = item.이름.trim();
  const tags: string[] = [];

  // 성별 해시태그
  if (gender && gender.trim()) {
    tags.push(`#${gender.trim()}`);
  }

  // 4번 스타일 해시태그
  if (selectedStyle && selectedStyle.trim()) {
    tags.push(`#${selectedStyle.trim()}`);
  }

  // 5번 선호 색상 해시태그
  if (preferredColor && preferredColor !== '상관없음') {
    tags.push(`#${preferredColor.trim()}`);
  } else if (item.색상 && item.색상.length > 0) {
    tags.push(`#${item.색상[0]}`);
  }

  return `${itemName} ${tags.join(' ')}`.trim();
}
