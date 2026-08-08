import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import arrowIcon from '../../assets/mypage/arrow.svg';
import cartIcon from '../../assets/mypage/cart.svg';
import heartFilled from '../../assets/mypage/heart-filled.svg';
import heartOutline from '../../assets/mypage/heart-outline.svg';
import starIcon from '../../assets/mypage/star.svg';
import { DUMMY_MEALS } from '../../constants/dummyMeals';
import { DUMMY_RECIPES } from '../../constants/dummyRecipes';

function RecipeCard({ recipe, onToggleSave }) {
  return (
    // 레시피 카드
    <Card>
      {/* 완료 뱃지 — 완료한 레시피일 때만 */}
      {recipe.isCompleted && <DoneBadge>완료</DoneBadge>}

      {/* 하트 아이콘 */}
      <HeartBtn type="button" onClick={() => onToggleSave(recipe.id)} aria-label="저장">
        <HeartImg src={recipe.isSaved ? heartFilled : heartOutline} alt="" />
      </HeartBtn>

      {/* 음식 이미지 */}
      <FoodImg src={recipe.image} alt={recipe.title} />

      {/* 카드 텍스트 영역 */}
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

function MealCard({ meal, mode, onToggleSave }) {
  return (
    // 식단 카드
    <MealCardBox>
      {/* 상단 이미지 영역 */}
      <MealThumb>
        <MealImg src={meal.image} alt={meal.title} />
        {/* 하트 — 저장한 식단은 초록 채움 */}
        <HeartBtn type="button" onClick={() => onToggleSave(meal.id)} aria-label="저장">
          <HeartImg src={meal.isSaved ? heartFilled : heartOutline} alt="" />
        </HeartBtn>
      </MealThumb>

      {/* 카드 텍스트 */}
      <MealBody>
        <MealTitle>{meal.title}</MealTitle>
        {mode === 'saved' ? (
          <MealDesc>{meal.description}</MealDesc>
        ) : (
          <MealMeta>
            <span>{meal.date}</span>
            <span>{meal.progress}</span>
          </MealMeta>
        )}
      </MealBody>
    </MealCardBox>
  );
}

function RecipeTab() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(DUMMY_RECIPES);
  const [meals, setMeals] = useState(DUMMY_MEALS);
  const [contentType, setContentType] = useState('recipe'); // 레시피 | 식단
  const [recipeListType, setRecipeListType] = useState('saved'); // 저장한 | 완료한
  const [mealListType, setMealListType] = useState('saved'); // 저장한 | 기록

  // 레시피 필터
  const visibleRecipes = useMemo(() => {
    if (recipeListType === 'saved') return recipes.filter((r) => r.isSaved);
    return recipes.filter((r) => r.isCompleted);
  }, [recipeListType, recipes]);

  // 식단 필터
  const visibleMeals = useMemo(() => {
    if (mealListType === 'saved') return meals.filter((m) => m.isSaved);
    return meals.filter((m) => m.isRecord);
  }, [mealListType, meals]);

  const toggleRecipeSave = (id) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const toggleMealSave = (id) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isSaved: !m.isSaved } : m))
    );
  };

  return (
    <Wrap>
      {/* 레시피 / 식단 토글 */}
      <TypeToggle>
        <TypeBtn type="button" $active={contentType === 'recipe'} onClick={() => setContentType('recipe')}>
          레시피
        </TypeBtn>
        <TypeBtn type="button" $active={contentType === 'meal'} onClick={() => setContentType('meal')}>
          식단
        </TypeBtn>
      </TypeToggle>

      {contentType === 'recipe' ? (
        <>
          {/* 저장한 레시피 / 완료한 레시피 필터 */}
          <ListFilter>
            <FilterBtn
              type="button"
              $active={recipeListType === 'saved'}
              onClick={() => setRecipeListType('saved')}
            >
              저장한 레시피
            </FilterBtn>
            <FilterBtn
              type="button"
              $active={recipeListType === 'completed'}
              onClick={() => setRecipeListType('completed')}
            >
              완료한 레시피
            </FilterBtn>
          </ListFilter>

          {/* 레시피 카드 그리드 */}
          <Grid>
            {visibleRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onToggleSave={toggleRecipeSave} />
            ))}
          </Grid>
        </>
      ) : (
        <>
          {/* 저장한 식단 / 식단 기록 필터 */}
          <ListFilter>
            <FilterBtn
              type="button"
              $active={mealListType === 'saved'}
              onClick={() => setMealListType('saved')}
            >
              저장한 식단
            </FilterBtn>
            <FilterBtn
              type="button"
              $active={mealListType === 'record'}
              onClick={() => setMealListType('record')}
            >
              식단 기록
            </FilterBtn>
          </ListFilter>

          {/* 식단 카드 그리드 */}
          <Grid>
            {visibleMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                mode={mealListType}
                onToggleSave={toggleMealSave}
              />
            ))}
          </Grid>
        </>
      )}

      {/* 하단 CTA 버튼 */}
      <BottomBar>
        <ShopBtn type="button" onClick={() => navigate('/market')}>
          <CartIcon src={cartIcon} alt="" />
          필요한 재료 사러 갈까요?
          <ArrowIcon src={arrowIcon} alt="" />
        </ShopBtn>
      </BottomBar>
    </Wrap>
  );
}

/* 레시피·식단 탭 전체 영역 */
const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/* 레시피 / 식단 토글 줄 */
const TypeToggle = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 20px 0;
`;

/* 레시피·식단 토글 알약 버튼 */
const TypeBtn = styled.button`
  flex: 1;
  height: 27px;
  border: none;
  border-radius: 5px;
  background: ${({ $active }) => ($active ? '#72d472' : '#ededed')};
  color: ${({ $active }) => ($active ? '#fff' : '#000')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

/* 저장한/완료한·식단 기록 텍스트 필터 줄 */
const ListFilter = styled.div`
  display: flex;
  gap: 20px;
  padding: 18px 20px 8px;
`;

/* 필터 텍스트 버튼 */
const FilterBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? '#72d472' : '#616161')};
  cursor: pointer;
`;

/* 카드 2열 그리드 (스크롤 영역) */
const Grid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 16px 12px;
  padding: 8px 20px 140px;
  overflow-x: hidden;
  overflow-y: auto;
`;

/* 개별 레시피 카드 */
const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: start;
  min-width: 0;
  height: auto;
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(154, 80, 0, 0.05),
    0 0 40px 0 rgba(154, 80, 0, 0.08);
`;

/* 완료 뱃지 텍스트 */
const DoneBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1;
  font-size: 12px;
  font-weight: 600;
  color: #72d472;
`;

/* 하트 저장 버튼 */
const HeartBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

/* 하트 아이콘 이미지 */
const HeartImg = styled.img`
  width: 16px;
  height: 14px;
  object-fit: contain;
`;

/* 레시피 원형 음식 이미지 */
const FoodImg = styled.img`
  display: block;
  width: min(97px, 62%);
  aspect-ratio: 1;
  height: auto;
  margin: 28px auto 0;
  object-fit: cover;
  border-radius: 50%;
`;

/* 레시피 카드 하단 텍스트 영역 */
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 12px 12px 16px;
`;

/* 레시피 제목 */
const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #3c3a39;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

/* 소요시간·추가재료 한 줄 */
const MetaRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex-wrap: wrap;
  min-width: 0;
`;

/* 소요시간 텍스트 (청록색) */
const TimeText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #00b4c1;
  word-break: keep-all;
`;

/* 추가 재료 안내 텍스트 */
const ExtraText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #888;
  word-break: keep-all;
`;

/* 예상 재료비 텍스트 */
const CostText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #696866;
  word-break: keep-all;
`;

/* 난이도 별점 줄 */
const DiffRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

/* "난이도" 라벨 */
const DiffLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #696866;
`;

/* 난이도 별 아이콘 */
const StarImg = styled.img`
  width: 15px;
  height: 15px;
  flex-shrink: 0;
`;

/* 개별 식단 카드 */
const MealCardBox = styled.article`
  display: flex;
  flex-direction: column;
  align-self: start;
  min-width: 0;
  border-radius: 15px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(154, 80, 0, 0.05),
    0 0 40px 0 rgba(154, 80, 0, 0.08);
`;

/* 식단 썸네일 회색 박스 */
const MealThumb = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 8px 0;
  height: 90px;
  border-radius: 10px;
  background: #ededed;
`;

/* 식단 썸네일 안 음식 이미지 */
const MealImg = styled.img`
  width: 44px;
  height: 64px;
  object-fit: contain;
`;

/* 식단 카드 하단 텍스트 영역 */
const MealBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px 14px;
  min-width: 0;
`;

/* 식단 제목 */
const MealTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #212020;
  word-break: keep-all;
`;

/* 저장한 식단 설명 문구 */
const MealDesc = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: #888;
  word-break: keep-all;
`;

/* 식단 기록용 날짜·끼니 줄 */
const MealMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #cacaca;
`;

/* 하단 고정 바 (둥근 상단 패널) */
const BottomBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 56px;
  z-index: 15;
  width: 100%;
  max-width: 390px;
  transform: translateX(-50%);
  padding: 16px 20px 20px;
  background: #fff;
  box-shadow: 0 -1px 14.6px 0 rgba(201, 201, 189, 0.25);
  border-radius: 22px 22px 0 0;
`;

/* 초록 CTA 버튼 — 재료 사러가기 */
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
  cursor: pointer;
`;

/* CTA 왼쪽 장바구니 아이콘 */
const CartIcon = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`;

/* CTA 오른쪽 화살표 아이콘 */
const ArrowIcon = styled.img`
  width: 16px;
  height: 16px;
  transform: rotate(90deg);
`;

export default RecipeTab;
