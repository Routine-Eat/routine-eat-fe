import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import starFilledIcon from "../../assets/icons/StarFilled.svg";
import { THEME_CARDS, MISSING_INGREDIENTS } from "../../constants/home/DummyHome.js";
import eggFoodImg from "../../assets/images/EggFood.svg";
import BackButton from "../../common/button/BackButton";
import shoppingCartIcon from "../../assets/icons/shoppingCart.svg";
import dragHandleBar from "../../assets/icons/dragHandleBar.svg";
import starEmptyIcon from "../../assets/icons/StarEmpty.svg";
import BottomFixedButton from "../../common/button/BottomFixedButton";
import { getAiMealPlanRecommendation, postUserMealPlan } from "../../api/mealPlanApi";
import { useUserStore } from "../../hooks/useUserStore";
import { useCookingStore } from "../../hooks/useCookingStore";

const THEME_TO_AI_KEY = {
  "skill-up": "practice",
  quick: "simple",
  "max-ingredient": "useAll",
  "one-ingredient": "recycling",
};

const THEME_TO_TYPE = {
  "skill-up": "PRACTICE",
  quick: "SIMPLE",
  "max-ingredient": "USEALL",
  "one-ingredient": "RECYCLING",
};

const parseDifficulty = (value) => {
  const level = Number(String(value ?? "").replace("LEVEL_", ""));
  return Number.isFinite(level) ? level : 0;
};

const mapAiMenus = (menus) =>
  (menus ?? []).map((item) => ({
    id: item.menuId,
    name: item.menuName ?? "",
    time: `${item.timeRequired ?? 0}분 소요`,
    cost: `예상 재료비 ${Number(item.price ?? 0).toLocaleString()}원`,
    difficulty: parseDifficulty(item.difficultyLevel),
    image: item.menuThumbnailUrl || eggFoodImg,
    matchRate: item.sameRate ?? null,
  }));

   const sheetSlideUp = keyframes`
   from { opacity: 0; transform: translateY(60px); }
   to { opacity: 1; transform: translateY(0); }
 `;

 const sheetSlideDown = keyframes`
   from { opacity: 1; transform: translateY(0); }
   to { opacity: 0; transform: translateY(60px); }
 `;

 const overlayFadeIn = keyframes`
   from { opacity: 0; }
   to { opacity: 1; }
 `;

 const overlayFadeOut = keyframes`
   from { opacity: 1; }
   to { opacity: 0; }
 `;

const PageContainer = styled.div`
background: #fffdfc;
margin: 0 auto;
min-height: 100vh;
padding: 0 24px 100px;
position: relative;
`;

const Header = styled.div`
position: relative;
height: 80px;
display: flex;
align-items: center;
justify-content: center;

.back-button{
position: absolute;
left: 0;
}

.title{
color: #232323;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
}
`;

const PageTitle = styled.p`
  margin: 8px 0 0;
  text-align: center;
  color: #481c00;
  font-size: 22px;
  font-family: Wanted Sans Variable;
  font-weight: 700;
  letter-spacing: -0.22px;
`;

const PageSubtitle = styled.p`
  margin: 6px 0 0;
  text-align: center;
  color: #8b8b8b;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
`;

const RecipeList = styled.div`
display: flex;
flex-direction: column;
gap: 16px;
margin-top: 16px;
`;

const RecipeCard = styled.div`
display: flex;
align-items: center;
gap: 20px;
height: 148px;
padding: 12px 16px 12px 12px;
border-radius: 22px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(72, 28, 0, 0.05), 0px 0px 30px 0px rgba(72, 28, 0, 0.06);

.thumb-box{
flex-shrink: 0;
width: 124px;
height: 124px;
border-radius: 18px;
display: flex;
align-items: center;
justify-content: center;
overflow: hidden;
}

.thumb{
width: 100%;
height: 100%;
border-radius: 18px;
object-fit: cover;
box-shadow: 0px 0px 10px 0px rgba(61, 32, 0, 0.05), 0px 0px 40px 0px rgba(110, 58, 0, 0.13);
}

.info{
flex: 1;
}

.recipe-name{
color: #3c3a39;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 700;
}

.recipe-meta{
margin-top: 8px;
display: flex;
align-items: center;
gap: 6px;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 500;

.time{
color: #72d472;
}

.no-extra{
color: #888;
}
}

.recipe-cost{
margin-top: 8px;
color: #696866;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 500;
}

.recipe-difficulty{
margin-top: 8px;
display: flex;
align-items: center;
gap: 4px;

.label{
color: #696866;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 500;
}

.star{
width: 16px;
height: 16px;
}
}
`;

const StartModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
  padding: 0 20px 20px;
  animation: ${({ $closing }) => ($closing ? overlayFadeOut : overlayFadeIn)} 0.25s ease;
`;

const StartModalSheet = styled.div`
  position: relative;
  width: 100%;
  max-width: 350px;
  max-height: 480px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0px 0px 40px 0px rgba(3, 3, 3, 0.08), 0px 0px 10px 0px rgba(3, 3, 3, 0.06);
  padding: 40px 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${({ $closing }) => ($closing ? sheetSlideDown : sheetSlideUp)} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
`;

const DragHandle = styled.div`
  position: absolute;
  left: 50%;
  top: 8px;
  transform: translateX(-50%);

  img {
    display: block;
  }
`;

const ModalHeadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CartIconBox = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
    height: 32px;
    display: block;
  }
`;

const ModalHeadingText = styled.div`
  text-align: center;
  color: #2e2e2e;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  line-height: 1.3;

  p {
    margin: 0;
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
 justify-content: flex-start;
  max-height: 140px;
 overflow-y: auto;
 padding-right: 4px;

  scrollbar-width: none;
 -ms-overflow-style: none;

 &::-webkit-scrollbar {
   display: none;
 }
`;

const MissingChip = styled.div`
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: #f5f5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #727272;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
`;

const StartModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StartModalButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.3px;
  box-shadow: inset 0px 0px 3px 0px white;
  background: ${({ $variant }) => ($variant === "primary" ? "#d6f3a1" : "#f5f5f6")};
  color: #444;
`;

const StartButtonPress = styled.div`
  > button {
    transition:
      transform 100ms ease,
      background-color 100ms ease,
      color 100ms ease,
      font-size 100ms ease;
    transform-origin: center;
  }

  > button:active:not(:disabled) {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 17px;
    transform: translateX(-50%) scale(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    > button {
      transition: none;
    }
  }
`;

export default function HomeMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mealId } = useParams();
  const userId = useUserStore((state) => state.userId);
  const setMissingIngredientsByMenuId = useCookingStore((state) => state.setMissingIngredientsByMenuId);


  const theme = THEME_CARDS.find((t) => t.id === mealId) || THEME_CARDS[0];
  const [recommendation, setRecommendation] = useState(location.state?.recommendation ?? null);
  const menuDishes = mapAiMenus(recommendation?.menus);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const missingIngredients = Array.from(
   new Set((recommendation?.menus ?? []).flatMap((item) => item.missingIngredients ?? []))
 );
  
  const closeStartModal = () => {
   setIsModalClosing(true);
   setTimeout(() => {
     setIsStartModalOpen(false);
     setIsModalClosing(false);
   }, 250);
 };

  useEffect(() => {
    if (location.state?.recommendation) {
      setRecommendation(location.state.recommendation);
      return undefined;
    }
    if (!userId) return undefined;

    const fetchRecommendation = async () => {
      try {
        const response = await getAiMealPlanRecommendation(userId);
        const payload = response.data ?? response;
        console.log("AI 목적별 식단 추천 응답:", payload);
        setRecommendation(payload?.[THEME_TO_AI_KEY[mealId]] ?? null);
      } catch (error) {
        console.error("AI 목적별 식단 추천 조회 실패:", error);
      }
    };

    fetchRecommendation();
  }, [location.state?.recommendation, userId, mealId]);

  const startMealPlan = async () => {
    if (!userId) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    try {
           const map = {};
     (recommendation?.menus ?? []).forEach((item) => {
       map[item.menuId] = item.missingIngredients ?? [];
     });
     setMissingIngredientsByMenuId(map);
      const response = await postUserMealPlan(userId, {
        mealPlanType: recommendation?.type ?? THEME_TO_TYPE[mealId],
        mealPlanStatus: "PROGRESS",
        planMenuIdList: (recommendation?.menus ?? [])
          .map((item) => item.menuId)
          .filter((id) => id != null),
      });
      const payload = response.data ?? response;
      navigate(`/diet-start/${payload.mealPlanId ?? mealId}`);
    } catch (error) {
      console.error("사용자 식단 저장 실패:", error);
    }
  };

  const handleStartClick = () => {
    if (missingIngredients.length > 0) {
      setIsStartModalOpen(true);
    } else {
      startMealPlan();
    }
  };

  const handleAddToShoppingList = () => {
    closeStartModal();
    navigate("/shopping-list");
  };

  const handleProceedWithoutAdding = () => {
    closeStartModal();
    startMealPlan();
  };

  return (
    <PageContainer>
      <Header>
        <BackButton className="back-button" onClick={() => navigate(-1)} />
      </Header>

       <PageTitle>{theme.title}</PageTitle>
      <PageSubtitle>{theme.desc.join("")}</PageSubtitle>

      <RecipeList>
        {menuDishes.map((recipe, idx) => (
          <RecipeCard key={recipe.id ?? idx}>
            <div className="thumb-box">
              <img className="thumb" src={recipe.image} alt={recipe.name} />
            </div>
            <div className="info">
              <div className="recipe-name">{recipe.name}</div>
              <div className="recipe-meta">
                <span className="time">{recipe.time}</span>
                                {recipe.matchRate != null ? (
                  <span className="no-extra">재료 일치율 {recipe.matchRate}%</span>
                ) : (
                  <span className="no-extra">추가 재료 구매 X</span>
                )}
              </div>
              <div className="recipe-cost">{recipe.cost}</div>
              <div className="recipe-difficulty">
                <span className="label">난이도</span>
                                {Array.from({ length: 5 }).map((_, idx) => (
                  <img
                    key={idx}
                    className="star"
                    src={idx < recipe.difficulty ? starFilledIcon : starEmptyIcon}
                    alt=""
                  />
                ))}
              </div>
            </div>
          </RecipeCard>
        ))}
      </RecipeList>

      <StartButtonPress>
        <BottomFixedButton onClick={handleStartClick}>
          식단 시작하기
        </BottomFixedButton>
      </StartButtonPress>
            {isStartModalOpen && (
               <StartModalOverlay $closing={isModalClosing} onClick={closeStartModal}>
         <StartModalSheet $closing={isModalClosing} onClick={(e) => e.stopPropagation()}>
            <DragHandle>
              <img src={dragHandleBar} alt="" />
            </DragHandle>

            <ModalHeadingBox>
              <CartIconBox>
                <img src={shoppingCartIcon} alt="" />
              </CartIconBox>
              <ModalHeadingText>
                <p>해당 재료가 부족해요</p>
               <p>그래도 레시피를 시작할까요?</p>
              </ModalHeadingText>
            </ModalHeadingBox>

            <ChipRow>
              {missingIngredients.map((name) => (
                <MissingChip key={name}>{name}</MissingChip>
              ))}
            </ChipRow>

            <StartModalActions>
              <StartModalButton onClick={handleAddToShoppingList}>
                장보기 목록에 추가
              </StartModalButton>
              <StartModalButton $variant="primary" onClick={handleProceedWithoutAdding}>
                추가 없이 진행할게요
              </StartModalButton>
            </StartModalActions>
          </StartModalSheet>
        </StartModalOverlay>
      )}
    </PageContainer>
  );
}