/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MASTER_CLOTHING_LIST } from '../data/clothingData';
import {
  Category,
  ClothingItem,
  ColorPalette,
  OutfitCombination,
  StylingCondition,
} from '../types/clothing';

export interface MatchingResult {
  hasMinimumItems: boolean;
  missingCategories: Category[];
  totalCombinationsEvaluated: number;
  bestPick: OutfitCombination | null;
  alternatives: OutfitCombination[];
  wishlistSuggestions: {
    item: ClothingItem;
    reason: string;
  }[];
}

// AI 자동 추천 컬러 팔레트 생성기
export function generateRecommendedPalette(items: ClothingItem[]): ColorPalette {
  const allColors = items.flatMap((i) => i.색상);
  const uniqueColors = Array.from(new Set(allColors));

  const paletteColors = items.map((i) => ({
    name: i.색상[0] || '베이직',
    hex: i.hex,
  }));

  const seen = new Set<string>();
  const uniquePaletteColors = paletteColors.filter((c) => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });

  if (allColors.includes('버건디')) {
    return {
      name: '고혹적인 버건디 와인 무드',
      paletteColors: uniquePaletteColors,
      description: '깊이 있는 버건디 컬러를 포인트로 우아하고 분위기 있는 감성을 살린 가을·겨울 추천 배색입니다.',
    };
  }
  if (allColors.includes('레드')) {
    return {
      name: '생기 넘치는 비비드 레드 포인트',
      paletteColors: uniquePaletteColors,
      description: '단조로울 수 있는 데일리 룩에 강렬한 레드 원포인트로 경쾌한 에너지를 불어넣는 트렌디한 배색입니다.',
    };
  }
  if (allColors.includes('그린')) {
    return {
      name: '차분하고 자연스러운 포레스트 그린 톤',
      paletteColors: uniquePaletteColors,
      description: '안정감 있고 세련된 그린 컬러가 도회적인 차분함과 자연스러운 멋을 자아내는 감각적인 배색입니다.',
    };
  }
  if (allColors.every((c) => c === '블랙')) {
    return {
      name: '올 블랙 시크 모노크롬',
      paletteColors: uniquePaletteColors,
      description: '군더더기 없는 올 블랙으로 슬림한 실루엣과 세련된 도시적 시크함을 완성하는 클래식 배색입니다.',
    };
  }
  if (allColors.includes('블랙') && allColors.includes('화이트') && uniqueColors.length <= 3) {
    return {
      name: '모던 블랙 & 화이트 대비',
      paletteColors: uniquePaletteColors,
      description: '명도 대비가 가장 돋보이는 블랙 & 화이트 조합으로 깔끔하고 실패 없는 단정함을 선사합니다.',
    };
  }
  if (allColors.includes('화이트') && allColors.includes('블루')) {
    return {
      name: '청량한 마린 & 블루 포인트',
      paletteColors: uniquePaletteColors,
      description: '시원하고 청량한 블루와 클린한 화이트가 어우러져 밝고 활기찬 인상을 주는 캐주얼 배색입니다.',
    };
  }
  if (allColors.includes('베이지') || allColors.includes('브라운')) {
    return {
      name: '포근한 얼씨 & 내추럴 톤온톤',
      paletteColors: uniquePaletteColors,
      description: '부드러운 베이지와 따뜻한 브라운이 조화롭게 스며들어 편안하면서도 온화한 무드를 연출합니다.',
    };
  }
  if (allColors.includes('네이비')) {
    return {
      name: '단정하고 신뢰감 주는 클래식 네이비',
      paletteColors: uniquePaletteColors,
      description: '단정함의 대명사인 네이비를 중심으로 지적이고 세련된 인상을 남기는 스마트 캐주얼 배색입니다.',
    };
  }
  return {
    name: '자연스러운 데일리 뉴트럴 톤',
    paletteColors: uniquePaletteColors,
    description: '어떤 자리에서도 튀지 않고 편안하게 녹아드는 베이직 뉴트럴 톤 조합입니다.',
  };
}

// 색상 조화도 판별 및 네이밍
function analyzeColorHarmony(items: ClothingItem[]): string {
  return generateRecommendedPalette(items).name;
}

// 스타일링 팁 및 추천 이유 생성기
function generateStylingTip(
  top: ClothingItem,
  bottom: ClothingItem,
  shoes: ClothingItem,
  outer: ClothingItem | undefined,
  condition: StylingCondition
): { tip: string; reasons: string[]; mood: string } {
  const reasons: string[] = [];

  // 상황 맞춤 이유 (사용자 지정 뉘앙스 엄격 반영)
  if (condition.situation === '학교') {
    reasons.push(`학교: 강의실과 캠퍼스 이동에 알맞게 ${top.이름}과 ${bottom.이름}으로 편안하고 가볍게 연출했습니다.`);
  } else if (condition.situation === '데이트') {
    reasons.push(`데이트: 상대방에게 호감을 주는 댄디하고 단정한 ${top.이름}과 ${shoes.이름} 중심의 깔끔한 조합입니다.`);
  } else if (condition.situation === '친구와 약속') {
    reasons.push(`친구와 약속: 너무 힘주지 않으면서도 센스 있는 '꾸민 듯 안 꾸민 듯(꾸안꾸)' 자연스러운 멋을 살렸습니다.`);
  } else if (condition.situation === '출근') {
    reasons.push(`출근: 너무 튀지 않고 단정하며 격식을 갖춘 ${bottom.이름}과 ${top.이름} 중심의 세미정장 룩입니다.`);
  } else if (condition.situation === '운동') {
    reasons.push(`운동: 땀 흡수와 큰 활동 반경을 고려하여 운동할 때 가장 편하고 쾌적할 수 있도록 구성했습니다.`);
  } else if (condition.situation === '여행') {
    reasons.push(`여행: 오래 걸어도 발이 피로하지 않고 구김 걱정 없이 활동성과 사진발을 모두 챙겼습니다.`);
  }

  // 스타일 맞춤 이유
  if (condition.style === '스포티') {
    reasons.push(`스포티: 운동할 때 편할 수 있게 활동성과 기능성이 뛰어난 아이템을 매치했습니다.`);
  } else if (condition.style === '편안함') {
    reasons.push(`편안함: 말 그대로 몸을 조이지 않고 일상에서 가장 편안한 복장으로 완성했습니다.`);
  } else if (condition.style === '댄디') {
    reasons.push(`댄디: 깔끔하게 떨어지는 실루엣과 단정한 정돈감이 돋보이는 룩입니다.`);
  } else if (condition.style === '미니멀') {
    reasons.push(`미니멀: 불필요한 군더더기를 덜어내고 절제된 실루엣과 톤의 조화에 집중했습니다.`);
  } else if (condition.style === '스트릿') {
    reasons.push(`스트릿: 감각적인 핏과 힙한 무드로 개성을 드러내는 트렌디한 스트릿 룩입니다.`);
  } else if (condition.style === '캐주얼') {
    reasons.push(`캐주얼: 매일 입어도 질리지 않는 베이직 아이템들의 조화로운 데일리 믹스매치입니다.`);
  }

  // 날씨 맞춤 이유
  if (condition.weather === '더움') {
    reasons.push(`더운 날씨에 통기성이 좋은 ${top.이름}과 시원한 ${bottom.이름}으로 쾌적함을 극대화했습니다.`);
  } else if (condition.weather === '추움') {
    if (outer) {
      reasons.push(`추운 겨울 날씨를 대비해 든든한 보온성의 ${outer.이름}을 매치했습니다.`);
    } else {
      reasons.push(`추운 기온에 대비해 도톰한 보온감의 ${top.이름}을 중심으로 코디했습니다.`);
    }
  } else if (condition.weather === '비') {
    if (outer?.이름.includes('바람막이')) {
      reasons.push(`비 오는 날 생활 방수와 활동성이 뛰어난 바람막이를 레이어드했습니다.`);
    } else if (shoes.이름.includes('크록스') || shoes.이름.includes('워커')) {
      reasons.push(`빗길에도 부담 없이 신을 수 있는 ${shoes.이름}으로 실용성을 챙겼습니다.`);
    }
  }

  // AI 자동 컬러 배색 분석 반영
  const currentPieces = [top, bottom, shoes, ...(outer ? [outer] : [])];
  const palette = generateRecommendedPalette(currentPieces);
  reasons.push(`추천 배색 [${palette.name}]: ${palette.description}`);

  // 스타일 연출 팁
  let tip = '';
  if (condition.situation === '데이트') {
    tip = `${top.이름}을 ${bottom.이름} 안에 단정하게 넣어 입고(턱인), ${shoes.이름}의 광택과 깔끔한 라인을 살려 신뢰감 넘치는 댄디룩을 완성해 보세요.`;
  } else if (condition.situation === '출근') {
    tip = `단정한 카라와 팬츠의 주름선이 깔끔하게 유지되도록 다듬고, 너무 화려한 액세서리 대신 모노톤의 차분함을 유지하여 신뢰감을 주세요.`;
  } else if (condition.situation === '친구와 약속') {
    tip = `상의를 자연스럽게 빼내어 입고 롤업이나 가벼운 레이어드로 포인트를 주면 무심한 듯 감각적인 '꾸안꾸' 매력이 살아납니다.`;
  } else if (condition.situation === '학교') {
    tip = `백팩이나 편안한 볼캡을 더해 캠퍼스 특유의 가볍고 활기찬 무드를 더해보세요.`;
  } else if (condition.situation === '운동' || condition.style === '스포티') {
    tip = `스트레칭이나 러닝 시 걸림이 없도록 팬츠 밑단을 정돈하고, 가볍고 쿠셔닝 좋은 슈즈로 발목 부담을 줄여주세요.`;
  } else if (condition.style === '편안함') {
    tip = `여유 있는 루즈핏으로 착용하여 하루 종일 몸이 답답하지 않고 아늑한 핏감을 누려보세요.`;
  } else if (outer) {
    tip = `${outer.이름}을 자연스럽게 오픈하여 이너인 ${top.이름}과의 입체적인 레이어드를 연출해보세요.`;
  } else {
    tip = `${top.이름}과 ${bottom.이름}의 색상 대비를 살려 심플하면서도 안정감 있는 실루엣을 만들어보세요.`;
  }

  // 분위기 태그 네이밍
  let mood = '';
  if (condition.situation === '학교') mood = '편안하고 가벼운 캠퍼스 룩';
  else if (condition.situation === '데이트') mood = '댄디하고 단정한 데이트 룩';
  else if (condition.situation === '친구와 약속') mood = '센스 넘치는 꾸안꾸 룩';
  else if (condition.situation === '출근') mood = '단정하고 신뢰감 있는 오피스 정장 룩';
  else if (condition.situation === '운동') mood = '운동할 때 편한 스포티 액티브 룩';
  else if (condition.style === '편안함') mood = '말 그대로 편안한 이지 데일리 룩';
  else mood = `${condition.situation}을 위한 ${condition.style} 픽`;

  return { tip, reasons, mood };
}

// 코디 매칭 엔진
export function recommendOutfits(
  closetItems: ClothingItem[],
  condition: StylingCondition
): MatchingResult {
  const isGenderMatch = (item: ClothingItem) =>
    !item.gender || item.gender === '공용' || item.gender === condition.gender;

  const tops = closetItems.filter((i) => i.카테고리 === '상의' && isGenderMatch(i));
  const bottoms = closetItems.filter((i) => i.카테고리 === '하의' && isGenderMatch(i));
  const shoes = closetItems.filter((i) => i.카테고리 === '신발' && isGenderMatch(i));
  const outers = closetItems.filter((i) => i.카테고리 === '아우터' && isGenderMatch(i));

  const missingCategories: Category[] = [];
  if (tops.length === 0) missingCategories.push('상의');
  if (bottoms.length === 0) missingCategories.push('하의');
  if (shoes.length === 0) missingCategories.push('신발');

  // 상의, 하의, 신발이 최소 1개씩 있어야 코디 조합 가능
  if (missingCategories.length > 0) {
    return {
      hasMinimumItems: false,
      missingCategories,
      totalCombinationsEvaluated: 0,
      bestPick: null,
      alternatives: [],
      wishlistSuggestions: generateWishlist(closetItems, condition),
    };
  }

  const combinations: OutfitCombination[] = [];

  // 아우터 필요도 판단
  const isColdWeather = condition.weather === '추움' || condition.weather === '쌀쌀함';
  const isHotWeather = condition.weather === '더움';

  // 아우터 후보군: 날씨가 더울 때는 아우터 없는 조합을 기본으로 하되, 쌀쌀하거나 추울 때는 아우터 있는 조합을 강력 추천
  const outerOptions: (ClothingItem | undefined)[] = [undefined, ...outers];

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        for (const outer of outerOptions) {
          // 더운 날씨에 두꺼운 패딩/코트는 제외
          if (isHotWeather && outer && (outer.이름 === '패딩' || outer.이름 === '코트')) {
            continue;
          }
          // 아주 추운 날씨에 반팔+반바지 조합은 현실성 낮으므로 감점/제외
          if (condition.weather === '추움' && bottom.이름 === '버뮤다팬츠') {
            continue;
          }

          let score = 50; // 기본 점수

          const currentPieces = [top, bottom, shoe, ...(outer ? [outer] : [])];

          // 1. 계절 적합도 (최대 +20점)
          for (const item of currentPieces) {
            if (item.계절.includes(condition.season)) {
              score += 5;
            } else {
              score -= 6;
            }
          }

          // 2. 날씨 적합도 (최대 +25점)
          for (const item of currentPieces) {
            if (item.날씨.includes(condition.weather)) {
              score += 6;
            } else {
              score -= 4;
            }
          }

          // 날씨별 특수 가산점
          if (isColdWeather) {
            if (outer) {
              score += 15;
              if (condition.weather === '추움' && outer.이름 === '패딩') score += 12;
              if (condition.weather === '추움' && outer.이름 === '코트') score += 10;
            } else {
              // 추운 날 아우터 없으면 감점
              score -= 20;
            }
          }

          if (isHotWeather) {
            if (outer) {
              score -= 15; // 더운데 아우터 입으면 감점
            } else {
              score += 10;
              if (top.이름.includes('반팔')) score += 8;
              if (bottom.이름 === '버뮤다팬츠' || shoe.이름 === '샌들') score += 10;
            }
          }

          if (condition.weather === '비') {
            if (outer?.이름 === '바람막이') score += 18;
            if (shoe.이름 === '크록스' || shoe.이름 === '워커') score += 15;
            if (shoe.이름 === '로퍼' || shoe.이름 === '샌들') score -= 12; // 비오는 날 비추천
          }

          // 3. 상황 적합도 (최대 +20점)
          for (const item of currentPieces) {
            if (item.상황.includes(condition.situation)) {
              score += 5;
            }
          }

          // 3. 상황별 엄격 매칭 (사용자 요구사항 상세 반영)
          if (condition.situation === '학교') {
            // 학교: 편안하고 가볍게
            const isComfortable =
              top.이름.includes('반팔') ||
              top.이름.includes('맨투맨') ||
              top.이름.includes('후드티') ||
              top.이름.includes('스트라이프') ||
              top.이름.includes('와플');
            const isLightBottom = bottom.이름.includes('데님') || bottom.이름.includes('치노');
            const isLightShoes = shoe.이름.includes('스니커즈') || shoe.이름.includes('캔버스') || shoe.이름.includes('러닝화');

            if (isComfortable) score += 10;
            if (isLightBottom) score += 8;
            if (isLightShoes) score += 8;

            // 너무 무겁고 격식 있는 정장류는 학교에 감점
            if (outer?.이름.includes('블레이저') || outer?.이름.includes('트렌치') || shoe.이름.includes('더비')) {
              score -= 16;
            }
          }

          if (condition.situation === '데이트') {
            // 데이트: 댄디하고 단정하게
            const isDandyTop =
              top.이름.includes('셔츠') ||
              top.이름.includes('니트') ||
              top.이름.includes('카디건');
            const isNeatBottom = bottom.이름.includes('슬랙스') || bottom.이름.includes('중청 데님');
            const isDandyShoes =
              shoe.이름.includes('로퍼') ||
              shoe.이름.includes('더비') ||
              shoe.이름.includes('독일군') ||
              shoe.이름.includes('흰 스니커즈');
            const isNeatOuter =
              outer?.이름.includes('코트') ||
              outer?.이름.includes('블레이저') ||
              outer?.이름.includes('트렌치') ||
              outer?.이름.includes('블루종');

            if (isDandyTop) score += 12;
            if (isNeatBottom) score += 10;
            if (isDandyShoes) score += 10;
            if (isNeatOuter) score += 8;

            // 후줄근하거나 너무 스포티한 복장은 데이트에 강력 감점
            if (shoe.이름.includes('크록스') || bottom.이름.includes('스웻팬츠') || bottom.이름.includes('파라슈트')) {
              score -= 28;
            }
          }

          if (condition.situation === '친구와 약속') {
            // 친구와 약속: 꾸민 듯 안 꾸민 듯 (꾸안꾸)
            const isEffortlessTop =
              top.이름.includes('반팔') ||
              top.이름.includes('맨투맨') ||
              top.이름.includes('니트') ||
              top.이름.includes('카디건') ||
              top.이름.includes('반집업');
            const isTrendyBottom =
              bottom.이름.includes('와이드') ||
              bottom.이름.includes('흑청') ||
              bottom.이름.includes('데님') ||
              bottom.이름.includes('치노');
            const isTrendyShoes =
              shoe.이름.includes('스니커즈') ||
              shoe.이름.includes('독일군') ||
              shoe.이름.includes('캔버스') ||
              shoe.이름.includes('로퍼');

            if (isEffortlessTop) score += 9;
            if (isTrendyBottom) score += 9;
            if (isTrendyShoes) score += 8;

            // 과도하게 꽉 묶인 풀정장이나 지나치게 늘어진 잠옷 스타일은 감점
            if (outer?.이름 === '블레이저' && shoe.이름 === '더비슈즈' && bottom.이름.includes('슬랙스')) {
              score -= 10; // 너무 출근/정장 느낌은 꾸안꾸와 거리
            }
          }

          if (condition.situation === '출근') {
            // 출근: 정장이나 너무 튀지 않게
            const isOfficeTop = top.이름.includes('셔츠') || top.이름.includes('니트') || top.이름.includes('카라');
            const isOfficeBottom = bottom.이름.includes('슬랙스');
            const isOfficeShoes = shoe.이름.includes('더비슈즈') || shoe.이름.includes('로퍼');
            const isOfficeOuter = outer?.이름.includes('블레이저') || outer?.이름.includes('코트') || outer?.이름.includes('맥코트');

            if (isOfficeTop) score += 12;
            if (isOfficeBottom) score += 14;
            if (isOfficeShoes) score += 12;
            if (isOfficeOuter) score += 10;

            // 튀거나 격식 없는 의상은 대폭 감점
            if (
              shoe.이름.includes('크록스') ||
              shoe.이름.includes('샌들') ||
              bottom.이름.includes('스웻팬츠') ||
              bottom.이름.includes('버뮤다') ||
              bottom.이름.includes('카고') ||
              top.이름.includes('그래픽')
            ) {
              score -= 35;
            }
          }

          if (condition.situation === '운동') {
            // 운동: 운동 할 때 편할 수 있게
            const isSportyTop = top.이름.includes('반팔') || top.이름.includes('맨투맨') || top.이름.includes('와플');
            const isSportyBottom = bottom.이름.includes('스웻팬츠') || bottom.이름.includes('파라슈트');
            const isSportyShoes = shoe.이름.includes('러닝화');
            const isSportyOuter = outer?.이름.includes('바람막이');

            if (isSportyTop) score += 10;
            if (isSportyBottom) score += 14;
            if (isSportyShoes) score += 18;
            if (isSportyOuter) score += 15;

            // 운동에 부적합한 포멀 의류 대폭 감점
            if (
              shoe.이름.includes('구두') ||
              shoe.이름.includes('로퍼') ||
              shoe.이름.includes('더비') ||
              bottom.이름.includes('슬랙스') ||
              top.이름.includes('셔츠') ||
              outer?.이름.includes('코트') ||
              outer?.이름.includes('블레이저')
            ) {
              score -= 40;
            }
          }

          if (condition.situation === '여행') {
            const isTravelShoes = shoe.이름.includes('러닝화') || shoe.이름.includes('스니커즈') || shoe.이름.includes('독일군');
            const isTravelBottom = bottom.이름.includes('데님') || bottom.이름.includes('스웻') || bottom.이름.includes('카고');
            if (isTravelShoes) score += 12;
            if (isTravelBottom) score += 10;
          }

          // 4. 스타일별 엄격 매칭
          if (condition.style === '스포티') {
            if (shoe.이름.includes('러닝화') || bottom.이름.includes('스웻') || outer?.이름.includes('바람막이')) {
              score += 15;
            }
            if (shoe.이름.includes('더비') || bottom.이름.includes('슬랙스')) score -= 20;
          }

          if (condition.style === '편안함') {
            // 편안함: 말 그대로 편안한 복장
            if (bottom.이름.includes('스웻') || top.이름.includes('후드') || top.이름.includes('맨투맨') || shoe.이름.includes('스니커즈') || shoe.이름.includes('크록스')) {
              score += 15;
            }
            if (shoe.이름.includes('더비') || outer?.이름.includes('블레이저')) score -= 18;
          }

          if (condition.style === '댄디') {
            if (top.이름.includes('셔츠') || bottom.이름.includes('슬랙스') || shoe.이름.includes('로퍼') || shoe.이름.includes('더비')) {
              score += 15;
            }
            if (shoe.이름.includes('크록스') || bottom.이름.includes('스웻팬츠')) score -= 22;
          }

          if (condition.style === '미니멀') {
            if (bottom.이름.includes('슬랙스') || shoe.이름.includes('독일군') || top.이름.includes('셔츠') || top.이름.includes('니트')) {
              score += 14;
            }
          }

          if (condition.style === '스트릿') {
            if (bottom.이름.includes('흑청') || bottom.이름.includes('와이드') || bottom.이름.includes('카고') || outer?.이름.includes('라이더') || outer?.이름.includes('바시티')) {
              score += 15;
            }
          }

          if (condition.style === '캐주얼') {
            if (bottom.이름.includes('데님') || shoe.이름.includes('스니커즈') || top.이름.includes('티셔츠') || top.이름.includes('반팔')) {
              score += 12;
            }
          }

          // 5. AI 자동 컬러 조화도 평가 (최대 +16점)
          const allColors = currentPieces.flatMap((i) => i.색상);
          const uniqueColors = Array.from(new Set(allColors));

          // 색상이 너무 난잡하지 않고 1~3가지 톤으로 정돈된 경우
          if (uniqueColors.length <= 3) {
            score += 7;
          }
          // 톤온톤 / 클래식 조화 배색
          if (
            (allColors.includes('블랙') && allColors.includes('화이트')) ||
            (allColors.includes('네이비') && allColors.includes('블루')) ||
            (allColors.includes('베이지') && allColors.includes('브라운')) ||
            (allColors.includes('그레이') && allColors.includes('블랙'))
          ) {
            score += 6;
          }
          // 포인트 컬러(레드, 그린, 버건디)가 무채색과 세련되게 조화될 때 가산점
          if (
            (allColors.includes('버건디') || allColors.includes('레드') || allColors.includes('그린')) &&
            (allColors.includes('블랙') || allColors.includes('화이트') || allColors.includes('그레이') || allColors.includes('네이비'))
          ) {
            score += 7;
          }

          // 색상 조화 계산 및 팔레트 생성
          const palette = generateRecommendedPalette(currentPieces);
          const colorHarmony = palette.name;

          // 점수 범위 0 ~ 99로 정규화
          const finalScore = Math.max(45, Math.min(99, Math.round(score)));

          const { tip, reasons, mood } = generateStylingTip(
            top,
            bottom,
            shoe,
            outer,
            condition
          );

          combinations.push({
            id: `outfit-${top.id}-${bottom.id}-${shoe.id}-${outer?.id || 'none'}`,
            top,
            bottom,
            shoes: shoe,
            outer,
            score: finalScore,
            matchReasons: reasons,
            stylingTip: tip,
            moodTag: mood,
            colorHarmony,
            recommendedPalette: palette,
          });
        }
      }
    }
  }

  // 점수 높은 순으로 정렬
  combinations.sort((a, b) => b.score - a.score);

  // 상위 베스트 픽 및 서로 다른 개성을 가진 대안 추천 선별
  const bestPick = combinations[0] || null;

  // 대안 조합들: 베스트 픽과 아이템이 2개 이상 겹치지 않는 다양한 조합 우선 선별
  const alternatives: OutfitCombination[] = [];
  for (let i = 1; i < combinations.length; i++) {
    const candidate = combinations[i];
    // 너무 비슷한 코디 방지: top 또는 bottom이 달라야 함
    const isDistinct =
      candidate.top.id !== bestPick?.top.id ||
      candidate.bottom.id !== bestPick?.bottom.id ||
      (candidate.outer?.id !== bestPick?.outer?.id);

    if (isDistinct) {
      // 이미 담긴 대안들과도 중복 최소화
      const alreadySimilar = alternatives.some(
        (alt) => alt.top.id === candidate.top.id && alt.bottom.id === candidate.bottom.id
      );
      if (!alreadySimilar) {
        alternatives.push(candidate);
      }
    }

    if (alternatives.length >= 4) break;
  }

  return {
    hasMinimumItems: true,
    missingCategories: [],
    totalCombinationsEvaluated: combinations.length,
    bestPick,
    alternatives,
    wishlistSuggestions: generateWishlist(closetItems, condition),
  };
}

// 사용자의 옷장에 없는 전체 옷 중, 현재 조건에 추가하면 시너지가 높은 위시리스트 아이템 제안
function generateWishlist(
  closetItems: ClothingItem[],
  condition: StylingCondition
): { item: ClothingItem; reason: string }[] {
  const closetIdSet = new Set(closetItems.map((i) => i.id));
  const isGenderMatch = (item: ClothingItem) =>
    !item.gender || item.gender === '공용' || item.gender === condition.gender;

  const missingItems = MASTER_CLOTHING_LIST.filter(
    (i) => !closetIdSet.has(i.id) && isGenderMatch(i)
  );

  const recommendations: { item: ClothingItem; reason: string; priority: number }[] = [];

  for (const item of missingItems) {
    let priority = 0;
    let reason = '';

    if (item.계절.includes(condition.season)) priority += 3;
    if (item.날씨.includes(condition.weather)) priority += 3;
    if (item.스타일.includes(condition.style)) priority += 3;
    if (item.상황.includes(condition.situation)) priority += 3;

    if (condition.weather === '추움' && item.카테고리 === '아우터' && (item.이름 === '패딩' || item.이름 === '코트')) {
      priority += 10;
      reason = `겨울철 한파를 든든하게 막아주면서 ${condition.style} 무드를 완벽하게 살려줄 아우터입니다.`;
    } else if (condition.weather === '비' && item.이름 === '바람막이') {
      priority += 8;
      reason = `비 오는 날 물방울을 튕겨내고 활동성을 보장하는 기능성 필수 아이템입니다.`;
    } else if (condition.situation === '출근' && (item.이름 === '블레이저' || item.이름 === '검정 슬랙스' || item.이름 === '더비슈즈')) {
      priority += 8;
      reason = `출근 시 신뢰감 있고 깔끔한 인상을 주는 에센셜 아이템입니다.`;
    } else if (condition.situation === '데이트' && (item.이름 === '니트' || item.이름 === '로퍼' || item.이름 === '트렌치코트')) {
      priority += 8;
      reason = `데이트에서 로맨틱하고 단정한 매력을 배가시켜 줄 추천 아이템입니다.`;
    } else if (condition.situation === '운동' && (item.이름 === '러닝화' || item.이름 === '스웻팬츠')) {
      priority += 8;
      reason = `운동 및 야외 레저 시 발과 몸이 가장 편안한 스포티 아이템입니다.`;
    } else {
      reason = `현재 선택한 ${condition.season} · ${condition.style} 스타일에 아주 잘 어울리는 아이템입니다.`;
    }

    if (priority >= 6) {
      recommendations.push({ item, reason, priority });
    }
  }

  recommendations.sort((a, b) => b.priority - a.priority);
  return recommendations.slice(0, 3).map(({ item, reason }) => ({ item, reason }));
}
