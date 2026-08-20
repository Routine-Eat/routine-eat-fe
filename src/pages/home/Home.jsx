import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { useUserStore } from "../../hooks/useUserStore";
import starFilledIcon from "../../assets/icons/StarFilled.svg";
import starEmptyIcon from "../../assets/icons/StarEmpty.svg";
import closeIcon from "../../assets/icons/x.svg";
import checkIcon from "../../assets/icons/check.svg";
import recipeImg from "../../assets/images/recipeImg.svg";
import { DUMMY_INGREDIENT_CATEGORIES, THEME_CARDS } from "../../constants/home/DummyHome.js";
import { getUserFoodIngredients } from "@/api/userApi";
import chevronBrownIcon from "../../assets/icons/chevronBrown.svg";
import chevronGrayIcon from "../../assets/icons/chevronGray.svg";
import fireIcon from "../../assets/icons/fire.svg";
import cometIcon from "../../assets/icons/comet.svg";
import checkBadgeIcon from "../../assets/icons/checkBadge.svg";
import chevronDarkGrayIcon from "../../assets/icons/chevronDarkGray.svg";
import sparkleIcon from "../../assets/icons/sparkle.svg";
import { getAiRecommendedRecipe, postAiRecipeRecommendAgain } from "../../api/recipe";
import { getAiMealPlanRecommendation } from "../../api/mealPlanApi";
import carouselArrowIcon from "../../assets/icons/carouselArrow.svg";
import { getIngredientIcon } from "@/constants/iconsMap";

const ENERGY_OPTIONS = ["의욕 없음", "보통", "의욕 넘침"];

const THEME_TO_AI_KEY = {
  "skill-up": "practice",
  quick: "simple",
  "max-ingredient": "useAll",
  "one-ingredient": "recycling",
};

function getParticle(word) {
  if (!word) return "가";
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return "가";
  const hasBatchim = code % 28 !== 0;
  return hasBatchim ? "이" : "가";
}

 function containsKorean(text) {
   return /[가-힣]/.test(text);
 }

 function getTextWidth(text, font) {
   const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
   const context = canvas.getContext("2d");
   context.font = font;
   return context.measureText(text).width;
 }

 const CAROUSEL_NAME_MAX_WIDTH = 160;
 const INGREDIENT_TEXT_MAX_WIDTH = 220;
 const THEME_DESC_LINE_WIDTH = 134; 
const THEME_DESC_MAX_LINES = 2;
const THEME_DESC_FONT_SIZES = [12.5, 11, 9.5, 8.5]; // 큰 것부터 순서대로 시도

function getThemeDescFontSize(text) {
  for (const size of THEME_DESC_FONT_SIZES) {
    const width = getTextWidth(text, `500 ${size}px 'Wanted Sans Variable'`);
    const lines = Math.ceil(width / THEME_DESC_LINE_WIDTH);
    if (lines <= THEME_DESC_MAX_LINES) return size;
  }
  return THEME_DESC_FONT_SIZES[THEME_DESC_FONT_SIZES.length - 1]; // 그래도 안 맞으면 제일 작은 값 사용
}

const CAROUSEL_CARD_WIDTH = 216;
const CAROUSEL_CARD_HEIGHT = 288;
const CAROUSEL_SIDE_SCALE = 0.85;
const CAROUSEL_SIDE_OFFSET = 168;
const CAROUSEL_SWIPE_THRESHOLD = 50;

const DIFFICULTY_LABELS = [
  "아주 간단해요",
  "간단한 편이에요",
  "과정이 조금 있어요",
  "과정이 많은 편이에요",
  "과정이 꽤 복잡해요",
];

const HomeContainer = styled.div`
background: #fffefd;
max-width: 390px;
margin: 0 auto;
padding: 0 24px 40px;
overflow-x: hidden;
`;

const Title = styled.p`
margin: 20px 0 0;
color: #481c00;
font-size: 22px;
font-family: Wanted Sans Variable;
font-weight: 700;
letter-spacing: -0.22px;
text-align: center;
`;

const Subtitle = styled.p`
margin: 6px 0 0;
color: #bebebf;
font-size: 15px;
font-family: Wanted Sans Variable;
font-weight: 500;
letter-spacing: -0.3px;
text-align: center;
`;

const RecipeCardWrap = styled.div`
margin: 28px auto 0;
width: 216px;
min-height: 288px;
border-radius: 30px;
position: relative;
overflow: hidden;
background: linear-gradient(148deg, #fff6b4 14%, #fffbe1 44%, #ffeca0 57%, #fff6b4 80%);
box-shadow: 0px 0px 20px 0px rgba(72, 28, 0, 0.15), 0px 0px 10px 0px rgba(72, 28, 0, 0.04);
display: flex;
flex-direction: column;
padding-bottom: 18px;
cursor: pointer;

&::after{
content: "";
position: absolute;
inset: 0;
border-radius: inherit;
box-shadow: inset 0px 0px 15px 0px white;
pointer-events: none;
}
`;

const RecipeThumbBox = styled.div`
margin: 11px 12px 0;
height: 153px;
flex-shrink: 0;
border-radius: 26px;
background: white;
box-shadow: 0px 0px 5px 0px rgba(107, 56, 0, 0.08), 0px 0px 40px 0px rgba(97, 51, 0, 0.05);
overflow: hidden;
display: flex;
align-items: center;
justify-content: center;

img{
width: 100%;
height: 100%;
object-fit: cover;
display: block;
transform: scale(1.);
}
`;

const RecipeName = styled.p`
margin: 12px 18px 0;
color: #481c00;
font-size: 20px;
font-family: Wanted Sans Variable;
font-weight: 700;
letter-spacing: -0.4px;
`;

const RecipeDesc = styled.div`
margin: 6px 18px 0;
color: #805200;
font-size: ${({ $compact }) => ($compact ? "10.5px" : "12px")};
font-family: Wanted Sans Variable;
font-weight: 500;
letter-spacing: -0.24px;
line-height: ${({ $compact }) => ($compact ? "1.3" : "1.4")};

p{
margin: 0;
}
`;

const ToggleClosed = styled.button`
margin-top: 20px;
width: 100%;
height: 59px;
border-radius: 15px;
background: #fff6b5;
border: none;
cursor: pointer;
display: flex;
align-items: center;
gap: 8px;
padding: 0 20px;
box-shadow: inset 0px 0px 3px 0px white;

.chevron{
display: block;
width: 14px;
height: 14px;
}

.label{
color: #481c00;
font-size: 16px;
font-family: Wanted Sans Variable;
font-weight: 600;
letter-spacing: -0.16px;
}
`;

const ToggleOpenCard = styled.div`
margin-top: 20px;
width: 100%;
border-radius: 24px;
background: white;
box-shadow: 0px 0px 6px 0px rgba(114, 114, 114, 0.25);
padding: 20px;
display: flex;
flex-direction: column;
gap: 24px;
`;

const ToggleOpenHeader = styled.button`
display: flex;
align-items: center;
gap: 7px;
background: none;
border: none;
cursor: pointer;
padding: 0;

.chevron{
display: block;
width: 14px;
height: 14px;
}

.label{
color: #bebebf;
font-size: 16px;
font-family: Wanted Sans Variable;
font-weight: 600;
letter-spacing: -0.16px;
}
`;

const DetailSection = styled.div`
display: flex;
flex-direction: column;
gap: 28px;

.field-label{
display: flex;
align-items: center;
gap: 4px;
color: #2e2e2e;
font-size: 16px;
font-family: Wanted Sans Variable;
font-weight: 600;
letter-spacing: -0.16px;
margin-bottom: 12px;

.field-icon{
width: 20px;
height: 20px;
display: block;
}

.difficulty-desc{
color: #888;
font-size: 14px;
font-weight: 500;
margin-left: 4px;
}
}
`;

const EnergyToggle = styled.div`
display: flex;
gap: 4px;
background: #f5f5f6;
border-radius: 12px;
padding: 4px;
`;

const EnergyOption = styled.button`
flex: 1;
text-align: center;
padding: 10px 0;
border-radius: 10px;
border: none;
cursor: pointer;
font-size: 15px;
font-family: Wanted Sans Variable;
font-weight: 600;
color: #727272;
background: transparent;

&.active{
background: #ffeca0;
color: #2e2e2e;
}
`;

const DifficultyRow = styled.div`
display: flex;
align-items: center;
gap: 4px;
width: fit-content;
padding: 0 8px;

.star{
width: 32px;
height: 32px;
cursor: pointer;
}
`;

const IngredientButton = styled.button`
width: 100%;
height: 48px;
border-radius: 12px;
border: none;
background: #f5f5f6;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 16px;
cursor: pointer;

.label{
color: #2e2e2e;
font-size: 15px;
font-family: Wanted Sans Variable;
font-weight: 600;
letter-spacing: -0.15px;
}

.chevron{
display: block;
width: 14px;
height: 14px;
}
`;

const SelectedIngredientButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #ffeca0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .left {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .ingredient-icon {
    width: 20px;
    height: 20px;
    display: block;
  }

  .ingredient-text {
    display: flex;
    align-items: center;
  }

  .ingredient-name {
    color: #2c0500;
    font-size: ${({ $compact }) => ($compact ? "12px" : "14px")};
    font-family: Wanted Sans Variable;
    font-weight: 600;
    letter-spacing: 0.14px;
    white-space: nowrap;
  }

  .suffix {
    color: #8f765c;
    font-size: ${({ $compact }) => ($compact ? "10.5px" : "12px")};
    font-family: Wanted Sans Variable;
    font-weight: 600;
    letter-spacing: 0.12px;
    margin-left: 4px;
    white-space: nowrap;
  }

  .chevron {
    width: 14px;
    height: 14px;
    display: block;
    flex-shrink: 0;
    transform: rotate(-90deg);
  }
`;

const RecommendButton = styled.button`
width: 100%;
height: 48px;
border-radius: 12px;
border: none;
background: #d6f3a1;
box-shadow: inset 0px 0px 3px 0px white;
color: #444;
font-size: 15px;
font-family: Wanted Sans Variable;
font-weight: 600;
letter-spacing: -0.3px;
cursor: pointer;
`;

const ThemeSectionTitle = styled.p`
margin: 64px 0 0;
text-align: center;
color: #481c00;
font-size: 22px;
font-family: Wanted Sans Variable;
font-weight: 700;
letter-spacing: -0.22px;
`;

const ThemeSectionSubtitle = styled.p`
margin: 8px 0 0;
text-align: center;
color: #bebebf;
font-size: 15px;
font-family: Wanted Sans Variable;
font-weight: 500;
letter-spacing: -0.3px;
`;

const ThemeGrid = styled.div`
margin-top: 32px;
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 8px;
`;

const ThemeCard = styled.button`
height: 148px;
border-radius: 15px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05);
border: none;
cursor: pointer;
padding: 22px 16px;
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 8px;
text-align: left;

.icon{
width: 32px;
height: 32px;
display: block;
}

.title{
color: #1a1a1a;
font-size: 18px;
font-family: Wanted Sans Variable;
font-weight: 700;
letter-spacing: -0.36px;
}

.desc{
width: 100%;
color: #727272;
font-size: ${({ $fontSize }) => `${$fontSize}px`};
font-family: Wanted Sans Variable;
font-weight: 500;
letter-spacing: -0.3px;
line-height: 1.25;

p{
margin: 0;
}
}
`;

const ModalOverlay = styled.div`
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.4);
display: flex;
align-items: center;
justify-content: center;
z-index: 100;
padding: 20px;
`;

const ModalBox = styled.div`
position: relative;
width: 100%;
max-width: 350px;
max-height: 85vh;
overflow-y: auto;
background: white;
border-radius: 30px;
box-shadow: 0px 0px 10px 0px rgba(107, 56, 0, 0.06), 0px 0px 40px 0px rgba(97, 51, 0, 0.05);
padding: 45px 17px 24px;

.modal-title{
text-align: center;
color: #000000;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
}

.modal-subtitle{
margin-top: 8px;
text-align: center;
color: #888;
font-size: 15px;
font-family: Pretendard Variable;
font-weight: 400;
}

.ingredient-category{
margin-top: 24px;

.category-title{
color: #6d6d6d;
font-size: 13px;
font-family: Pretendard Variable;
font-weight: 600;
margin-bottom: 12px;
}

.chip-wrap{
display: flex;
flex-wrap: wrap;
gap: 12px 4px;
}
}

.modal-actions{
margin-top: 24px;
display: flex;
gap: 8px;
justify-content: center;
}
`;

const IngredientChip = styled.button`
display: flex;
align-items: center;
gap: 4px;
height: 36px;
padding: 0 8px;
border-radius: 30px;
border: none;
cursor: pointer;
background: ${({ $selected }) => ($selected ? "#96D960" : "#ffffff")};
box-shadow: 0px 0px 8px -1px rgba(72, 28, 0, 0.08), 0px 0px 40px 0px rgba(17, 0, 0, 0.05);

.chip-icon{
display: flex;
align-items: center;

img{
width: 20px;
height: 20px;
display: block;
}
}

.chip-name{
color: ${({ $selected }) => ($selected ? "#ffffff" : "#2a2a2a")};
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 600;
}

.chip-qty{
color: ${({ $selected }) => ($selected ? "#ffffff" : "#a9a9a9")};
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;
}
`;

const ModalButton = styled.button`
flex: 1;
max-width: 122px;
height: 48px;
border-radius: 10px;
border: none;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
gap: 4px;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
background: ${({ $variant }) => ($variant === "apply" ? "#96D960" : "#e7e7e7")};
color: ${({ $variant }) => ($variant === "apply" ? "#ffffff" : "#3e3e3e")};
`;

const ConfirmModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

const ConfirmModalBox = styled.div`
  width: 100%;
  max-width: 312px;
  background: white;
  border: 0.5px solid #d9d9da;
  border-radius: 22px;
  padding: 24px 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const ConfirmIconBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const ConfirmText = styled.div`
  text-align: center;
  color: #1a1a1a;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  line-height: 1.4;

  p {
    margin: 0;
  }
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ConfirmButton = styled.button`
  width: 130px;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.16px;
  background: ${({ $variant }) => ($variant === "confirm" ? "#96D960" : "#f5f5f6")};
  color: ${({ $variant }) => ($variant === "confirm" ? "#ffffff" : "#8b8b8b")};
`;

const CarouselWrap = styled.div`
  position: relative;
  margin: 28px auto 0;
  width: 100%;
  height: ${CAROUSEL_CARD_HEIGHT}px;
  overflow: visible;
`;

const CarouselTrack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: pan-y;
  user-select: none;
`;

const CarouselCard = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: ${CAROUSEL_CARD_WIDTH}px;
  height: ${CAROUSEL_CARD_HEIGHT}px;
  margin-left: -${CAROUSEL_CARD_WIDTH / 2}px;
  border-radius: 30px;
  overflow: hidden;
  cursor: grab;
  will-change: transform, opacity;
  transition: ${({ $dragging }) =>
    $dragging
      ? "none"
      : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease, filter 0.35s ease"};
  transform: ${({ $x, $scale }) => `translateX(${$x}px) scale(${$scale})`};
  opacity: ${({ $active }) => ($active ? 1 : 0.55)};
  filter: none;
  z-index: ${({ $active }) => ($active ? 2 : 1)};
  box-shadow: 0px 0px 12px 0px rgba(72, 28, 0, 0.06),
    0px 0px 20px 0px rgba(46, 46, 46, 0.25);

  background: ${({ $active }) =>
    $active
      ? "linear-gradient(148deg, #fff6b4 14%, #fffbe1 44%, #ffeca0 57%, #fff6b4 80%)"
      : "linear-gradient(148deg, #f5f5f6 14%, #ffffff 44%, #d9d9da 57%, #f5f5f6 80%)"};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0px 0px 15px 0px white;
    pointer-events: none;
  }
`;

const CarouselThumbBox = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  top: 11px;
  height: 153px;
  border-radius: 26px;
  background: white;
  box-shadow: 0px 0px 5px 0px rgba(107, 56, 0, 0.08),
    0px 0px 40px 0px rgba(97, 51, 0, 0.05);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CarouselCardName = styled.p`
  position: absolute;
  left: 18px;
  top: 180px;
  margin: 0;
  width: 160px;
  color: ${({ $active }) => ($active ? "#481c00" : "#444")};
  font-size: ${({ $compact }) => ($compact ? "14px" : "20px")};
  font-family: Wanted Sans Variable;
  font-weight: 700;
  letter-spacing: -0.4px;
     white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
`;

const CarouselCardDesc = styled.div`
  position: absolute;
  left: 18px;
  top: 212px;
  width: 190px;
  color: ${({ $active }) => ($active ? "#805200" : "#5a5a5b")};
  font-size: 12px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.24px;
  line-height: 1.4;

  p {
    margin: 0;
  }
`;

const CarouselArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  padding: 0;

  &.left {
    left: 4px;
  }
  &.right {
    right: 4px;
  }

  img {
        width: 14px;
    height: 28px;
    display: block;
    margin: auto;
    object-fit: contain;
    filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.5));
  }

  &.left img {
        transform: rotate(180deg);
    transform-origin: center;
  }
`;

export default function Home() {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  console.log("현재 userId:", userId, typeof userId);
  const [energy, setEnergy] = useState("보통");
  const [difficulty, setDifficulty] = useState(4);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isRecommended, setIsRecommended] = useState(false);
  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselDragX, setCarouselDragX] = useState(0);
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
    const carouselStartXRef = useRef(0);
  const carouselDraggingRef = useRef(false);

    const [recommendedDish, setRecommendedDish] = useState(null);
    const [ownedIngredients, setOwnedIngredients] = useState([]); // 실제 보유 재료 목록
  const [mealPlanRecommendations, setMealPlanRecommendations] = useState(null);


  useEffect(() => {
        if (!userId) return; // 로그인 안 된 상태면 호출하지 않음
    getAiRecommendedRecipe(userId)
                       .then((res) => {
       console.log("추천 레시피 응답:", res);
       setRecommendedDish(res.data);
     })
      .catch((err) => console.error("추천 레시피 조회 실패:", err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    getAiMealPlanRecommendation(userId)
      .then((res) => {
        setMealPlanRecommendations(res.data ?? res);
      })
      .catch((err) => console.error("AI 목적별 식단 추천 조회 실패:", err));
  }, [userId]);

    useEffect(() => {
    if (!userId) return;
    getUserFoodIngredients(userId, "OWN")
      .then((res) => {
        const list = res.data?.foodIngredientList ?? [];
        setOwnedIngredients(
          list.map((item) => ({
            id: item.foodIngredientId,       // 서버가 이해하는 진짜 숫자 ID
            name: item.foodIngredientName,
            qty: item.primaryAmountValue != null
              ? `${item.primaryAmountValue}${item.foodIngredientPrimaryUnit}`
              : "",
            icon: getIngredientIcon(item.foodIngredientName, item.foodIngredientType),
          }))
        );
      })
      .catch((err) => console.error("보유 식재료 조회 실패:", err));
  }, [userId]);

    const allIngredients = ownedIngredients;
  const selectedIngredientObjects = selectedIngredients
    .map((id) => allIngredients.find((item) => item.id === id))
    .filter(Boolean);
  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleApply = () => {
    setIsIngredientModalOpen(false);
  };

  const handleCancel = () => {
    setIsIngredientModalOpen(false);
  };

    const handleConfirmRecommend = () => {
    setIsConfirmModalOpen(false);

        const difficultyMap = ["LEVEL_1", "LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"];
    const energyToTimeFilter = { "의욕 없음": "QUICK", "보통": "MEDIUM", "의욕 넘침": "LONG" };

    postAiRecipeRecommendAgain(userId, {
      difficultyLevel: difficultyMap[difficulty],
      timeFilter: energyToTimeFilter[energy],
      desiredIngredientIds: selectedIngredients,
      previousRecipeId: recommendedDish?.recipeId,
    })
             .then((res) => {
       setRecommendedDishes(res.data);
       setCarouselIndex(Math.floor(res.data.length / 2));
       setIsRecommended(true);
     })
      .catch((err) => console.error("레시피 재추천 실패:", err));
  };

    const goToCarouselIndex = (nextIndex) => {
    const count = recommendedDishes.length;
    if (count === 0) return;
         const wrapped = (nextIndex + count) % count;
     setCarouselIndex(wrapped);
  };

  const handleCarouselPointerDown = (e) => {
    if (recommendedDishes.length <= 1) return;
    carouselDraggingRef.current = true;
    setIsCarouselDragging(true);
    carouselStartXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleCarouselPointerMove = (e) => {
    if (!carouselDraggingRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setCarouselDragX(clientX - carouselStartXRef.current);
  };

  const endCarouselDrag = () => {
    if (!carouselDraggingRef.current) return;
    carouselDraggingRef.current = false;
    setIsCarouselDragging(false);

    if (carouselDragX <= -CAROUSEL_SWIPE_THRESHOLD) {
      goToCarouselIndex(carouselIndex + 1);
    } else if (carouselDragX >= CAROUSEL_SWIPE_THRESHOLD) {
      goToCarouselIndex(carouselIndex - 1);
    }
    setCarouselDragX(0);
  };

  return (
    <HomeContainer>
            {isRecommended ? (
        <>
          <Title>
            조건을 고려해
            <br />
            레시피 3개를 추천해드렸어요
          </Title>

          <CarouselWrap>
            <CarouselTrack
              onPointerDown={handleCarouselPointerDown}
              onPointerMove={handleCarouselPointerMove}
              onPointerUp={endCarouselDrag}
              onPointerLeave={endCarouselDrag}
              onPointerCancel={endCarouselDrag}
            >
              {recommendedDishes.map((dish, index) => {
                               const count = recommendedDishes.length;
               let offset = index - carouselIndex;
               if (offset > count / 2) offset -= count;
               if (offset < -count / 2) offset += count;
                const isActive = offset === 0;
                const baseX = offset * CAROUSEL_SIDE_OFFSET;
                const x = baseX + (isCarouselDragging ? carouselDragX : 0);
                const scale = isActive ? 1 : CAROUSEL_SIDE_SCALE;
                               const menuName = dish.menuName || "";
               const fullWidth = getTextWidth(menuName, "700 20px 'Wanted Sans Variable'");
               const isNameCompact = fullWidth > CAROUSEL_NAME_MAX_WIDTH;

                return (
                  <CarouselCard
                    key={dish.menuId ?? index}
                    $x={x}
                    $scale={scale}
                    $active={isActive}
                    $dragging={isCarouselDragging}
                    onClick={() => !isCarouselDragging && goToCarouselIndex(index)}
                  >
                                        <CarouselThumbBox>
                      <img src={dish.menuThumbnailUrl || recipeImg} alt={dish.menuName} />
                    </CarouselThumbBox>
                                        <CarouselCardName $active={isActive} $compact={isNameCompact}>
                     {dish.menuName}
                   </CarouselCardName>
                    <CarouselCardDesc $active={isActive}>
                       <p>{dish.reason}</p>
                    </CarouselCardDesc>
                  </CarouselCard>
                );
              })}
            </CarouselTrack>

                       {recommendedDishes.length > 1 && (
             <>
               <CarouselArrowButton
                 className="left"
                 onClick={() => goToCarouselIndex(carouselIndex - 1)}
               >
                 <img src={carouselArrowIcon} alt="이전" />
               </CarouselArrowButton>
               <CarouselArrowButton
                 className="right"
                 onClick={() => goToCarouselIndex(carouselIndex + 1)}
               >
                 <img src={carouselArrowIcon} alt="다음" />
               </CarouselArrowButton>
             </>
           )}
          </CarouselWrap>
        </>
      ) : (
        <>
          <Title>오늘 만들기 좋은 한 끼예요</Title>
          <Subtitle>집에 있는 재료와 요리 경험을 반영했어요.</Subtitle>
          
{recommendedDish && (
   (() => {
   const reasonLength = (recommendedDish.reason || "").length;
   const isCompact = reasonLength > 45;
   return (
          <RecipeCardWrap onClick={() => navigate(`/recipes/${recommendedDish.recipeId}`)}>
            <RecipeThumbBox>
                            <img
                src={recommendedDish.menuThumbnailUrl || recipeImg}
                alt={recommendedDish.menuName}
              />
            </RecipeThumbBox>
            <RecipeName>{recommendedDish.menuName}</RecipeName>
            <RecipeDesc $compact={isCompact}>
              <p>{recommendedDish.reason}</p>
            </RecipeDesc>
          </RecipeCardWrap>
             );
 })()
)}
        </>
      )}

      {!isDetailOpen && (
        <ToggleClosed onClick={() => setIsDetailOpen(true)}>
          <img className="chevron" src={chevronBrownIcon} alt="" />
          <span className="label">상세조건을 선택해 재추천 받아보세요</span>
        </ToggleClosed>
      )}

      {isDetailOpen && (
        <ToggleOpenCard>
          <ToggleOpenHeader onClick={() => setIsDetailOpen(false)}>
            <img className="chevron" src={chevronGrayIcon} alt="" />
            <span className="label">추천 상세조건 설정</span>
          </ToggleOpenHeader>

          <DetailSection>
            <div>
                            <div className="field-label">
                <img className="field-icon" src={fireIcon} alt="" />
                오늘의 요리 열정
              </div>
              <EnergyToggle>
                {ENERGY_OPTIONS.map((level) => (
                  <EnergyOption
                    key={level}
                    className={energy === level ? "active" : ""}
                    onClick={() => setEnergy(level)}
                  >
                    {level}
                  </EnergyOption>
                ))}
              </EnergyToggle>
            </div>

            <div>
                            <div className="field-label">
                <img className="field-icon" src={cometIcon} alt="" />
                난이도
                 <span className="difficulty-desc">{DIFFICULTY_LABELS[difficulty - 1]}</span>
              </div>
              <DifficultyRow>
                {Array.from({ length: 5 }).map((_, i) => (
                  <img
                    key={i}
                    className="star"
                    src={i < difficulty ? starFilledIcon : starEmptyIcon}
                    alt=""
                    onClick={() => setDifficulty(i + 1)}
                  />
                ))}
              </DifficultyRow>
            </div>

                                   <div>
             <div className="field-label">
               <img className="field-icon" src={sparkleIcon} alt="" />
               꼭 쓰고싶은 재료
             </div>
             {selectedIngredientObjects.length === 0 ? (
               <IngredientButton onClick={() => setIsIngredientModalOpen(true)}>
                 <span className="label">원하는 재료 선택하기</span>
                 <img className="chevron" src={chevronDarkGrayIcon} alt="" />
               </IngredientButton>
             ) : (
                             (() => {
                const nameText =
                  selectedIngredientObjects[0].name +
                  (selectedIngredientObjects.length > 1
                    ? ` 외 ${selectedIngredientObjects.length - 1}개`
                    : "");
                const suffixText = `${getParticle(selectedIngredientObjects[0].name)} 포함된 레시피 추천할게요`;
                               const nameWidth = getTextWidth(nameText, "600 14px 'Wanted Sans Variable'");
               const suffixWidth = getTextWidth(suffixText, "600 12px 'Wanted Sans Variable'");
               const isCompact = nameWidth + suffixWidth + 4 > INGREDIENT_TEXT_MAX_WIDTH;
                return (
                <SelectedIngredientButton
                  $compact={isCompact}
                  onClick={() => setIsIngredientModalOpen(true)}
                >
                 <div className="left">
                   {selectedIngredientObjects[0].icon && (
                     <img
                       className="ingredient-icon"
                       src={selectedIngredientObjects[0].icon}
                       alt=""
                     />
                   )}
                   <div className="ingredient-text">
                     <span className="ingredient-name">
                       {selectedIngredientObjects[0].name}
                       {selectedIngredientObjects.length > 1 &&
                         ` 외 ${selectedIngredientObjects.length - 1}개`}
                     </span>
                     <span className="suffix">
                       {getParticle(selectedIngredientObjects[0].name)} 포함된 레시피 추천할게요
                     </span>
                   </div>
                 </div>
                 <img className="chevron" src={chevronBrownIcon} alt="" />
               </SelectedIngredientButton>
                );
              })()
             )}
           </div>
          </DetailSection>

                    <RecommendButton onClick={() => setIsConfirmModalOpen(true)}>
            선택한 조건으로 추천받기
          </RecommendButton>
        </ToggleOpenCard>
      )}

      <ThemeSectionTitle>오늘 시작하기 좋은 세 끼 식단이에요</ThemeSectionTitle>
      <ThemeSectionSubtitle>집에 있는 재료와 선호도, 경험을 반영했어요.</ThemeSectionSubtitle>

      <ThemeGrid>
        {THEME_CARDS.map((theme) => {
                   const recommendation = mealPlanRecommendations?.[THEME_TO_AI_KEY[theme.id]] ?? null;
         const desc = theme.desc;

         const descFullText = desc.join(" ");
         const descFontSize = getThemeDescFontSize(descFullText);
          return (
            <ThemeCard
              key={theme.id}
              $fontSize={descFontSize}
              onClick={() =>
                navigate(`/menu/${theme.id}`, {
                  state: { recommendation },
                })
              }
            >
              <img className="icon" src={theme.icon} alt="" />
              <span className="title">{theme.title}</span>
              <div className="desc">
                {desc.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </ThemeCard>
          );
        })}
      </ThemeGrid>

      {isIngredientModalOpen && (
        <ModalOverlay onClick={handleCancel}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">원하는 재료 선택하기</div>
            <div className="modal-subtitle">보유한 재료 중 최대 3개까지 선택가능</div>

            {DUMMY_INGREDIENT_CATEGORIES.map((category) => (
                           null
            ))}
            <div className="ingredient-category">
              <div className="chip-wrap">
                {ownedIngredients.map((item) => (
                  <IngredientChip
                    key={item.id}
                    $selected={selectedIngredients.includes(item.id)}
                    onClick={() => toggleIngredient(item.id)}
                  >
                    <span className="chip-name">{item.name}</span>
                   <span className="chip-qty">{item.qty}</span>
                  </IngredientChip>
                ))}
                {ownedIngredients.length === 0 && (
                  <p style={{ color: "#a9a9a9", fontSize: 14 }}>보유한 재료가 없어요</p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <ModalButton $variant="cancel" onClick={handleCancel}>
                <img src={closeIcon} alt="" style={{ width: 13, height: 13 }} />
                취소
              </ModalButton>
              <ModalButton $variant="apply" onClick={handleApply}>
                <img src={checkIcon} alt="" style={{ width: 14, height: 10 }} />
                적용
              </ModalButton>
            </div>
          </ModalBox>
        </ModalOverlay>
      )}
            {isConfirmModalOpen && (
        <ConfirmModalOverlay onClick={() => setIsConfirmModalOpen(false)}>
          <ConfirmModalBox onClick={(e) => e.stopPropagation()}>
            <ConfirmIconBox>
              <img src={checkBadgeIcon} alt="" />
            </ConfirmIconBox>
            <ConfirmText>
              <p>선택한 조건을 포함해</p>
              <p>레시피를 재추천할게요</p>
            </ConfirmText>
            <ConfirmActions>
              <ConfirmButton $variant="cancel" onClick={() => setIsConfirmModalOpen(false)}>
                취소
              </ConfirmButton>
              <ConfirmButton $variant="confirm" onClick={handleConfirmRecommend}>
                확인
              </ConfirmButton>
            </ConfirmActions>
          </ConfirmModalBox>
        </ConfirmModalOverlay>
      )}
    </HomeContainer>
  );
}