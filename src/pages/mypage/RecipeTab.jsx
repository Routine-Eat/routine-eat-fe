import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styled from 'styled-components';

import arrowIcon from '../../assets/mypage/arrow.svg';
import cartIcon from '../../assets/mypage/cart.svg';
import MenuCard from '../../common/menuCard/MenuCard';
import { DUMMY_MEAL_RECORDS } from '../../constants/dummyMeals';
import { DUMMY_RECIPES } from '../../constants/dummyRecipes';

const FILTERS = [
  { id: 'saved', label: '저장한 레시피' },
  { id: 'completed', label: '완료한 레시피' },
  { id: 'record', label: '식단 기록' },
];

const FILTER_IDS = FILTERS.map((f) => f.id);

/** 마이페이지 레시피·식단 — 1699:6962 / 1699:7047 / 1933:5095 */
function RecipeTab() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState(DUMMY_RECIPES);

  /* ?list= 로 필터 유지 → 레시피 상세 뒤돌아가기 시 복원 */
  const raw = searchParams.get('list');
  const filter = FILTER_IDS.includes(raw) ? raw : 'saved';

  const setFilter = (id) => {
    setSearchParams(id === 'saved' ? {} : { list: id }, { replace: true });
  };

  const visibleRecipes = useMemo(() => {
    if (filter === 'saved') return recipes.filter((r) => r.isSaved);
    if (filter === 'completed') return recipes.filter((r) => r.isCompleted);
    return [];
  }, [filter, recipes]);

  const toggleSave = (id) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r)));
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
          {DUMMY_MEAL_RECORDS.map((meal) => (
            /* 식단 기록 카드: 168×128 둥근 직사각형 */
            <MealCard key={meal.id}>
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
              key={recipe.id}
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
              onClick={() => navigate(`/recipes/${recipe.id}`)}
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
