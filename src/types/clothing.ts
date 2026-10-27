/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = '남성' | '여성';

export type Category = '상의' | '아우터' | '하의' | '신발';

export type Season = '봄' | '여름' | '가을' | '겨울';

export type Weather = '더움' | '따뜻함' | '선선함' | '쌀쌀함' | '추움' | '비';

export type Situation = '학교' | '데이트' | '친구와 약속' | '출근' | '운동' | '여행';

export type Style = '캐주얼' | '미니멀' | '댄디' | '스트릿' | '스포티' | '편안함';

export type ColorName =
  | '블랙'
  | '화이트'
  | '그레이'
  | '네이비'
  | '베이지'
  | '브라운'
  | '블루'
  | '레드'
  | '그린'
  | '버건디';

export type PreferredColor = ColorName | '상관없음';

export interface ClothingItem {
  id: string;
  이름: string;
  카테고리: Category;
  색상: ColorName[];
  계절: Season[];
  날씨: Weather[];
  스타일: Style[];
  상황: Situation[];
  gender?: '남성' | '여성' | '공용';
  키워드: string; // 이미지 검색용 영어 키워드
  image: string; // 고화질 패션 룩 이미지 URL
  hex: string; // 대표 색상 헥스코드
  desc: string; // 아이템 설명
}

export interface ColorPalette {
  name: string;
  paletteColors: { name: string; hex: string }[];
  description: string;
}

export interface StylingCondition {
  gender: Gender;
  season: Season;
  weather: Weather;
  situation: Situation;
  style: Style;
  preferredColor?: PreferredColor;
}

export interface OutfitCombination {
  id: string;
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  outer?: ClothingItem;
  score: number; // 0 - 100
  matchReasons: string[];
  stylingTip: string;
  moodTag: string;
  colorHarmony: string;
  recommendedPalette?: ColorPalette;
}

export interface SavedOutfit {
  id: string;
  name: string;
  createdAt: string;
  condition: StylingCondition;
  outfit: OutfitCombination;
  memo?: string;
}
