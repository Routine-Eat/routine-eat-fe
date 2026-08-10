import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import heartEmpty from '../../assets/icons/HeartEmpty.svg';
import heartFilled from '../../assets/icons/HeartFilled.svg';
import arrowIcon from '../../assets/mypage/arrow.svg';
import cartIcon from '../../assets/mypage/cart.svg';
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
        <HeartImg src={recipe.isSaved ? heartFilled : heartEmpty} alt="" />
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
  const isRecord = mode === 'record';

  return (
    // 식단 카드 — 피그마 저장 165×180 / 기록 165×164
    <MealCardBox $isRecord={isRecord}>
      {/* 상단 회색 썸네일 149×90 */}
      <MealThumb>
        <MealThumbBg aria-hidden />
        <MealImgWrap>
          <MealImg src={meal.image} alt={meal.title} />
        </MealImgWrap>
        {/* 하트 — 썸네일 우상단 */}
        <MealHeartBtn type="button" onClick={() => onToggleSave(meal.id)} aria-label="저장">
          <HeartImg src={meal.isSaved ? heartFilled : heartEmpty} alt="" />
        </MealHeartBtn>
      </MealThumb>

      {/* 카드 텍스트 — 저장: 설명 / 기록: 날짜·끼니 */}
      <MealBody $isRecord={isRecord}>
        <MealTitle $isRecord={isRecord}>{meal.title}</MealTitle>
        {isRecord ? (
          <MealMeta>
            <span>{meal.date}</span>
            <span>{meal.progress}</span>
          </MealMeta>
        ) : (
          <MealDesc>{meal.description}</MealDesc>
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
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r)));
  };

  const toggleMealSave = (id) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, isSaved: !m.isSaved } : m)));
  };

  return (
    <Wrap>
      {/* 레시피 / 식단 토글 */}
      <TypeToggle>
        <TypeBtn
          type="button"
          $active={contentType === 'recipe'}
          onClick={() => setContentType('recipe')}
        >
          레시피
        </TypeBtn>
        <TypeBtn
          type="button"
          $active={contentType === 'meal'}
          onClick={() => setContentType('meal')}
        >
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

          {/* 식단 카드 그리드 — 피그마 2열 165px, 좌우 22 */}
          <MealGrid>
            {visibleMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                mode={mealListType}
                onToggleSave={toggleMealSave}
              />
            ))}
          </MealGrid>
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
  grid-template-columns: repeat(2, max-content);
  justify-content: space-between;
  align-content: start;
  gap: 16px 12px;
  padding: 8px 16px 140px;
  overflow-x: hidden;
  overflow-y: auto;
`;

/* 개별 레시피 카드 — 피드와 동일 (피그마 167×229, 텍스트 폭에 맞춰 확장) */
const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: max-content;
  min-width: 167px;
  min-height: 229px;
  align-self: start;
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(154, 80, 0, 0.05),
    0 0 40px 0 rgba(154, 80, 0, 0.08),
    inset 0 0 3px 0.5px #fff;
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
  top: 15px;
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
  width: 18px;
  height: 15px;
  object-fit: contain;
`;

/* 레시피 원형 음식 이미지 — 피그마 x35 y19 97×98 */
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

/* 레시피 카드 하단 텍스트 — 피그마 title y137 / meta y161 / cost y181 / diff y199 */
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 14px 16px;
`;

/* 레시피 제목 */
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

/* 소요시간 텍스트 — 피그마 brand/400-main */
const TimeText = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #72c372;
  white-space: nowrap;
`;

/* 추가 재료 안내 텍스트 */
const ExtraText = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #888;
  white-space: nowrap;
`;

/* 예상 재료비 텍스트 */
const CostText = styled.span`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #696866;
  white-space: nowrap;
`;

/* 난이도 별점 줄 */
const DiffRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
  flex-wrap: nowrap;
`;

/* "난이도" 라벨 */
const DiffLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #696866;
`;

/* 난이도 별 아이콘 */
const StarImg = styled.img`
  width: 15px;
  height: 15px;
  flex-shrink: 0;
`;

/* 식단 전용 2열 그리드 — 피그마 카드 165, 좌 22 / 간격 16 */
const MealGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, 165px);
  justify-content: space-between;
  align-content: start;
  gap: 16px;
  padding: 8px 22px 140px;
  overflow-x: hidden;
  overflow-y: auto;
`;

/* 개별 식단 카드 — 저장 165×180 / 기록 165×164 */
const MealCardBox = styled.article`
  position: relative;
  box-sizing: border-box;
  width: 165px;
  height: ${({ $isRecord }) => ($isRecord ? '164px' : '180px')};
  border-radius: 15px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(154, 80, 0, 0.05),
    0 0 40px 0 rgba(154, 80, 0, 0.08),
    inset 0 0 3px 0.5px #fff;
  overflow: hidden;
`;

/* 식단 썸네일 회색 박스 — 피그마 149×90, margin 8 */
const MealThumb = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;
  width: 149px;
  height: 90px;
  border-radius: 20px;
  overflow: hidden;
`;

/* 썸네일 배경 (피그마 Frame) */
const MealThumbBg = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: #f1f1f1;
`;

/* 식단 썸네일 이미지 박스 — 피그마 44×64 */
const MealImgWrap = styled.div`
  position: relative;
  z-index: 1;
  width: 44px;
  height: 64px;
  overflow: hidden;
`;

/* 피그마 크롭 비율에 맞춘 식단 이미지 */
const MealImg = styled.img`
  position: absolute;
  top: -11.63%;
  left: -505.81%;
  width: 616.77%;
  height: 282.12%;
  max-width: none;
  object-fit: cover;
`;

/* 식단 하트 — 썸네일 우상단 */
const MealHeartBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

/* 식단 카드 하단 텍스트 — 제목 y112/113 → 썸네일 끝 98 → padding-top ≈14/15 */
const MealBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $isRecord }) => ($isRecord ? '6px' : '7px')};
  padding: ${({ $isRecord }) => ($isRecord ? '11px 14px 0' : '10px 14px 0')};
`;

/* 식단 제목 — 저장 14 / 기록 15 */
const MealTitle = styled.h3`
  margin: 0;
  font-size: ${({ $isRecord }) => ($isRecord ? '15px' : '14px')};
  font-weight: 700;
  line-height: 1.2;
  color: #212020;
  letter-spacing: ${({ $isRecord }) => ($isRecord ? '-0.3px' : '-0.28px')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* 저장한 식단 설명 — 피그마 12 Regular #888, 2줄 */
const MealDesc = styled.p`
  margin: 0;
  width: 137px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: #888;
  letter-spacing: -0.24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
`;

/* 식단 기록용 날짜·끼니 — 피그마 gap ≈8, #cacaca */
const MealMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: #cacaca;
  letter-spacing: -0.24px;
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
