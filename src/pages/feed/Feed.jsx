import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import filterIcon from '../../assets/feed/filter.svg';
import searchIcon from '../../assets/feed/search.svg';
import heartEmpty from '../../assets/icons/HeartEmpty.svg';
import heartFilled from '../../assets/icons/HeartFilled.svg';
import starIcon from '../../assets/mypage/star.svg';
import { DUMMY_RECIPES } from '../../constants/dummyRecipes';
import FilterPanel from './FilterPanel';

/* 피그마 순서: 섹션 → 배너 → 섹션 → 섹션 → 섹션 → 배너 */
const FEED_BLOCKS = [
  { type: 'section', id: 's1', title: '자취생 간단 레시피' },
  { type: 'banner', id: 'b1' },
  { type: 'section', id: 's2', title: '다이어트에 좋은' },
  { type: 'section', id: 's3', title: '글루텐 프리 식단' },
  { type: 'section', id: 's4', title: '글루텐 프리 식단' },
  { type: 'banner', id: 'b2' },
];

const SORT_OPTIONS = ['기본순', '재료 일치도순'];

const INITIAL_FILTER = {
  cookTime: null,
  difficulty: null,
  category: '전체',
};

function RecipeCard({ recipe, onToggleSave, onOpen }) {
  return (
    // 레시피 카드 (마이페이지와 동일 스타일, 완료 뱃지 제외)
    <Card onClick={() => onOpen(recipe.id)}>
      <HeartBtn
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(recipe.id);
        }}
        aria-label="저장"
      >
        <HeartImg src={recipe.isSaved ? heartFilled : heartEmpty} alt="" />
      </HeartBtn>
      <FoodImg src={recipe.image} alt={recipe.title} />
      <CardBody>
        <CardTitle>{recipe.title}</CardTitle>
        <MetaRow>
          <TimeText>{recipe.time}</TimeText>
          <ExtraText>{recipe.extraIngredients}</ExtraText>
        </MetaRow>
        <CostText>{recipe.cost}</CostText>
        <DiffRow>
          <DiffLabel>난이도</DiffLabel>
          {Array.from({ length: recipe.difficulty }, (_, i) => (
            <StarImg key={i} src={starIcon} alt="" />
          ))}
        </DiffRow>
      </CardBody>
    </Card>
  );
}

function Feed() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(DUMMY_RECIPES);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const filterRef = useRef(null);

  const toggleSave = (id) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r)));
  };

  const openRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  const updateFilter = (patch) => {
    setFilter((prev) => ({ ...prev, ...patch }));
  };

  // 정렬 — 원클릭으로 다음 옵션으로 전환
  const toggleSort = () => {
    setSortBy((prev) => (prev === SORT_OPTIONS[0] ? SORT_OPTIONS[1] : SORT_OPTIONS[0]));
  };

  useEffect(() => {
    if (!isFilterOpen) return undefined;

    const handlePointerDown = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isFilterOpen]);

  const filtered = recipes.filter((r) => {
    if (query.trim() && !r.title.includes(query.trim())) return false;
    if (filter.cookTime && !r.time.includes(filter.cookTime.label)) return false;
    if (filter.difficulty !== null && r.difficulty !== filter.difficulty) return false;
    if (filter.category !== '전체' && r.category !== filter.category) return false;
    return true;
  });

  return (
    <Page>
      {/* 검색창 — 피그마 x20 y115 w350 h49 */}
      <SearchBox>
        <SearchInput
          type="search"
          placeholder="레시피·식단 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchIcon src={searchIcon} alt="" />
      </SearchBox>

      {/* 정렬 토글·필터 */}
      <ToolRow>
        <SortBtn type="button" onClick={toggleSort} aria-label="정렬 전환">
          {sortBy}
        </SortBtn>
        <FilterWrap ref={filterRef}>
          <FilterBtn
            type="button"
            aria-label="필터"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <FilterImg src={filterIcon} alt="" />
          </FilterBtn>
          {isFilterOpen && (
            <FilterPanel
              cookTime={filter.cookTime}
              difficulty={filter.difficulty}
              category={filter.category}
              onChange={updateFilter}
            />
          )}
        </FilterWrap>
      </ToolRow>

      {FEED_BLOCKS.map((block, index) => {
        if (block.type === 'banner') {
          return <AdBanner key={block.id}>광고 배너</AdBanner>;
        }

        const prev = FEED_BLOCKS[index - 1];
        // 첫 섹션: 31px / 배너 뒤: 0(배너 margin-bottom 사용) / 섹션 뒤: 48px
        const top = !prev ? 31 : prev.type === 'banner' ? 0 : 48;

        return (
          <Section key={block.id} $top={top}>
            <SectionTitle>{block.title}</SectionTitle>
            <CardRow>
              {filtered.map((recipe) => (
                <RecipeCard
                  key={`${block.id}-${recipe.id}`}
                  recipe={recipe}
                  onToggleSave={toggleSave}
                  onOpen={openRecipe}
                />
              ))}
            </CardRow>
          </Section>
        );
      })}
    </Page>
  );
}

/* 피드 스크롤 영역 */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 28px;
  background: #fff;
`;

/* 검색창 */
const SearchBox = styled.div`
  position: relative;
  margin: 0 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 49px;
  padding: 0 48px 0 20px;
  border: none;
  border-radius: 50px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(107, 56, 0, 0.06),
    0 0 40px 0 rgba(97, 51, 0, 0.05);
  font-size: 15px;
  outline: none;

  &::placeholder {
    color: #a2a2a2;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  top: 13px;
  right: 17px;
  width: 24px;
  height: 24px;
  pointer-events: none;
`;

/* 정렬·필터 — 검색 아래 20px, 오른쪽 정렬 */
const ToolRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding: 0 29px 0 20px;
`;

const SortBtn = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  color: #8b8b8b;
  cursor: pointer;
`;

const FilterWrap = styled.div`
  position: relative;
`;

const FilterBtn = styled.button`
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const FilterImg = styled.img`
  width: 12px;
  height: 13px;
`;

/* 섹션 — 제목↔카드 16px */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: ${({ $top }) => $top}px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: #000;
`;

/* 가로 스크롤 — 좌측 19px, 카드 간격 10px */
const CardRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 19px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 개별 레시피 카드 — 피그마 167×229, 텍스트 폭에 맞춰 확장 */
const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  width: max-content;
  min-width: 167px;
  align-self: start;
  min-height: 229px;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  box-shadow:
    0 0 10px 0 rgba(154, 80, 0, 0.05),
    0 0 40px 0 rgba(154, 80, 0, 0.08),
    inset 0 0 3px 0.5px #fff;
`;

const HeartBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 12px;
  z-index: 1;
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const HeartImg = styled.img`
  width: 18px;
  height: 15px;
  object-fit: contain;
`;

/* 원형 음식 이미지 — 피그마 y19 97×98 */
const FoodImg = styled.img`
  display: block;
  width: 97px;
  height: 98px;
  margin: 19px auto 0;
  object-fit: cover;
  border-radius: 50%;
  box-shadow:
    0 0 10px 0 rgba(61, 32, 0, 0.05),
    0 0 40px 0 rgba(110, 58, 0, 0.13);
`;

/* 텍스트 영역 — 피그마 title y137 / meta y161 / cost y181 / diff y199 */
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 14px 16px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: #3c3a39;
  word-break: keep-all;
`;

/* 소요시간·추가재료 — 피그마 x14 / x73 → 간격 12, 우측 14 여백 확보 */
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  flex-wrap: nowrap;
`;

const TimeText = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #72c372;
  white-space: nowrap;
`;

const ExtraText = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #888;
  white-space: nowrap;
`;

const CostText = styled.span`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #696866;
  white-space: nowrap;
`;

const DiffRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
  flex-wrap: nowrap;
`;

const DiffLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #696866;
`;

const StarImg = styled.img`
  width: 15px;
  height: 15px;
  flex-shrink: 0;
`;

/* 광고 배너 — 피그마: 상하 여백 28px, 높이 118px, 가로 full */
const AdBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: 118px;
  min-height: 118px;
  margin: 28px 0;
  background: #efefef;
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

export default Feed;
