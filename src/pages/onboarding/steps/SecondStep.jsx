import { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { getExceptionFoodIngredients, postInitFoodIngredients } from '@/api/foodIngredientApi';
import PillButton from '@/common/PillButton';

import broccoli from '../../../assets/onboarding/allergies/broccoli.svg';
import cheese from '../../../assets/onboarding/allergies/cheese.svg';
import clearIcon from '../../../assets/onboarding/allergies/clear.svg';
import crab from '../../../assets/onboarding/allergies/crab.svg';
import cucumber from '../../../assets/onboarding/allergies/cucumber.svg';
import egg from '../../../assets/onboarding/allergies/egg.svg';
import fish from '../../../assets/onboarding/allergies/fish.svg';
import garlic from '../../../assets/onboarding/allergies/garlic.svg';
import gluten from '../../../assets/onboarding/allergies/gluten.svg';
import milk from '../../../assets/onboarding/allergies/milk.svg';
import nuts from '../../../assets/onboarding/allergies/nuts.svg';
import onion from '../../../assets/onboarding/allergies/onion.svg';
import peach from '../../../assets/onboarding/allergies/peach.svg';
import peanut from '../../../assets/onboarding/allergies/peanut.svg';
import searchIcon from '../../../assets/onboarding/allergies/search.svg';
import shellfish1 from '../../../assets/onboarding/allergies/shellfish-1.svg';
import shellfish2 from '../../../assets/onboarding/allergies/shellfish-2.svg';
import shrimp from '../../../assets/onboarding/allergies/shrimp.svg';
import soy from '../../../assets/onboarding/allergies/soy.svg';
import squid from '../../../assets/onboarding/allergies/squid.svg';
import tomato from '../../../assets/onboarding/allergies/tomato.svg';
import wheat1 from '../../../assets/onboarding/allergies/wheat-1.svg';
import wheat2 from '../../../assets/onboarding/allergies/wheat-2.svg';
import wheat3 from '../../../assets/onboarding/allergies/wheat-3.svg';

/* 추천 재료 목록(아이콘 + 이름) */
const RECOMMENDED = [
  { id: 'milk', name: '우유', icon: milk, type: 'MILK' },
  { id: 'cheese', name: '치즈', icon: cheese, type: 'MILK' },
  { id: 'wheat', name: '밀', icon: [wheat1, wheat2, wheat3], type: 'GRAIN' },
  { id: 'egg', name: '달걀', icon: egg, type: 'EGG' },
  { id: 'shrimp', name: '새우', icon: shrimp, type: 'FISH_AND_OTHER_SEAFOOD' },
  { id: 'crab', name: '게', icon: crab, type: 'CRAB' },
  { id: 'soy', name: '대두', icon: soy, type: 'LEGUME' },
  { id: 'squid', name: '오징어', icon: squid, type: 'CEPHALOPOD' },
  { id: 'gluten', name: '글루텐', icon: gluten, type: 'GRAIN' },
  { id: 'peanut', name: '땅콩', icon: peanut, type: 'NUT_AND_SEED' },
  { id: 'nuts', name: '견과류', icon: nuts, type: 'NUT_AND_SEED' },
  { id: 'fish', name: '생선', icon: fish, type: 'FISH_AND_OTHER_SEAFOOD' },
  { id: 'buckwheat', name: '메밀', icon: [wheat1, wheat2, wheat3], type: 'GRAIN' },
  { id: 'sesame', name: '참깨', icon: peanut, type: 'NUT_AND_SEED' },
  { id: 'cucumber', name: '오이', icon: cucumber, type: 'VEGETABLE' },
  { id: 'tomato', name: '토마토', icon: tomato, type: 'VEGETABLE' },
  { id: 'peach', name: '복숭아', icon: peach, type: 'FRUIT' },
  { id: 'shellfish', name: '조개류', icon: [shellfish1, shellfish2], type: 'SHELLFISH' },
];

/* 검색으로만 나오는 추가 재료 */
const EXTRA = [
  { id: 'yang', name: '양', icon: onion, type: 'MEAT' },
  { id: 'onion', name: '양파', icon: garlic, type: 'VEGETABLE' },
  { id: 'lamb', name: '양고기', icon: cucumber, type: 'MEAT' },
  { id: 'broccoli', name: '브로콜리', icon: broccoli, type: 'VEGETABLE' },
];

export const INGREDIENTS = [...RECOMMENDED, ...EXTRA];
const ALL = INGREDIENTS;

/* 제외 대표 식재료 → 화면용. SecondaryUnit / 수량은 사용하지 않음 */
const mapExceptionIngredients = (data) =>
  (data ?? []).map((item) => {
    const dummyItem = INGREDIENTS.find(
      (ingredient) => ingredient.name === item.foodIngredientName
    );

    return {
      id: item.foodIngredientId,
      name: item.foodIngredientName,
      type: item.foodIngredientType,
      icon: dummyItem?.icon,
    };
  });

/* 이름 길이순 → 같으면 한글 자음순 */
const byLengthThenKo = (a, b) =>
  a.name.length - b.name.length || a.name.localeCompare(b.name, 'ko');

/* 재료 아이콘(단일이미지 또는 겹친 레이어) */
export function IngredientIcon({ icon }) {
  if (Array.isArray(icon)) {
    return (
      /* 겹친 아이콘용 정사각 프레임(19×19) */
      <IconStack>
        {icon.map((src) => (
          <IconImg key={src} src={src} alt="" />
        ))}
      </IconStack>
    );
  }
  /* 단일 아이콘 정사각 이미지(19×19) */
  return <IconImg src={icon} alt="" />;
}

function SecondStep({ selectedIds, onToggle }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState(RECOMMENDED);

  /* 제외 대표 식재료 조회 API — 목록이 없으면 세팅 후 재조회 */
  useEffect(() => {
    const fetchExceptionIngredients = async () => {
      try {
        let response = await getExceptionFoodIngredients();
        let mapped = mapExceptionIngredients(response.data);

        if (mapped.length === 0) {
          await postInitFoodIngredients();
          response = await getExceptionFoodIngredients();
          mapped = mapExceptionIngredients(response.data);
        }

        if (mapped.length > 0) {
          setItems(mapped);
        }
      } catch (error) {
        console.error('제외 식재료 조회 실패:', error);
      }
    };

    fetchExceptionIngredients();
  }, []);

  const q = query.trim();

  const visible = useMemo(() => {
    if (!q) {
      return [...items].sort(byLengthThenKo);
    }
    return items.filter((item) => item.name.includes(q)).sort(byLengthThenKo);
  }, [q, items]);

  return (
    /* 2단계 본문 세로 스크롤 영역 */
    <Wrap>
      {/* 제목·부제 텍스트 세로 스택 */}
      <Header>
        {/* 메인 제목 텍스트 */}
        <Title>피하고 싶은 재료가 있나요?</Title>
        {/* 부제 텍스트(2줄) */}
        <Subtitle>
          알레르기가 있거나 싫어하는 재료를 고르면
          <br />
          추천에서 제외해드릴게요.
        </Subtitle>
      </Header>

      {/* 검색 입력 박스(라운드 사각형) */}
      <SearchBox>
        {/* 검색 돋보기 아이콘(22×22) */}
        <SearchIcon src={searchIcon} alt="" />
        {/* 검색 입력 필드 */}
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="피하고 싶은 재료 검색"
          aria-label="재료 검색"
        />
        {q && (
          /* 검색어 지우기 투명 버튼 */
          <ClearBtn type="button" onClick={() => setQuery('')} aria-label="검색어 지우기">
            {/* 지우기 X 원형 아이콘(16×16) */}
            <ClearImg src={clearIcon} alt="" />
          </ClearBtn>
        )}
      </SearchBox>

      {/* 재료 선택 알약 칩 줄(줄바꿈) */}
      <ChipRow>
        {visible.map((item) => (
          <PillButton
            key={item.id}
            kind="INGREDIENT"
            detailType={item.type}
            name={item.name}
            isSelected={selectedIds.includes(item.id)}
            onClick={() => onToggle(item.id)}
          />
        ))}
      </ChipRow>
    </Wrap>
  );
}

/* 하단 선택 칩 목록(X + 아이콘 + 이름, 여러 줄) */
export function SelectedChips({ selectedIds, onRemove }) {
  const [items, setItems] = useState(ALL);

  /* 선택된 ID와 이름을 연결하기 위해 실제 API 데이터 조회 */
  useEffect(() => {
    const fetchExceptionIngredients = async () => {
      try {
        const response = await getExceptionFoodIngredients();
        const mapped = mapExceptionIngredients(response.data);

        if (mapped.length > 0) {
          setItems(mapped);
        }
      } catch (error) {
        console.error('선택 제외 식재료 조회 실패:', error);
      }
    };

    fetchExceptionIngredients();
  }, []);

  const selected = selectedIds.map((id) => items.find((item) => item.id === id)).filter(Boolean);

  if (!selected.length) return null;

  return (
    /* 선택 칩 줄바꿈 행 */
    <SelectedRow>
      {selected.map((item) => (
        <PillButton
          key={item.id}
          kind="INGREDIENT"
          detailType={item.type}
          name={item.name}
          deleteAvailable
          onClick={() => onRemove(item.id)}
        />
      ))}
    </SelectedRow>
  );
}

/* ——— 레이아웃 ——— */

/* 2단계 본문 — 제목·검색은 고정, 재료 목록만 스크롤 */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 40px 20px 0;
  overflow: hidden;
`;

/* 제목·부제 세로 스택 */
const Header = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  padding: 0 12px;
`;

/* 메인 제목 텍스트 */
const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.48px;
  color: #030303;
`;

/* 부제 텍스트(2줄) */
const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.16px;
  color: #bebebf;
`;

/* 검색창 라운드 사각형(흰 배경 + 그림자, 340×48) */
const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  max-width: 340px;
  height: 48px;
  margin: 37px auto 0;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
`;

/* 검색 돋보기 아이콘(22×22) */
const SearchIcon = styled.img`
  position: absolute;
  left: 20px;
  width: 22px;
  height: 22px;
`;

/* 검색 입력 필드(투명 직사각) */
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0 44px 0 52px;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;

  &::placeholder {
    color: #bebebf;
  }
`;

/* 검색어 지우기 투명 버튼 */
const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

/* 지우기 X 원형 아이콘(16×16) */
const ClearImg = styled.img`
  width: 16px;
  height: 16px;
`;

/* 재료 칩 래핑 줄(검색·확인 버튼 사이 세로 스크롤) */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  flex: 1;
  min-height: 0;
  gap: 12px 4px;
  margin-top: 28px;
  padding: 16px 12px 24px;
  overflow-y: auto;
`;

/* 겹친 아이콘용 정사각 프레임(19×19) */
const IconStack = styled.span`
  position: relative;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
`;

/* 재료 아이콘 정사각 이미지(19×19) */
const IconImg = styled.img`
  display: block;
  width: 19px;
  height: 19px;
  object-fit: contain;

  ${IconStack} & {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

/* 하단 선택 칩 줄바꿈 행 */
const SelectedRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;
`;

export default SecondStep;
