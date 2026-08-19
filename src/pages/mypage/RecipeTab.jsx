import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styled from 'styled-components';

import { deleteFavoriteRecipe, getFavoriteRecipes, postFavoriteRecipe } from '@/api/favoriteRecipe';
import { getCookingRecords } from '@/api/cookingRecord';
import { deleteUserMealPlan, getUserMealPlans } from '@/api/mealPlanApi';
import { useUserStore } from '@/hooks/useUserStore';

import arrowIcon from '../../assets/mypage/arrow.svg';
import cartIcon from '../../assets/mypage/cart.svg';
import trashIcon from '../../assets/mypage/trash.svg';
import MenuCard from '../../common/menuCard/MenuCard';
import { DUMMY_MEAL_RECORDS } from '../../constants/dummyMeals';

const FILTERS = [
  { id: 'saved', label: '저장한 레시피' },
  { id: 'completed', label: '완료한 레시피' },
  { id: 'record', label: '식단 기록' },
];

const FILTER_IDS = FILTERS.map((f) => f.id);

const DIFFICULTY_FEEDBACK = {
  1: '아주 간단해요',
  2: '간단한 편이에요',
  3: '과정이 조금 있어요',
  4: '과정이 많은 편이에요',
  5: '과정이 꽤 복잡해요',
};

const formatMealPlanDate = (value) => {
  const [year, month, day] = String(value ?? '').slice(0, 10).split('-');
  if (!year || !month || !day) return '';
  return `${year}년 ${Number(month)}월 ${Number(day)}일 완료`;
};

const mapMealPlans = (content) =>
  (content ?? []).map((item, index) => ({
    id: item.mealPlanId ?? item.id,
    title: item.mealPlanName ?? item.name ?? item.title ?? '',
    date: formatMealPlanDate(item.completedAt ?? item.updatedAt ?? item.createdAt),
    icon: DUMMY_MEAL_RECORDS[index % DUMMY_MEAL_RECORDS.length].icon,
  }));

const formatCompletedDate = (value) => {
  const [, month, day] = String(value ?? '').slice(0, 10).split('-');
  if (!month || !day) return '';
  return `${Number(month)}월 ${Number(day)}일 완료`;
};

const mapCookingRecords = (content) =>
  (content ?? []).map((item) => {
    const level = Number(String(item.userDifficultyLevel ?? '').replace('LEVEL_', ''));

    return {
      id: item.recipeId,
      cookingRecordId: item.cookingRecordId,
      title: item.menuName,
      image: item.thumbnailUrl,
      isSaved: Boolean(item.isFavoriteRecipe),
      completedDate: formatCompletedDate(item.completedAt),
      feedback: DIFFICULTY_FEEDBACK[level] ?? '',
      ingredientCount:
        item.usedFoodIngredientCount != null
          ? `사용한 재료 개수 ${item.usedFoodIngredientCount}개`
          : '',
    };
  });

const mapFavoriteRecipes = (content) =>
  (content ?? []).map((item) => {
    const level = Number(String(item.difficultyLevel ?? '').replace('LEVEL_', ''));

    return {
      id: item.recipeId,
      title: item.menuName,
      image: item.thumbnailUrl,
      time: item.timeRequired != null ? `${item.timeRequired}분 소요` : '',
      utilization:
        item.foodIngredientUsingPercent != null
          ? `재료 활용률 ${item.foodIngredientUsingPercent}%`
          : '',
      difficulty: Number.isFinite(level) && level > 0 ? level : 1,
      isSaved: true,
    };
  });

/** 마이페이지 레시피·식단 — 1699:6962 / 1699:7047 / 1933:5095 */
function RecipeTab() {
  const navigate = useNavigate();
  const userLoginNumber = useUserStore((state) => state.userLoginNumber);
  const userId = useUserStore((state) => state.userId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [completedRecipes, setCompletedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [mealRecords, setMealRecords] = useState(DUMMY_MEAL_RECORDS);

  /* 찜한 레시피 조회 API */
  useEffect(() => {
    if (!userLoginNumber) return;

    const fetchFavoriteRecipes = async () => {
      try {
        const response = await getFavoriteRecipes({
          userNumber: userLoginNumber,
          cursor: 1,
          size: 10,
        });
        const content = response.data?.content ?? response.content ?? [];
        setSavedRecipes(mapFavoriteRecipes(content));
      } catch (error) {
        console.error('찜한 레시피 조회 실패:', error);
      }
    };

    fetchFavoriteRecipes();
  }, [userLoginNumber]);

  useEffect(() => {
    if (!userLoginNumber) return;

    const fetchCookingRecords = async () => {
      try {
        const response = await getCookingRecords({
          userNumber: userLoginNumber,
          cursor: 1,
          size: 10,
        });
        const content = response.data?.content ?? response.content ?? [];
        setCompletedRecipes(mapCookingRecords(content));
      } catch (error) {
        console.error('요리 기록 목록 조회 실패:', error);
      }
    };

    fetchCookingRecords();
  }, [userLoginNumber]);

  useEffect(() => {
    if (!userId) return;

    const fetchMealPlans = async () => {
      try {
        const response = await getUserMealPlans(userId);
        const payload = response.data ?? response;
        const list = payload.content ?? payload.mealPlanList ?? (Array.isArray(payload) ? payload : []);
        if (!list.length) return;
        setMealRecords(mapMealPlans(list));
      } catch (error) {
        console.error('사용자 식단 조회 실패:', error);
      }
    };

    fetchMealPlans();
  }, [userId]);

  /* ?list= 로 필터 유지 → 레시피 상세 뒤돌아가기 시 복원 */
  const raw = searchParams.get('list');
  const filter = FILTER_IDS.includes(raw) ? raw : 'saved';

  const setFilter = (id) => {
    setSearchParams(id === 'saved' ? {} : { list: id }, { replace: true });
  };

  const visibleRecipes = useMemo(() => {
    if (filter === 'saved') return savedRecipes;
    if (filter === 'completed') return completedRecipes;
    return [];
  }, [filter, completedRecipes, savedRecipes]);

  const patchSaved = (recipeId, isSaved) => {
    setCompletedRecipes((prev) =>
      prev.map((item) => (item.id === recipeId ? { ...item, isSaved } : item))
    );
    if (!isSaved) {
      setSavedRecipes((prev) => prev.filter((item) => item.id !== recipeId));
    }
  };

  const toggleSave = async (id) => {
    if (!userLoginNumber) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    const recipe =
      completedRecipes.find((item) => item.id === id) ??
      savedRecipes.find((item) => item.id === id);

    if (recipe?.isSaved || savedRecipes.some((item) => item.id === id)) {
      try {
        await deleteFavoriteRecipe(id, userLoginNumber);
        patchSaved(id, false);
      } catch (error) {
        console.error('레시피 찜 해제 실패:', error);
      }
      return;
    }

    try {
      await postFavoriteRecipe(id, userLoginNumber);
      patchSaved(id, true);
    } catch (error) {
      if (error.response?.status === 409) {
        patchSaved(id, true);
        return;
      }
      console.error('레시피 찜 등록 실패:', error);
    }
  };

  const handleDeleteMealPlan = async (event, mealPlanId) => {
    event.stopPropagation();
    if (!userId) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      await deleteUserMealPlan(mealPlanId, userId);
      setMealRecords((prev) => prev.filter((item) => item.id !== mealPlanId));
    } catch (error) {
      console.error('사용자 식단 삭제 실패:', error);
    }
  };

  return (
    // 탭 루트 — 세로 full 직사각형
    <Wrap>
      {/* 필터 행: 저장한 레시피 | 완료한 레시피 | 식단 기록 텍스트 */}
      <FilterRow>
        {FILTERS.map((item) => (
          <FilterBtn
            key={item.id}
            type="button"
            $active={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </FilterBtn>
        ))}
      </FilterRow>

      {/* 스크롤 그리드 — 레시피 2열 / 식단기록 2열(간격 12) */}
      {filter === 'record' ? (
        <RecordGrid>
          {mealRecords.map((meal) => (
            /* 식단 기록 카드: 168×128 둥근 직사각형 */
            <MealCard key={meal.id}>
              <DeleteMealBtn
                type="button"
                aria-label="식단 기록 삭제"
                onClick={(event) => handleDeleteMealPlan(event, meal.id)}
              >
                <DeleteMealIcon src={trashIcon} alt="" />
              </DeleteMealBtn>
              {/* 아이콘: 32×32 정사각 SVG */}
              <MealIconWrap>
                <MealIcon src={meal.icon} alt="" />
              </MealIconWrap>
              <MealTitle>{meal.title}</MealTitle>
              <MealDate>{meal.date}</MealDate>
            </MealCard>
          ))}
        </RecordGrid>
      ) : (
        <RecipeGrid>
          {visibleRecipes.map((recipe) => (
            <MenuCard
              key={recipe.cookingRecordId ?? recipe.id}
              image={recipe.image}
              title={recipe.title}
              time={recipe.time}
              utilization={recipe.utilization}
              difficulty={recipe.difficulty}
              isSaved={recipe.isSaved}
              variant={filter === 'completed' ? 'completed' : 'default'}
              completedDate={recipe.completedDate}
              feedback={recipe.feedback}
              ingredientCount={recipe.ingredientCount}
              onClick={() =>
                navigate(
                  filter === 'completed' && recipe.cookingRecordId
                    ? `/cooking-records/${recipe.cookingRecordId}`
                    : `/recipes/${recipe.id}`
                )
              }
              onToggleSave={() => toggleSave(recipe.id)}
            />
          ))}
        </RecipeGrid>
      )}

      {/* 하단 고정 바: 상단 둥근 흰 직사각형 */}
      <BottomBar>
        {/* CTA: 초록 둥근 직사각형 348×48 */}
        <ShopBtn type="button" onClick={() => navigate('/market')}>
          <CartIcon src={cartIcon} alt="" />
          필요한 재료 사러 갈까요?
          <ArrowIcon src={arrowIcon} alt="" />
        </ShopBtn>
      </BottomBar>
    </Wrap>
  );
}

export default RecipeTab;

/* —— 탭 루트: 세로 full 직사각형 —— */
const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/* —— 필터 행: 가로 텍스트 —— */
const FilterRow = styled.div`
  display: flex;
  gap: 18px;
  padding: 16px 21px 8px;
`;

/* —— 필터 텍스트 버튼 —— */
const FilterBtn = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  white-space: nowrap;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#72d472' : '#adadad')};
  cursor: pointer;
`;

/* —— 레시피 카드 그리드: 2열, row 32 —— */
const RecipeGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, 168px);
  column-gap: 12px;
  row-gap: 32px;
  justify-content: center;
  padding: 16px 21px 140px;
  overflow-x: hidden;
  overflow-y: auto;
`;

/* —— 식단 기록 그리드: 2열, col 12 / row 4 —— */
const RecordGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, 168px);
  column-gap: 12px;
  row-gap: 4px;
  justify-content: center;
  padding: 16px 21px 140px;
  overflow-x: hidden;
  overflow-y: auto;
`;

/* —— 식단 기록 카드: 168×128 둥근 직사각형 —— */
const MealCard = styled.article`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 168px;
  height: 128px;
  padding: 18px 16px 16px;
  border-radius: 15px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.03),
    0 0 40px 0 rgba(3, 3, 3, 0.05);
`;

const DeleteMealBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
`;

const DeleteMealIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

/* —— 아이콘 외곽: 32×32 정사각 —— */
const MealIconWrap = styled.span`
  display: block;
  width: 32px;
  height: 32px;
  overflow: hidden;
`;

/* —— 아이콘 leaf: 외곽을 채우는 SVG —— */
const MealIcon = styled.img`
  display: block;
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

/* —— 식단 제목 (피그마 y 58 — 아이콘 아래 8px) —— */
const MealTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.32px;
  color: #444;
  word-break: keep-all;
`;

/* —— 식단 완료일 (피그마 y 85 — 제목 아래 8px) —— */
const MealDate = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.13px;
  color: #727272;
`;

/* —— 하단 바: 상단 둥근 흰 직사각형 —— */
const BottomBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 56px;
  z-index: 15;
  box-sizing: border-box;
  width: 100%;
  max-width: 390px;
  padding: 34px 21px 20px;
  transform: translateX(-50%);
  border-radius: 22px 22px 0 0;
  background: #fff;
  box-shadow: 0 -1px 14.6px 0 rgba(201, 201, 189, 0.25);
`;

/* —— CTA: 초록 둥근 직사각형 —— */
const ShopBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #72d472;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  cursor: pointer;
`;

/* —— 장바구니 아이콘: 22×22 정사각 —— */
const CartIcon = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;

/* —— 화살표 아이콘: 16×16 정사각(90° 회전) —— */
const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
  transform: rotate(90deg);
`;
