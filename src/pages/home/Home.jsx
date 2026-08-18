import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import starFilledIcon from "../../assets/icons/StarFilled.svg";
import starEmptyIcon from "../../assets/icons/StarEmpty.svg";
import closeIcon from "../../assets/icons/x.svg";
import checkIcon from "../../assets/icons/check.svg";
import recipeImg from "../../assets/images/recipeImg.svg";
import { DUMMY_DISHES, DUMMY_INGREDIENT_CATEGORIES, THEME_CARDS } from "../../constants/home/DummyHome.js";
import chevronBrownIcon from "../../assets/icons/chevronBrown.svg";
import chevronGrayIcon from "../../assets/icons/chevronGray.svg";
import fireIcon from "../../assets/icons/fire.svg";
import cometIcon from "../../assets/icons/comet.svg";
import checkBadgeIcon from "../../assets/icons/checkBadge.svg";
import chevronDarkGrayIcon from "../../assets/icons/chevronDarkGray.svg";
import { getAiRecommendedRecipe } from "../../api/home";


const ENERGY_OPTIONS = ["의욕 없음", "보통", "의욕 넘침"];

function getParticle(word) {
  if (!word) return "가";
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return "가";
  const hasBatchim = code % 28 !== 0;
  return hasBatchim ? "이" : "가";
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
font-size: 12px;
font-family: Wanted Sans Variable;
font-weight: 500;
letter-spacing: -0.24px;
line-height: 1.4;

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
    font-size: 14px;
    font-family: Wanted Sans Variable;
    font-weight: 600;
    letter-spacing: 0.14px;
    white-space: nowrap;
  }

  .suffix {
    color: #8f765c;
    font-size: 12px;
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
font-size: 12.5px;
font-family: Wanted Sans Variable;
font-weight: 500;
letter-spacing: -0.3px;
line-height: 1.3;

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
background: ${({ $selected }) => ($selected ? "#72d472" : "#ffffff")};
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
background: ${({ $variant }) => ($variant === "apply" ? "#72d472" : "#e7e7e7")};
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
  background: ${({ $variant }) => ($variant === "confirm" ? "#72d472" : "#f5f5f6")};
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
  filter: ${({ $active }) => ($active ? "none" : "saturate(0.5)")};
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
  font-size: 20px;
  font-family: Wanted Sans Variable;
  font-weight: 700;
  letter-spacing: -0.4px;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.18);
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
        width: 8px;
    height: 14px;
    display: block;
    margin: auto;
    object-fit: contain;
  }

  &.left img {
        transform: rotate(180deg);
    transform-origin: center;
  }
`;

export default function Home() {
  const navigate = useNavigate();
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

  useEffect(() => {
    getAiRecommendedRecipe(1) // TODO: 로그인 붙으면 실제 userId로 교체
      .then(setRecommendedDish)
      .catch((err) => console.error("추천 레시피 조회 실패:", err));
  }, []);

    const allIngredients = DUMMY_INGREDIENT_CATEGORIES.flatMap((c) => c.items);
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
          const dishes = DUMMY_DISHES.length >= 3 ? DUMMY_DISHES.slice(0, 3) : DUMMY_DISHES;
    setRecommendedDishes(dishes);
    setCarouselIndex(Math.floor(dishes.length / 2));
    setIsRecommended(true);
    setIsConfirmModalOpen(false);
  };

    const goToCarouselIndex = (nextIndex) => {
    const count = recommendedDishes.length;
    if (count === 0) return;
    const clamped = Math.max(0, Math.min(count - 1, nextIndex));
    setCarouselIndex(clamped);
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
                const offset = index - carouselIndex;
                const isActive = offset === 0;
                const baseX = offset * CAROUSEL_SIDE_OFFSET;
                const x = baseX + (isCarouselDragging ? carouselDragX : 0);
                const scale = isActive ? 1 : CAROUSEL_SIDE_SCALE;

                return (
                  <CarouselCard
                    key={dish.id ?? index}
                    $x={x}
                    $scale={scale}
                    $active={isActive}
                    $dragging={isCarouselDragging}
                    onClick={() => !isCarouselDragging && goToCarouselIndex(index)}
                  >
                                        <CarouselThumbBox>
                      <img src={recipeImg} alt={dish.name} />
                    </CarouselThumbBox>
                    <CarouselCardName $active={isActive}>{dish.name}</CarouselCardName>
                    <CarouselCardDesc $active={isActive}>
                      <p>15분 안에 간단하게 요리할 수 있어요.</p>
                      <p>난이도가 낮아요. 있는 재료로만 요리할 수 있어요.</p>
                    </CarouselCardDesc>
                  </CarouselCard>
                );
              })}
            </CarouselTrack>

            {carouselIndex > 0 && (
              <CarouselArrowButton
                className="left"
                onClick={() => goToCarouselIndex(carouselIndex - 1)}
              >
                <img src={chevronDarkGrayIcon} alt="이전" />
              </CarouselArrowButton>
            )}
            {carouselIndex < recommendedDishes.length - 1 && (
              <CarouselArrowButton
                className="right"
                onClick={() => goToCarouselIndex(carouselIndex + 1)}
              >
                <img src={chevronDarkGrayIcon} alt="다음" />
              </CarouselArrowButton>
            )}
          </CarouselWrap>
        </>
      ) : (
        <>
          <Title>오늘의 추천 레시피예요</Title>
          <Subtitle>집에 있는 재료와 요리 수준, 선호도를 고려했어요</Subtitle>
          
{recommendedDish && (
          <RecipeCardWrap>
            <RecipeThumbBox>
                            <img
                src={recommendedDish.menuThumbnailUrl || recipeImg}
                alt={recommendedDish.menuName}
              />
            </RecipeThumbBox>
            <RecipeName>{recommendedDish.menuName}</RecipeName>
            <RecipeDesc>
              <p>{recommendedDish.reason}</p>
            </RecipeDesc>
          </RecipeCardWrap>
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

                        {selectedIngredientObjects.length === 0 ? (
              <IngredientButton onClick={() => setIsIngredientModalOpen(true)}>
                <span className="label">원하는 재료 선택하기</span>
                <img className="chevron" src={chevronDarkGrayIcon} alt="" />
              </IngredientButton>
            ) : (
              <SelectedIngredientButton onClick={() => setIsIngredientModalOpen(true)}>
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
            )}
          </DetailSection>

                    <RecommendButton onClick={() => setIsConfirmModalOpen(true)}>
            선택한 조건으로 추천받기
          </RecommendButton>
        </ToggleOpenCard>
      )}

      <ThemeSectionTitle>오늘의 추천 식단이에요</ThemeSectionTitle>
      <ThemeSectionSubtitle>집에 있는 재료와 요리 수준, 선호도를 고려했어요</ThemeSectionSubtitle>

      <ThemeGrid>
        {THEME_CARDS.map((theme) => (
           <ThemeCard key={theme.id} onClick={() => navigate(`/menu/${theme.id}`)}>
            <img className="icon" src={theme.icon} alt="" />
            <span className="title">{theme.title}</span>
            <div className="desc">
              {theme.desc.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </ThemeCard>
        ))}
      </ThemeGrid>

      {isIngredientModalOpen && (
        <ModalOverlay onClick={handleCancel}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">원하는 재료 선택하기</div>
            <div className="modal-subtitle">보유한 재료 중 최대 3개까지 선택가능</div>

            {DUMMY_INGREDIENT_CATEGORIES.map((category) => (
              <div className="ingredient-category" key={category.title}>
                <div className="category-title">{category.title}</div>
                <div className="chip-wrap">
                  {category.items.map((item) => (
                    <IngredientChip
                      key={item.id}
                      $selected={selectedIngredients.includes(item.id)}
                      onClick={() => toggleIngredient(item.id)}
                    >
                      {item.icon && (
                        <span className="chip-icon">
                          <img src={item.icon} alt="" />
                        </span>
                      )}
                      <span className="chip-name">{item.name}</span>
                      <span className="chip-qty">{item.qty}</span>
                    </IngredientChip>
                  ))}
                </div>
              </div>
            ))}

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