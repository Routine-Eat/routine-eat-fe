import React, { useState } from "react";
import styled from "styled-components";
import eggFoodImg from "../../assets/images/EggFood.svg";
import infoIconImg from "../../assets/icons/Information.svg";
import starFilledIcon from "../../assets/icons/StarFilled.svg";
import starEmptyIcon from "../../assets/icons/StarEmpty.svg";
import vegetableImg from "../../assets/images/Vegetable.svg";
import meatImg from "../../assets/images/Meat.svg";
import heartFilledIcon from "../../assets/icons/HeartFilled.svg";
import heartEmptyIcon from "../../assets/icons/HeartEmpty.svg";

const HomeContainer = styled.div`
background: #fffdfc;
max-width: 390px;
margin: 0 auto;
padding: 0 24px;
overflow-x: hidden;
`;

const FirstSection = styled.div`
.section-title{
color: #212020;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 700;
}

.section-subtitle{
margin-top: 4px;
color: #888;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 400;
}

.dish-list{
margin-top: 16px;
display: flex;
overflow-x: auto;
scroll-snap-type: x mandatory;
-webkit-overflow-scrolling: touch;
padding: 4px 0 12px 0;
margin-right: -24px;
scrollbar-width: none;

&::-webkit-scrollbar{
display: none;
}
}
`;

const DishCard = styled.div`
position: relative;
flex-shrink: 0;
width: 210px;
border-radius: 24px;
background: ${({ $active }) => ($active ? "#fafafa" : "#ffffff")};
box-shadow: 0px 0px 10px 0px rgba(107, 56, 0, 0.06), 0px 0px 40px 0px rgba(97, 51, 0, 0.05);
padding: 16px;
scroll-snap-align: start;
z-index: ${({ $zIndex }) => $zIndex};
margin-left: ${({ $overlap }) => ($overlap ? "-47px" : "0")};

.info-icon{
position: absolute;
top: 16px;
left: 16px;
z-index: 2;
width: 24px;
height: 24px;
border-radius: 50%;
overflow: hidden;

img{
width: 100%;
height: 100%;
display: block;
object-fit: contain;
}
}

.thumb{
margin: 28px auto 0;
width: 124px;
height: 124px;
border-radius: 50%;
background: #f0f0f0;
box-shadow: 0px 0px 10px 0px rgba(61, 32, 0, 0.05), 0px 0px 40px 0px rgba(110, 58, 0, 0.13);
object-fit: cover;
display: block;
}

.dish-name{
margin-top: 16px;
color: #3c3a39;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 700;
}

.dish-meta{
margin-top: 6px;
display: flex;
align-items: center;
gap: 6px;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;

.time{
color: #00b4c1;
}

.no-extra{
color: #888;
}
}

.dish-cost{
margin-top: 4px;
color: #696866;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;
}

.dish-difficulty{
margin-top: 6px;
display: flex;
align-items: center;
gap: 4px;

.label{
color: #696866;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;
margin-right: 2px;
}

.star{
width: 15px;
height: 15px;
display: inline-block;
}
}
`;

const SecondSection = styled.div`
margin-top: 24px;
border-radius: 20px;
background: #ffeca0;
padding: 20px;
box-shadow: 0px 0px 10px 0px rgba(154, 80, 0, 0.05), 0px 0px 40px 0px rgba(154, 80, 0, 0.08);

.energy-title{
color: #3c3a39;
font-size: 15px;
font-family: Pretendard Variable;
font-weight: 500;
}

.energy-toggle{
margin-top: 12px;
display: flex;
gap: 4px;
background: #fbfbfb;
border-radius: 30px;
padding: 4px;
}

.energy-option{
flex: 1;
text-align: center;
padding: 8px 0;
border-radius: 25px;
border: none;
cursor: pointer;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 600;
color: #3c3a39;
background: transparent;

&.active{
background: #ffcd00;
color: white;
font-weight: 700;
}
}

.difficulty-title{
margin-top: 16px;
color: #3c3a39;
font-size: 15px;
font-family: Pretendard Variable;
font-weight: 500;
}

.difficulty-stars{
margin-top: 8px;
display: flex;
gap: 6px;

.star{
width: 30px;
height: 30px;
display: inline-block;
}
}

.ingredient-button{
margin-top: 16px;
width: 100%;
height: 40px;
border-radius: 10px;
border: none;
background: #fbfbfb;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 16px;
cursor: pointer;

.left{
display: flex;
align-items: center;
gap: 8px;

.carrot-icon{
width: 17px;
height: 17px;
border-radius: 4px;
background: #e5e5e5;
}

.label{
color: #3c3a39;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 600;
}
}

.chevron{
color: #999;
font-size: 18px;
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
gap: 6px;
height: 36px;
padding: 0 12px;
border-radius: 30px;
border: none;
cursor: pointer;
background: ${({ $selected }) => ($selected ? "#72d472" : "#ffffff")};
box-shadow: 0px 0px 8px -1px rgba(72, 28, 0, 0.08), 0px 0px 40px 0px rgba(17, 0, 0, 0.05);

.chip-emoji{
font-size: 16px;
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

const RecommendButton = styled.button`
margin-top: 16px;
width: 100%;
height: 53px;
border-radius: 18px;
border: none;
background: #d6f3a1;
box-shadow: 0px 0px 10px 0px rgba(154, 80, 0, 0.05), 0px 0px 40px 0px rgba(154, 80, 0, 0.08);
color: #3c3a39;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
cursor: pointer;
`;

const ThirdSection = styled.div`
margin-top: 32px;

.section-title{
color: #212020;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 700;
}

.section-subtitle{
margin-top: 4px;
color: #888;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 400;
}

.meal-grid{
margin-top: 16px;
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
}
`;

const MealCard = styled.div`
position: relative;
border-radius: 15px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(154, 80, 0, 0.05), 0px 0px 40px 0px rgba(154, 80, 0, 0.08);
padding: 8px;

.thumb-box{
position: relative;
width: 100%;
height: 90px;
border-radius: 15px;
background: #f2f2f2;
overflow: hidden;
display: flex;
align-items: center;
justify-content: center;
}

.thumb{
max-width: 60%;
max-height: 75%;
width: auto;
height: auto;
object-fit: contain;
display: block;
}

.like-button{
position: absolute;
top: 8px;
right: 8px;
width: 24px;
height: 24px;
border-radius: 50%;
background: transparent;
border: none;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;

img{
width: 18px;
height: 18px;
}
}

.meal-name{
margin-top: 12px;
color: #212020;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 600;
}

.meal-desc{
margin-top: 6px;
color: #888;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 400;
line-height: 1.3;
}
`;

const DISHES = [
  { id: 1, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 1, image: eggFoodImg },
  { id: 2, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 4, image: eggFoodImg },
  { id: 3, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 2, image: eggFoodImg },
];

const ENERGY_LEVELS = ["의욕 넘침", "보통", "귀찮음"];

const INITIAL_MEALS = [
  { id: 1, name: "채소 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: true, image: vegetableImg },
  { id: 2, name: "단백질 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: true, image: meatImg },
  { id: 3, name: "채소 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: false, image: vegetableImg },
  { id: 4, name: "채소 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: true, image: vegetableImg },
];

const INGREDIENT_CATEGORIES = [
  {
    title: "신선식품",
    items: [
      { id: "milk", name: "우유", qty: "1팩", emoji: "🥛" },
      { id: "beef", name: "우삼겹", qty: "1팩", emoji: "🥓" },
      { id: "onion", name: "양파", qty: "1팩", emoji: "🧅" },
      { id: "cheese", name: "치즈", qty: "1팩", emoji: "🧀" },
      { id: "egg", name: "계란", qty: "1팩", emoji: "🥚" },
    ],
  },
  {
    title: "가공식품",
    items: [
      { id: "dumpling1", name: "만두", qty: "1팩", emoji: "🥟" },
      { id: "tuna1", name: "참치캔", qty: "1팩", emoji: "🐟" },
      { id: "dumpling2", name: "만두", qty: "1팩", emoji: "🥟" },
      { id: "icecream", name: "아이스크림", qty: "1팩", emoji: "🍦" },
      { id: "tuna2", name: "참치캔", qty: "1팩", emoji: "🐟" },
      { id: "dumpling3", name: "만두", qty: "1팩", emoji: "🥟" },
      { id: "dumpling4", name: "만두", qty: "1팩", emoji: "🥟" },
    ],
  },
];
function StarRow({ count, total = 5, size, onStarClick }) {
  return (
    <>
      {Array.from({ length: total }).map((_, i) => (
        <img
          key={i}
          className="star"
          src={i < count ? starFilledIcon : starEmptyIcon}
          alt=""
          style={{
            ...(size ? { width: size, height: size } : undefined),
            cursor: onStarClick ? "pointer" : "default",
          }}
          onClick={onStarClick ? () => onStarClick(i + 1) : undefined}
        />
      ))}
    </>
  );
}

export default function Home() {
  const [energy, setEnergy] = useState("보통");
  const [difficulty, setDifficulty] = useState(4);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 3) return prev; // 최대 3개까지
      return [...prev, id];
    });
  };

  const handleApply = () => {
    setIsIngredientModalOpen(false);
  };

  const handleCancel = () => {
    setIsIngredientModalOpen(false);
  };

  const toggleLike = (id) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m))
    );
  };

  return (
    <HomeContainer>
      <FirstSection>
        <span className="section-title">오늘의 추천 메뉴예요.</span>
        <div className="section-subtitle">보통 난이도 채소 위주로 골랐어요.</div>

        <div className="dish-list">
          {DISHES.map((dish, i) => (
            <DishCard key={dish.id} $active={i === 0} $zIndex={DISHES.length - i} $overlap={i > 0}>
                {i === 0 && (
                    <div className="info-icon">
                        <img src={infoIconImg} alt="정보 아이콘" />
                    </div>
                )}
                 {dish.image ? (
        <img className="thumb" src={dish.image} alt={dish.name} />
      ) : (
        <img className="thumb" src={eggFoodImg} alt={dish.name} />
      )}
              <div className="dish-name">{dish.name}</div>
              <div className="dish-meta">
                <span className="time">{dish.time}</span>
                <span className="no-extra">추가 재료 구매 X</span>
              </div>
              <div className="dish-cost">{dish.cost}</div>
              <div className="dish-difficulty">
                <span className="label">난이도</span>
                <StarRow count={dish.difficulty} />
              </div>
            </DishCard>
          ))}
        </div>
      </FirstSection>

      <SecondSection>
        <div className="energy-title">오늘의 요리 열정(에너지)</div>
        <div className="energy-toggle">
          {ENERGY_LEVELS.map((level) => (
            <button
              key={level}
              className={`energy-option${energy === level ? " active" : ""}`}
              onClick={() => setEnergy(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="difficulty-title">난이도</div>
        <div className="difficulty-stars">
          <StarRow count={difficulty} size={30} onStarClick={setDifficulty} />
        </div>

        <button className="ingredient-button" onClick={() => setIsIngredientModalOpen(true)}>
          <span className="left">
            <span className="carrot-icon" />
            <span className="label">원하는 재료 선택하기</span>
          </span>
          <span className="chevron">›</span>
        </button>
      </SecondSection>

      <RecommendButton>다시 추천 받기</RecommendButton>

      <ThirdSection>
        <span className="section-title">이번주 추천 식단이에요.</span>
        <div className="section-subtitle">지난주 영양 밸런스를 반영한 채소 위주의 식단이에요</div>

        <div className="meal-grid">
  {meals.map((meal) => (
    <MealCard key={meal.id}>
      <div className="thumb-box">
        <img className="thumb" src={meal.image} alt={meal.name} />
        <button className="like-button" onClick={() => toggleLike(meal.id)}>
          <img src={meal.liked ? heartFilledIcon : heartEmptyIcon} alt="찜하기" />
        </button>
      </div>
      <div className="meal-name">{meal.name}</div>
      <div className="meal-desc">{meal.desc}</div>
    </MealCard>
  ))}
</div>
      </ThirdSection>
      {isIngredientModalOpen && (
        <ModalOverlay onClick={handleCancel}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">원하는 재료 선택하기</div>
            <div className="modal-subtitle">보유한 재료 중 최대 3개까지 선택가능</div>

            {INGREDIENT_CATEGORIES.map((category) => (
              <div className="ingredient-category" key={category.title}>
                <div className="category-title">{category.title}</div>
                <div className="chip-wrap">
                  {category.items.map((item) => (
                    <IngredientChip
                      key={item.id}
                      $selected={selectedIngredients.includes(item.id)}
                      onClick={() => toggleIngredient(item.id)}
                    >
                      <span className="chip-emoji">{item.emoji}</span>
                      <span className="chip-name">{item.name}</span>
                      <span className="chip-qty">{item.qty}</span>
                    </IngredientChip>
                  ))}
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <ModalButton $variant="cancel" onClick={handleCancel}>
                ✕ 취소
              </ModalButton>
              <ModalButton $variant="apply" onClick={handleApply}>
                ✓ 적용
              </ModalButton>
            </div>
          </ModalBox>
        </ModalOverlay>
      )}
    </HomeContainer>
  );
}