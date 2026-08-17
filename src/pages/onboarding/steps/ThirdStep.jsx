import { useMemo, useState } from 'react';
import styled from 'styled-components';

import clearIcon from '../../../assets/onboarding/tools/clear.svg';
import fireIcon from '../../../assets/onboarding/tools/fire.svg';
import knifeIcon from '../../../assets/onboarding/tools/knife.svg';
import panIcon from '../../../assets/onboarding/tools/pan.svg';
import removeIcon from '../../../assets/onboarding/tools/remove.svg';
import searchIcon from '../../../assets/onboarding/tools/search.svg';

/* 카테고리별 조리 도구 목록 */
const CATEGORIES = [
  {
    id: 'appliances',
    title: '조리기기',
    icon: fireIcon,
    items: [
      { id: 'gas', name: '가스레인지' },
      { id: 'microwave', name: '전자레인지' },
      { id: 'oven', name: '오븐' },
      { id: 'ricecooker', name: '밥솥' },
      { id: 'airfryer', name: '에어프라이어' },
    ],
  },
  {
    id: 'basic',
    title: '기본 조리도구',
    icon: panIcon,
    items: [
      { id: 'pan', name: '프라이팬' },
      { id: 'pot', name: '냄비' },
      { id: 'blender', name: '믹서기' },
    ],
  },
  {
    id: 'prep',
    title: '준비·손질 도구',
    icon: knifeIcon,
    items: [
      { id: 'board', name: '도마' },
      { id: 'knife', name: '칼/가위' },
      { id: 'sieve', name: '채망' },
    ],
  },
];

const ALL_TOOLS = CATEGORIES.flatMap((c) => c.items);

function ThirdStep({ selectedIds, onToggle }) {
  const [query, setQuery] = useState('');
  const q = query.trim();

  /* 검색어가 있으면 카테고리 안 도구만 필터 */
  const sections = useMemo(() => {
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.name.includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [q]);

  return (
    <Wrap>
      {/* 제목·부제 텍스트 블록 */}
      <Header>
        <Title>조리 환경을 알려주세요</Title>
        <Subtitle>
          사용할 수 있는 조리 도구에 맞춰
          <br />
          레시피를 추천해드릴게요.
        </Subtitle>
      </Header>

      {/* 검색 입력 박스(라운드 사각형) */}
      <SearchBox>
        <SearchIcon src={searchIcon} alt="" />
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="추천에 없다면 검색을 통해 찾아보세요"
          aria-label="조리 도구 검색"
        />
        {q && (
          <ClearBtn type="button" onClick={() => setQuery('')} aria-label="검색어 지우기">
            <ClearImg src={clearIcon} alt="" />
          </ClearBtn>
        )}
      </SearchBox>

      {/* 카테고리 섹션 목록(세로 스택) */}
      <Sections>
        {sections.map((cat) => (
          <Section key={cat.id}>
            {/* 카테고리 라벨 행(아이콘 + 텍스트) */}
            <SectionLabel>
              <SectionIcon src={cat.icon} alt="" />
              <SectionTitle>{cat.title}</SectionTitle>
            </SectionLabel>

            {/* 도구 선택 알약 칩 줄(줄바꿈) */}
            <ChipRow>
              {cat.items.map((item) => {
                const active = selectedIds.includes(item.id);
                return (
                  <Chip
                    key={item.id}
                    type="button"
                    $active={active}
                    onClick={() => onToggle(item.id)}
                  >
                    {item.name}
                  </Chip>
                );
              })}
            </ChipRow>
          </Section>
        ))}
      </Sections>
    </Wrap>
  );
}

/* 하단 선택 칩 목록(X + 이름, 여러 줄) */
export function SelectedToolChips({ selectedIds, onRemove }) {
  const items = selectedIds
    .map((id) => ALL_TOOLS.find((item) => item.id === id))
    .filter(Boolean);
  if (!items.length) return null;

  return (
    <SelectedRow>
      {items.map((item) => (
        <SelectedChip key={item.id} type="button" onClick={() => onRemove(item.id)}>
          <RemoveImg src={removeIcon} alt="" />
          {item.name}
        </SelectedChip>
      ))}
    </SelectedRow>
  );
}

/* ——— 레이아웃 ——— */

/* 3단계 본문 스크롤 영역 */
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
  color: #bebebf;
`;

/* 검색창 라운드 사각형(흰 배경 + 그림자) */
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

/* 검색 입력 필드 */
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

/* 검색어 지우기 버튼(투명) */
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

/* 카테고리 섹션들 세로 간격 스택 */
const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 28px;
  padding: 0 12px;
`;

/* 한 카테고리 블록(라벨 + 칩) */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* 카테고리 라벨 가로 행 */
const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
`;

/* 카테고리 아이콘(불/팬/칼, 20×20) */
const SectionIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

/* 카테고리 제목 텍스트 */
const SectionTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: #8b8b8b;
`;

/* 도구 칩 래핑 줄 */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 4px;
`;

/* 도구 선택 알약 칩(흰/연두) */
const Chip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 30px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#fff')};
  box-shadow:
    0 0 4px rgba(3, 3, 3, 0.05),
    0 0 15px rgba(3, 3, 3, 0.05);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
  white-space: nowrap;
  cursor: pointer;
`;

/* 하단 선택 칩 줄바꿈 행 */
const SelectedRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;
`;

/* 선택됨 칩(X + 이름 알약) */
const SelectedChip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 15px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px rgba(3, 3, 3, 0.05),
    0 0 30px rgba(3, 3, 3, 0.05);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #1a1a1a;
  white-space: nowrap;
  cursor: pointer;
`;

/* 제거 X 원형 아이콘(16×16) */
const RemoveImg = styled.img`
  width: 16px;
  height: 16px;
`;

export default ThirdStep;
