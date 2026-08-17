import { useMemo, useState } from 'react';
import styled from 'styled-components';

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
import removeIcon from '../../../assets/onboarding/allergies/remove.svg';
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
  { id: 'milk', name: '우유', icon: milk },
  { id: 'cheese', name: '치즈', icon: cheese },
  { id: 'wheat', name: '밀', icon: [wheat1, wheat2, wheat3] },
  { id: 'egg', name: '달걀', icon: egg },
  { id: 'shrimp', name: '새우', icon: shrimp },
  { id: 'crab', name: '게', icon: crab },
  { id: 'soy', name: '대두', icon: soy },
  { id: 'squid', name: '오징어', icon: squid },
  { id: 'gluten', name: '글루텐', icon: gluten },
  { id: 'peanut', name: '땅콩', icon: peanut },
  { id: 'nuts', name: '견과류', icon: nuts },
  { id: 'fish', name: '생선', icon: fish },
  { id: 'buckwheat', name: '메밀', icon: [wheat1, wheat2, wheat3] },
  { id: 'sesame', name: '참깨', icon: peanut },
  { id: 'cucumber', name: '오이', icon: cucumber },
  { id: 'tomato', name: '토마토', icon: tomato },
  { id: 'peach', name: '복숭아', icon: peach },
  { id: 'shellfish', name: '조개류', icon: [shellfish1, shellfish2] },
];

/* 검색으로만 나오는 추가 재료 */
const EXTRA = [
  { id: 'yang', name: '양', icon: onion },
  { id: 'onion', name: '양파', icon: garlic },
  { id: 'lamb', name: '양고기', icon: cucumber },
  { id: 'broccoli', name: '브로콜리', icon: broccoli },
];

export const INGREDIENTS = [...RECOMMENDED, ...EXTRA];
const ALL = INGREDIENTS;

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
  const q = query.trim();

  const visible = useMemo(() => {
    if (!q) {
      return [...RECOMMENDED].sort(byLengthThenKo);
    }
    return ALL.filter((item) => item.name.includes(q)).sort(byLengthThenKo);
  }, [q]);

  return (
    /* 2단계 본문 세로 스크롤 영역 */
    <Wrap>
      {/* 제목·부제 텍스트 세로 스택 */}
      <Header>
        {/* 메인 제목 텍스트 */}
        <Title>피하고 싶은 재료가 있나요?</Title>
        {/* 부제 텍스트(2줄) */}
        <Subtitle>
          알레르기나 싫어하는 재료를 고르면
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
          placeholder="추천에 없다면 검색을 통해 찾아보세요"
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
        {visible.map((item) => {
          const active = selectedIds.includes(item.id);
          return (
            /* 재료 선택 알약 칩(흰/연두) */
            <Chip
              key={item.id}
              type="button"
              $active={active}
              onClick={() => onToggle(item.id)}
            >
              <IngredientIcon icon={item.icon} />
              {/* 재료 이름 텍스트 */}
              <ChipName>{item.name}</ChipName>
            </Chip>
          );
        })}
      </ChipRow>
    </Wrap>
  );
}

/* 하단 선택 칩 목록(X + 아이콘 + 이름, 여러 줄) */
export function SelectedChips({ selectedIds, onRemove }) {
  const items = selectedIds
    .map((id) => ALL.find((item) => item.id === id))
    .filter(Boolean);
  if (!items.length) return null;

  return (
    /* 선택 칩 줄바꿈 행 */
    <SelectedRow>
      {items.map((item) => (
        /* 선택됨 알약 칩(X + 아이콘 + 이름) */
        <SelectedChip key={item.id} type="button" onClick={() => onRemove(item.id)}>
          {/* 제거 X 원형 아이콘(16×16) */}
          <RemoveImg src={removeIcon} alt="" />
          <IngredientIcon icon={item.icon} />
          <ChipName>{item.name}</ChipName>
        </SelectedChip>
      ))}
    </SelectedRow>
  );
}

/* ——— 레이아웃 ——— */

/* 2단계 본문 세로 스크롤 영역(패딩 포함 직사각) */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 40px 20px 180px;
  overflow-y: auto;
`;

/* 제목·부제 세로 스택 */
const Header = styled.div`
  display: flex;
  flex-direction: column;
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

/* 재료 칩 래핑 줄(줄바꿈 flex) */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 4px;
  margin-top: 28px;
`;

/* 재료 선택 알약 칩(완전 둥근 타원, 흰/연두) */
const Chip = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 1000px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#fff')};
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  cursor: pointer;
`;

/* 재료 이름 텍스트 */
const ChipName = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
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

/* 선택됨 알약 칩(X + 아이콘 + 이름, radius 30) */
const SelectedChip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  white-space: nowrap;
  cursor: pointer;
`;

/* 제거 X 원형 아이콘(16×16) */
const RemoveImg = styled.img`
  width: 16px;
  height: 16px;
`;

export default SecondStep;
