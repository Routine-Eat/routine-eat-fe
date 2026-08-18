import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import styled from 'styled-components';

import chevronIcon from '../../assets/feed/chevron.svg';
import filterIcon from '../../assets/feed/filter.svg';
import foodImg from '../../assets/feed/food.png';
import searchIcon from '../../assets/feed/search.svg';
import MenuCard from '../../common/menuCard/MenuCard';
import FilterPanel, { DEFAULT_FILTER } from './FilterPanel';

/* 피그마 섹션 순서: 레시피 → 광고 → 레시피… */
const BLOCKS = [
  { type: 'section', id: 's1', title: '퇴근 후 15분 간단 레시피' },
  { type: 'banner', id: 'b1' },
  { type: 'section', id: 's2', title: '남은 양파 먼저 쓰기' },
  { type: 'section', id: 's3', title: '남은 양파 먼저 쓰기' },
  { type: 'section', id: 's4', title: '남은 양파 먼저 쓰기' },
];

const SORTS = ['기본순', '재료 일치도순'];
const RECENT_KEY = 'feed-recent-searches';

/* 요리 시간 칩 → 분 단위 매칭 */
function matchCookTime(timeLabel, cookTime) {
  if (!cookTime || cookTime === '상관없음') return true;
  const mins = parseInt(timeLabel, 10);
  if (Number.isNaN(mins)) return true;
  if (cookTime === '15분 이하') return mins <= 15;
  if (cookTime === '15분~30분') return mins > 15 && mins < 30;
  if (cookTime === '30분 이상') return mins >= 30;
  return true;
}

/* 사용자가 검색한 단어만 — 더미 기본값 없음 */
function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // 이전 시드(브로콜리·목이버섯)만 있던 경우 초기화
    if (parsed.length === 2 && parsed[0] === '브로콜리' && parsed[1] === '목이버섯') {
      localStorage.removeItem(RECENT_KEY);
      return [];
    }
    return parsed.filter((t) => typeof t === 'string' && t.trim());
  } catch {
    return [];
  }
}

/* 피드 더미 — API 연동 전 */
const RECIPES = [
  {
    id: 'r1',
    title: '계란 야채 볶음밥',
    time: '10분 소요',
    utilization: '재료 활용률 100%',
    difficulty: 1,
    category: '한식',
    image: foodImg,
    isSaved: false,
  },
  {
    id: 'r2',
    title: '고깃집 스타일 된장가득 술밥 찌개',
    time: '17분 소요',
    utilization: '재료 활용률 72%',
    difficulty: 3,
    category: '한식',
    image: foodImg,
    isSaved: false,
  },
  {
    id: 'r3',
    title: '계란 야채 볶음밥',
    time: '10분 소요',
    utilization: null,
    difficulty: 1,
    category: '일식',
    image: foodImg,
    isSaved: true,
  },
  {
    id: 'r4',
    title: '양파 볶음밥',
    time: '13분 소요',
    utilization: '재료 활용률 100%',
    difficulty: 1,
    category: '한식',
    image: foodImg,
    isSaved: false,
  },
  {
    id: 'r5',
    title: '양파 가득 짜장면',
    time: '30분 소요',
    utilization: '재료 활용률 92%',
    difficulty: 3,
    category: '중식',
    image: foodImg,
    isSaved: false,
  },
  {
    id: 'r6',
    title: '계란 야채 볶음밥',
    time: '10분 소요',
    utilization: '재료 활용률 72%',
    difficulty: 1,
    category: '한식',
    image: foodImg,
    isSaved: false,
  },
];

function Feed() {
  const navigate = useNavigate();
  const { feedSearchMode, setFeedSearchMode } = useOutletContext() ?? {};
  const inputRef = useRef(null);
  const [recipes, setRecipes] = useState(RECIPES);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [recent, setRecent] = useState(loadRecent);
  const [sortBy, setSortBy] = useState(SORTS[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const isFilterActive = JSON.stringify(filter) !== JSON.stringify(DEFAULT_FILTER);

  const trimmed = query.trim();
  const showRecent = searchMode && !trimmed;
  const showResults = searchMode && !!trimmed;

  const list = recipes.filter((r) => {
    if (trimmed && !r.title.includes(trimmed)) return false;
    if (!matchCookTime(r.time, filter.cookTime)) return false;
    if (!filter.difficultyAny && r.difficulty !== filter.difficulty) return false;
    if (filter.category !== '전체' && r.category !== filter.category) return false;
    return true;
  });

  const pushRecent = (term) => {
    const next = [term, ...recent.filter((t) => t !== term)].slice(0, 10);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const setMode = (next) => {
    setSearchMode(next);
    setFeedSearchMode?.(next);
  };

  // 공통 헤더 클릭으로 Layout이 검색을 끈 경우 Feed 상태 동기화
  useEffect(() => {
    if (feedSearchMode === false && searchMode) {
      setSearchMode(false);
      setQuery('');
      inputRef.current?.blur();
    }
  }, [feedSearchMode, searchMode]);

  const enterSearch = () => setMode(true);

  const applyQuery = (term) => {
    const next = term.trim();
    if (!next) return;
    setQuery(next);
    setMode(true);
    pushRecent(next);
  };

  const toggleSave = (id) => {
    setRecipes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSaved: !item.isSaved } : item))
    );
  };

  return (
    // 피드 스크롤 페이지 — 세로 전체 영역
    <Page>
      {/* 검색+필터 가로 줄 */}
      <SearchRow>
        {/* 검색창 — 둥근 사각(12) 입력 박스 */}
        <SearchBox>
          {/* 돋보기 아이콘 — 왼쪽 고정 */}
          <SearchIcon src={searchIcon} alt="" />
          <SearchInput
            ref={inputRef}
            type="search"
            placeholder="재료, 레시피명으로 검색해보세요"
            value={query}
            onFocus={enterSearch}
            onChange={(e) => {
              setQuery(e.target.value);
              setMode(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyQuery(query);
            }}
          />
        </SearchBox>

        {/* 필터 버튼 — 둥근 사각(10) 48×48 / 적용 시 우상단 점 */}
        <FilterBtn
          type="button"
          aria-label="필터"
          aria-expanded={filterOpen}
          aria-pressed={isFilterActive}
          onClick={() => setFilterOpen(true)}
        >
          <FilterImg src={filterIcon} alt="" />
          {isFilterActive && <FilterDot aria-hidden />}
        </FilterBtn>
      </SearchRow>

      {/* 필터 모달 */}
      <FilterPanel
        open={filterOpen}
        value={filter}
        onApply={setFilter}
        onClose={() => setFilterOpen(false)}
      />

      {/* 검색 포커스·빈 입력 — 최근 검색어 (피그마 1355:11856) */}
      {showRecent && (
        <RecentBlock>
          <RecentTitle>최근 검색어</RecentTitle>
          <RecentChips>
            {recent.map((term) => (
              <RecentChip key={term} type="button" onClick={() => applyQuery(term)}>
                {term}
              </RecentChip>
            ))}
          </RecentChips>
        </RecentBlock>
      )}

      {/* 검색어 입력 후 — 정렬 + 2열 결과 (피그마 1353:3642) */}
      {showResults && (
        <>
          <SortRow>
            <SortBtn
              type="button"
              aria-label="정렬 전환"
              onClick={() => setSortBy((prev) => (prev === SORTS[0] ? SORTS[1] : SORTS[0]))}
            >
              <SortLabel>{sortBy}</SortLabel>
              <ChevronWrap>
                <Chevron src={chevronIcon} alt="" />
              </ChevronWrap>
            </SortBtn>
          </SortRow>

          <ResultGrid>
            {list.map((r) => (
              <MenuCard
                key={r.id}
                image={r.image}
                title={r.title}
                time={r.time}
                utilization={r.utilization}
                difficulty={r.difficulty}
                isSaved={r.isSaved}
                onClick={() => navigate(`/recipes/${r.id}`)}
                onToggleSave={() => toggleSave(r.id)}
              />
            ))}
          </ResultGrid>
        </>
      )}

      {/* 기본 피드 — 섹션 가로 스크롤 */}
      {!searchMode && (
        <>
          <SortRow>
            <SortBtn
              type="button"
              aria-label="정렬 전환"
              onClick={() => setSortBy((prev) => (prev === SORTS[0] ? SORTS[1] : SORTS[0]))}
            >
              <SortLabel>{sortBy}</SortLabel>
              <ChevronWrap>
                <Chevron src={chevronIcon} alt="" />
              </ChevronWrap>
            </SortBtn>
          </SortRow>

          {BLOCKS.map((block, i) => {
            if (block.type === 'banner') {
              return <Banner key={block.id}>광고 배너</Banner>;
            }

            const prev = BLOCKS[i - 1];
            const top = !prev ? 26 : prev.type === 'banner' ? 0 : 48;

            return (
              <Section key={block.id} $top={top}>
                <SectionTitle>{block.title}</SectionTitle>
                <CardRow>
                  {list.map((r) => (
                    <MenuCard
                      key={`${block.id}-${r.id}`}
                      image={r.image}
                      title={r.title}
                      time={r.time}
                      utilization={r.utilization}
                      difficulty={r.difficulty}
                      isSaved={r.isSaved}
                      onClick={() => navigate(`/recipes/${r.id}`)}
                      onToggleSave={() => toggleSave(r.id)}
                    />
                  ))}
                </CardRow>
              </Section>
            );
          })}
        </>
      )}
    </Page>
  );
}

export default Feed;

/* —— 페이지: 세로 스크롤 컬럼 —— */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-top: 16px;
  padding-bottom: 28px;
  background: #fffefd;
`;

/* —— 검색 행: 검색창 + 필터 버튼 가로 —— */
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
`;

/* —— 검색 박스: 둥근 사각(radius 12) —— */
const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 48px;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
`;

/* —— 돋보기 아이콘: 22×22 —— */
const SearchIcon = styled.img`
  position: absolute;
  top: 13px;
  left: 16px;
  width: 22px;
  height: 22px;
  pointer-events: none;
`;

/* —— 검색 입력 —— */
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 16px 0 50px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #2e2e2e;
  outline: none;

  &::placeholder {
    color: #bebebf;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
`;

/* —— 필터 버튼: 둥근 사각 48×48 —— */
const FilterBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  cursor: pointer;
`;

/* —— 필터(슬라이더) 아이콘: 22×22 —— */
const FilterImg = styled.img`
  display: block;
  width: 22px;
  height: 22px;
`;

/* —— 필터 적용 점: 6×6, top 10 / left 34 (피그마 1355:11855) —— */
const FilterDot = styled.span`
  position: absolute;
  top: 10px;
  left: 34px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffe26c;
`;

/* —— 최근 검색어 블록 —— */
const RecentBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 29px;
  padding: 0 20px 0 14px;
`;

/* —— 최근 검색어 제목 —— */
const RecentTitle = styled.h2`
  margin: 0;
  padding-left: 14px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.16px;
  color: #2e2e2e;
`;

/* —— 최근 검색어 칩 가로 줄 —— */
const RecentChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 12px;
`;

/* —— 최근 검색어 칩: pill —— */
const RecentChip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.42px;
  color: #727272;
  cursor: pointer;
`;

/* —— 정렬 행: 오른쪽 정렬 —— */
const SortRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 0 22px 0 20px;
`;

/* —— 정렬 버튼: 텍스트+아이콘 가로 —— */
const SortBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 정렬 라벨 텍스트 —— */
const SortLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #8b8b8b;
  white-space: nowrap;
`;

/* —— 쉐브론 래퍼: 피그마 11×6 슬롯 —— */
const ChevronWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11px;
  height: 6px;
`;

/* —— 쉐브론: 피그마 `>` (6×11) 를 90° 회전 —— */
const Chevron = styled.img`
  display: block;
  width: 6px;
  height: 11px;
  transform: rotate(90deg);
`;

/* —— 검색 결과 2열 그리드 —— */
const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 168px);
  column-gap: 12px;
  row-gap: 32px;
  justify-content: center;
  margin-top: 24px;
  padding: 0 20px;
`;

/* —— 섹션: 제목 + 카드 줄 —— */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: ${({ $top }) => $top}px;
`;

/* —— 섹션 제목 텍스트 —— */
const SectionTitle = styled.h2`
  margin: 0;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #1a1a1a;
`;

/* —— 카드 가로 스크롤 트랙 —— */
const CardRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* —— 광고 배너: 가로 full 회색 사각 —— */
const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: 118px;
  margin: 28px 0;
  background: #e9e9e9;
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;
