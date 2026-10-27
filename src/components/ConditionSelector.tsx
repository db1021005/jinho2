/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ColorName,
  Gender,
  PreferredColor,
  Season,
  Situation,
  Style,
  StylingCondition,
  Weather,
} from '../types/clothing';
import {
  COLOR_OPTIONS,
  GENDER_OPTIONS,
  SEASON_OPTIONS,
  SITUATION_OPTIONS,
  STYLE_OPTIONS,
  WEATHER_OPTIONS,
} from '../data/clothingData';
import {
  Sparkles,
  Sun,
  Flame,
  CloudSun,
  Wind,
  Snowflake,
  CloudRain,
  GraduationCap,
  Heart,
  Coffee,
  Briefcase,
  Dumbbell,
  Plane,
  Palette,
  RotateCcw,
  Users,
} from 'lucide-react';

interface ConditionSelectorProps {
  condition: StylingCondition;
  onChange: (updated: StylingCondition) => void;
  onReset: () => void;
  onSubmit: () => void;
  isClosetEmpty: boolean;
}

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  condition,
  onChange,
  onReset,
  onSubmit,
  isClosetEmpty,
}) => {
  // Season Icons & Colors
  const getSeasonIcon = (season: Season) => {
    switch (season) {
      case '봄':
        return '🌸';
      case '여름':
        return '☀️';
      case '가을':
        return '🍂';
      case '겨울':
        return '❄️';
    }
  };

  // Weather Icons
  const getWeatherIcon = (weather: Weather) => {
    switch (weather) {
      case '더움':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case '따뜻함':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case '선선함':
        return <Wind className="w-4 h-4 text-teal-500" />;
      case '쌀쌀함':
        return <CloudSun className="w-4 h-4 text-sky-500" />;
      case '추움':
        return <Snowflake className="w-4 h-4 text-blue-500" />;
      case '비':
        return <CloudRain className="w-4 h-4 text-indigo-500" />;
    }
  };

  // Situation Icons
  const getSituationIcon = (sit: Situation) => {
    switch (sit) {
      case '학교':
        return <GraduationCap className="w-4 h-4" />;
      case '데이트':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case '친구와 약속':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case '출근':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case '운동':
        return <Dumbbell className="w-4 h-4 text-emerald-600" />;
      case '여행':
        return <Plane className="w-4 h-4 text-sky-600" />;
    }
  };

  // Color Swatches
  const getColorHex = (color: PreferredColor) => {
    switch (color) {
      case '블랙':
        return '#0F172A';
      case '화이트':
        return '#F8FAFC';
      case '그레이':
        return '#64748B';
      case '네이비':
        return '#1E3A8A';
      case '베이지':
        return '#E5D5C5';
      case '브라운':
        return '#78350F';
      case '블루':
        return '#2563EB';
      case '레드':
        return '#EF4444';
      case '그린':
        return '#10B981';
      case '버건디':
        return '#831843';
      case '상관없음':
        return 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>오늘의 코디 조건 선택</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            성별, 계절, 날씨, 상황, 스타일을 선택하면 내 옷장의 옷으로 최적의 컬러 조합과 룩을 AI가 알아서 추천합니다.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition"
          title="기본 조건으로 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">초기화</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* 0. 성별 선택 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              성별 선택 (Gender)
            </label>
            <span className="text-xs text-stone-400 font-medium">
              {condition.gender === '남성' ? '남성 및 공용 의류로 추천됩니다' : '여성 및 공용 의류로 추천됩니다'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:max-w-md">
            {GENDER_OPTIONS.map((g) => {
              const isSelected = condition.gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ ...condition, gender: g })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold transition ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-[1.02]'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">{g === '남성' ? '👨 남성' : '👩 여성'}</span>
                  {isSelected && <span className="text-xs font-normal text-stone-300">선택됨</span>}
                </button>
              );
            })}
          </div>
        </div>
        {/* 1. 계절 */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            1. 계절 (Season)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SEASON_OPTIONS.map((season) => {
              const isSelected = condition.season === season;
              return (
                <button
                  key={season}
                  type="button"
                  onClick={() => onChange({ ...condition, season })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-[1.02]'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">{getSeasonIcon(season)}</span>
                  <span>{season}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 날씨 */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            2. 날씨 (Weather)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {WEATHER_OPTIONS.map((weather) => {
              const isSelected = condition.weather === weather;
              return (
                <button
                  key={weather}
                  type="button"
                  onClick={() => onChange({ ...condition, weather })}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-[1.02]'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {getWeatherIcon(weather)}
                  <span>{weather}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 상황 */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            4. 상황 (Occasion / TPO)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SITUATION_OPTIONS.map((sit) => {
              const isSelected = condition.situation === sit;
              return (
                <button
                  key={sit}
                  type="button"
                  onClick={() => onChange({ ...condition, situation: sit })}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-[1.02]'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {getSituationIcon(sit)}
                  <span className="truncate">{sit}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 스타일 */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            5. 스타일 (Mood & Style)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = condition.style === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => onChange({ ...condition, style })}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition text-center ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-[1.02]'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  #{style}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI 자동 컬러 큐레이션 안내 */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-stone-900 text-white shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <span>스마트 AI 컬러 조합 자동 추천</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                색상 자동 추천
              </span>
            </div>
            <p className="text-stone-500 mt-0.5 leading-relaxed">
              선택하신 조건(성별, 계절, 상황, 스타일)에 맞춰 모노크롬, 톤온톤, 포인트 컬러(레드·그린·버건디 등)의 가장 조화로운 색상 배색을 AI가 내 옷장 속 옷들로 알아서 조합하여 추천해 드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-7 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-500">
          현재 선택: <strong className="text-stone-900 font-semibold">{condition.gender}</strong> ·{' '}
          <strong className="text-stone-900 font-semibold">{condition.season}</strong> ·{' '}
          <strong className="text-stone-900 font-semibold">{condition.weather}</strong> ·{' '}
          <strong className="text-stone-900 font-semibold">{condition.situation}</strong> ·{' '}
          <strong className="text-stone-900 font-semibold">{condition.style}</strong>
          {' '}· <span className="text-emerald-700 font-medium">색상 AI 자동 배색 추천</span>
        </div>

        <button
          onClick={onSubmit}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>내 옷장 맞춤 코디 추천받기</span>
        </button>
      </div>
    </div>
  );
};
