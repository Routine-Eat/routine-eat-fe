import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import foodImg from '../../assets/feed/food.png';
import toTopChevronIcon from '../../assets/feed/to-top-chevron.svg';
import { deleteFavoriteRecipe, postFavoriteRecipe } from '../../api/favoriteRecipe';
import { getRecipes } from '../../api/recipe';
import BackButton from '../../common/button/BackButton';
import MenuCard from '../../common/menuCard/MenuCard';
import { useUserStore } from '../../hooks/useUserStore';
import { DEFAULT_FILTER } from './FilterPanel';

const PAGE_SIZE = 10;

const SECTION_CONFIG = {
  simple: {
    title: '퇴근 후 15분 간단 레시피',
    responseKey: 'simpleRecipe',
  },
  remain: {
    title: '남은 재료 먼저 쓰기',
    responseKey: 'remainFoodIngredient',
  },
  diet: {
    title: '다이어트 레시피',
    responseKey: 'dietRecipe',
  },
  gluten: {
    title: '글루텐 프리 레시피',
    responseKey: 'glutenFreeRecipe',
  },
};

const TIME_REQUIRED_MAP = {
  '15분 이하': 'WITHIN_15_MINUTES',
  '15분~30분': 'WITHIN_30_MINUTES',
  '30분 이상': 'OVER_30_MINUTES',
};

const CATEGORY_MAP = {
  한식: 'KOREAN',
  중식: 'CHINESE',
  일식: 'JAPANESE',
  양식: 'WESTERN',
  기타: 'OTHER',
};

const formatTimeRequired = (minutes) => {
  if (minutes == null || minutes === '') return '';
  const value = Number(minutes);
  if (!Number.isFinite(value)) return '';
  if (value >= 60) return `${Math.floor(value / 60)}시간 소요`;
  return `${value}분 소요`;
};

const mapRecipeCard = (item) => {
  const level = Number(String(item.difficultyLevel ?? '').replace('LEVEL_', ''));

  return {
    id: item.recipeId,
    title: item.menuName,
    image: item.thumbnailUrl || foodImg,
    time: formatTimeRequired(item.timeRequired),
    utilization:
      item.foodIngredientUsingPercent != null
        ? `재료 활용률 ${item.foodIngredientUsingPercent}%`
        : '',
    difficulty: Number.isFinite(level) && level > 0 ? level : 1,
    isSaved: Boolean(item.isFavoriteRecipe),
  };
};

function FeedSection() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userLoginNumber = useUserStore((state) => state.userLoginNumber);
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const [recipes, setRecipes] = useState([]);
  const [cursor, setCursor] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const config = SECTION_CONFIG[sectionId] ?? SECTION_CONFIG.simple;
  const title = location.state?.title ?? config.title;
  const filter = location.state?.filter ?? DEFAULT_FILTER;
  const sortBy = location.state?.sortBy ?? '기본순';

  const loadPage = useCallback(
    async (nextCursor, replace = false) => {
      if (!userLoginNumber || loadingRef.current) return;

      loadingRef.current = true;
      try {
        const response = await getRecipes({
          userNumber: userLoginNumber,
          cursor: nextCursor,
          size: PAGE_SIZE,
          timeRequired: TIME_REQUIRED_MAP[filter.cookTime],
          difficultyLevel: filter.difficultyAny
            ? undefined
            : `LEVEL_${filter.difficulty}`,
          category: CATEGORY_MAP[filter.category],
          sortType: sortBy === '재료 일치도순' ? 'FOOD_INTEGRATION' : 'DEFAULT',
        });
        const payload = response.data ?? response;
        const group = payload[config.responseKey] ?? {};
        const nextRecipes = (group.content ?? []).map(mapRecipeCard);

        setRecipes((prev) => {
          if (replace) return nextRecipes;
          const ids = new Set(prev.map((recipe) => recipe.id));
          return [...prev, ...nextRecipes.filter((recipe) => !ids.has(recipe.id))];
        });
        setCursor(group.nextCursor ?? nextCursor + 1);
        setHasNext(group.hasNext ?? nextRecipes.length === PAGE_SIZE);
      } catch (error) {
        console.error('레시피 섹션 추가 조회 실패:', error);
        setHasNext(false);
      } finally {
        loadingRef.current = false;
      }
    },
    [
      config.responseKey,
      filter.category,
      filter.cookTime,
      filter.difficulty,
      filter.difficultyAny,
      sortBy,
      userLoginNumber,
    ]
  );

  useEffect(() => {
    setRecipes([]);
    setCursor(1);
    setHasNext(true);
    loadPage(1, true);
  }, [loadPage, sectionId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollRef.current;
    if (!sentinel || !root || !hasNext) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadPage(cursor);
      },
      { root, rootMargin: '160px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, hasNext, loadPage]);

  const scrollToTop = () => {
    const candidates = [];
    let element = scrollRef.current;

    while (element) {
      candidates.push(element);
      element = element.parentElement;
    }

    const target = candidates.find((candidate) => candidate.scrollTop > 0);

    if (target) {
      target.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSave = async (recipeId) => {
    if (!userLoginNumber) return;
    const recipe = recipes.find((item) => item.id === recipeId);

    try {
      if (recipe?.isSaved) {
        await deleteFavoriteRecipe(recipeId, userLoginNumber);
      } else {
        await postFavoriteRecipe(recipeId, userLoginNumber);
      }
      setRecipes((prev) =>
        prev.map((item) =>
          item.id === recipeId ? { ...item, isSaved: !item.isSaved } : item
        )
      );
    } catch (error) {
      console.error('레시피 찜 상태 변경 실패:', error);
    }
  };

  return (
    <Page>
      <Scroll ref={scrollRef}>
        <PageHeader>
          <BackButton onClick={() => navigate(-1)} />
          <Title>{title}</Title>
        </PageHeader>
        <RecipeGrid>
          {recipes.map((recipe) => (
            <MenuCard
              key={recipe.id}
              image={recipe.image}
              title={recipe.title}
              time={recipe.time}
              utilization={recipe.utilization}
              difficulty={recipe.difficulty}
              isSaved={recipe.isSaved}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              onToggleSave={() => toggleSave(recipe.id)}
            />
          ))}
        </RecipeGrid>
        <Sentinel ref={sentinelRef} aria-hidden />
      </Scroll>

      <ToTopButton
        type="button"
        aria-label="맨 위로"
        onClick={scrollToTop}
      >
        <ToTopIcon src={toTopChevronIcon} alt="" />
      </ToTopButton>
    </Page>
  );
}

export default FeedSection;

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #fffefd;
`;

const PageHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 40px;
  width: 350px;
  height: 48px;
  margin: 0 auto 37px;
  z-index: 25;
`;

const Title = styled.h1`
  margin: 0;
  overflow: hidden;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #1a1a1a;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 30px 20px 144px;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 168px);
  justify-content: center;
  column-gap: 12px;
  row-gap: 32px;
`;

const Sentinel = styled.div`
  width: 100%;
  height: 1px;
`;

const ToTopButton = styled.button`
  position: fixed;
  right: max(20px, calc(50% - 175px));
  bottom: 112px;
  z-index: 19;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 1000px;
  background: #fff;
  box-shadow:
    0 0 5px rgba(3, 3, 3, 0.06),
    0 0 20px rgba(3, 3, 3, 0.08);
  cursor: pointer;
`;

const ToTopIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
`;
