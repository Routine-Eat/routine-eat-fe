import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_DIET_PROGRESS, THEME_CARDS, MISSING_INGREDIENTS } from "../../constants/home/DummyHome.js";
import muscleIcon from "../../assets/icons/muscle.svg";
import BottomFixedButton from "../../common/button/BottomFixedButton";
import chefIcon from "../../assets/icons/chef.svg";
import checkCircleWhiteIcon from "../../assets/icons/checkCircleWhite.svg";
import forkKnifeIcon from "../../assets/images/forkKnife.svg";

const PageContainer = styled.div`
  background: #fffefd;
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 60px 24px 24px;
  position: relative;
`;

const StopLink = styled.button`
  position: absolute;
  right: 24px;
  top: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #bebebf;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.14px;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;

  img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const PageTitle = styled.p`
  margin: 12px 0 0;
  color: #481c00;
  font-size: 22px;
  font-family: Wanted Sans Variable;
  font-weight: 700;
  letter-spacing: -0.22px;
`;

const PageSubtitle = styled.p`
  margin: 8px 0 0;
  color: #8b8b8b;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.28px;
`;

const MealTabs = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

const MealTab = styled.div`
  flex: 1;
  height: 68px;
  border-radius: 10px;
  background: ${({ $done }) => ($done ? "#d6f3a1" : "#f5f5f6")};
  border: ${({ $done }) => ($done ? "2px solid #c2ee73" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #727272;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
`;

const RecipeListHeading = styled.p`
  margin: 30px 0 0;
  color: #444;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.36px;
`;

const EmptyNotice = styled.p`
  margin: 20px 0 0;
  color: #444;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.32px;
`;

const MealList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MealRow = styled.div`
  position: relative;
  height: 88px;
  border-radius: 16px;
  padding: 0 20px 0 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: ${({ $completed }) => ($completed ? "default" : "pointer")};
  background: ${({ $completed, $isNext }) =>
   $completed ? "#e9e9e9" : $isNext ? "#d6f3a1" : "#ffffff"};
  border: ${({ $completed, $isNext }) =>
    !$completed && $isNext ? "2px solid #c2ee73" : "none"}; 
  box-shadow: 0px 0px 8px 0px rgba(3, 3, 3, 0.05), 0px 0px 30px 0px rgba(3, 3, 3, 0.05);

  .thumb-box {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: 14px;
    background: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .thumb {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0px 0px 10px 0px rgba(61, 32, 0, 0.05), 0px 0px 40px 0px rgba(110, 58, 0, 0.13);
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .meal-name {
    color: ${({ $isNext }) => ($isNext ? "#004100" : "#5a5a5b")};
    font-size: 16px;
    font-family: Wanted Sans Variable;
    font-weight: 700;
    letter-spacing: -0.16px;
  }

  .meal-status {
      color: ${({ $completed, $isNext }) =>
      $completed ? "#8b8b8b" : $isNext ? "#006000" : "#bebebf"};
    font-size: 15px;
    font-family: Wanted Sans Variable;
    font-weight: 500;
    letter-spacing: -0.15px;
  }

  .detail-link {
    flex-shrink: 0;
        color: ${({ $completed, $isNext }) =>
      $completed ? "#8b8b8b" : $isNext ? "#5a5a5b" : "#8b8b8b"};
    font-size: 14px;
    font-family: Wanted Sans Variable;
    font-weight: 500;
    text-decoration: underline;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
`;

const MissingSection = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MissingHeading = styled.p`
  margin: 0;
  color: #444;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.16px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MissingChip = styled.div`
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: #f5f5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b8b8b;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
`;

const MissingActions = styled.div`
  display: flex;
  gap: 4px;
`;

const MissingActionButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: ${({ $variant }) => ($variant === "bought" ? "none" : "1px solid #d9d9da")};
  background: ${({ $variant }) => ($variant === "bought" ? "#e9e9e9" : "#fffefd")};
  color: ${({ $variant }) => ($variant === "bought" ? "#727272" : "#5a5a5b")};
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  cursor: pointer;
`;

const BoughtModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

const BoughtModalBox = styled.div`
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

const BoughtIconBox = styled.div`
  width: 40px;
  height: 40px;

  img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const BoughtTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const BoughtTitle = styled.p`
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  line-height: 1.3;
`;

const BoughtDesc = styled.div`
  color: #8b8b8b;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 1.3;

  p {
    margin: 0;
  }
`;

const BoughtActions = styled.div`
  display: flex;
  gap: 8px;
`;

const BoughtActionButton = styled.button`
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

const toastFade = `
  @keyframes toastFade {
    0% { opacity: 0; transform: translate(-50%, 8px); }
    10% { opacity: 1; transform: translate(-50%, 0); }
    85% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 8px); }
  }
`;

const Toast = styled.div`
  ${toastFade}
  position: fixed;
  left: 50%;
  bottom: 120px;
  transform: translate(-50%, 0);
  z-index: 300;
  background: #727272;
  border-radius: 10px;
  padding: 12px 16px 12px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: toastFade 2s ease forwards;
  pointer-events: none;
  max-width: calc(100% - 48px);

  img {
    width: 24px;
    height: 24px;
    display: block;
    flex-shrink: 0;
  }

  span {
    color: white;
    font-size: 14px;
    font-family: Wanted Sans Variable;
    font-weight: 600;
    letter-spacing: -0.14px;
  }
`;

export default function HomeDietStart() {
  const navigate = useNavigate();
  const { mealId } = useParams();

  const theme = THEME_CARDS.find((t) => t.id === mealId) || THEME_CARDS[0];
  const meals = DUMMY_DIET_PROGRESS.slice(0, 3);
  const completedCount = meals.filter((m) => m.completed).length;
  const [selectedMealId, setSelectedMealId] = useState(
    () => meals.find((m) => !m.completed)?.id
  );
  const missingIngredients = MISSING_INGREDIENTS;
  const [isBoughtModalOpen, setIsBoughtModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleAddToShoppingList = () => {
    showToast("재료를 장보기 목록에 추가했어요");
  };

  useEffect(() => {
    if (!isToastVisible) return;
    const timer = setTimeout(() => setIsToastVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  const handleRegisterIngredients = () => {
    setIsBoughtModalOpen(false);
    showToast("재료를 등록했어요. 상세수량은 my에서 수정할 수 있어요.");
  };

  const handleStopDiet = () => {
    setIsStopModalOpen(false);
    navigate("/");
  };

  return (
    <PageContainer>
      <StopLink onClick={() => setIsStopModalOpen(true)}>식단 중단하기 &gt;</StopLink>

      <IconBox>
        <img src={muscleIcon} alt="" />
      </IconBox>

      <PageTitle>{theme.title}을 진행 중이에요</PageTitle>
      <PageSubtitle>레시피 선택 후 시작하기 버튼을 통해 시작해보세요!</PageSubtitle>

      <EmptyNotice>
        {completedCount === 0
          ? "아직 진행한 레시피가 없네요!"
          : `${completedCount}끼 챙겨먹기에 성공했어요!`}
      </EmptyNotice>

      <MealTabs>
        {meals.map((meal, idx) => (
          <MealTab key={meal.id} $done={idx < completedCount}>
            {idx + 1}끼
          </MealTab>
        ))}
      </MealTabs>

      <RecipeListHeading>{meals.length}끼 레시피</RecipeListHeading>

      <MealList>
        {meals.map((meal) => (
          <MealRow
            key={meal.id}
            $isNext={meal.id === selectedMealId}
            $completed={meal.completed}
            onClick={() => {
              if (!meal.completed) setSelectedMealId(meal.id);
            }}
          >
            <div className="thumb-box">
              <img className="thumb" src={meal.image} alt={meal.name} />
            </div>
            <div className="info">
              <span className="meal-name">{meal.name}</span>
              <span className="meal-status">
                {meal.completed ? `${meal.status} 완료` : "미완료"}
              </span>
            </div>
            <button
              className="detail-link"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipes/${meal.id}`);
              }}
            >
              상세보기
            </button>
          </MealRow>
        ))}
      </MealList>

      {missingIngredients.length > 0 && (
        <MissingSection>
          <MissingHeading>잠깐만요! 부족한 재료가 있어요</MissingHeading>
          <ChipRow>
            {missingIngredients.map((name) => (
              <MissingChip key={name}>{name}</MissingChip>
            ))}
          </ChipRow>
          <MissingActions>
            <MissingActionButton $variant="bought" onClick={() => setIsBoughtModalOpen(true)}>
              이미 구매했어요
            </MissingActionButton>
            <MissingActionButton $variant="add" onClick={handleAddToShoppingList}>
              장보기 목록에 추가
            </MissingActionButton>
          </MissingActions>
        </MissingSection>
      )}

      {isBoughtModalOpen && (
        <BoughtModalOverlay onClick={() => setIsBoughtModalOpen(false)}>
          <BoughtModalBox onClick={(e) => e.stopPropagation()}>
            <BoughtIconBox>
              <img src={chefIcon} alt="" />
            </BoughtIconBox>
            <BoughtTextBox>
              <BoughtTitle>구매하신 재료를 먼저 등록할까요?</BoughtTitle>
              <BoughtDesc>
                <p>재료를 등록하면 요리가 끝난 후</p>
                <p>자동으로 사용량을 계산해드려요</p>
              </BoughtDesc>
            </BoughtTextBox>
            <BoughtActions>
              <BoughtActionButton
                $variant="cancel"
                onClick={() => setIsBoughtModalOpen(false)}
              >
                취소
              </BoughtActionButton>
              <BoughtActionButton $variant="confirm" onClick={handleRegisterIngredients}>
                등록하기
              </BoughtActionButton>
            </BoughtActions>
          </BoughtModalBox>
        </BoughtModalOverlay>
      )}

      {isStopModalOpen && (
        <BoughtModalOverlay onClick={() => setIsStopModalOpen(false)}>
          <BoughtModalBox onClick={(e) => e.stopPropagation()}>
            <BoughtIconBox>
              <img src={forkKnifeIcon} alt="" />
            </BoughtIconBox>
            <BoughtTextBox>
              <BoughtTitle>진행 중인 식단을 중단할까요?</BoughtTitle>
              <BoughtDesc>
                <p>식단을 완료하면</p>
                <p>루틴 리포트를 제공해드려요!</p>
              </BoughtDesc>
            </BoughtTextBox>
            <BoughtActions>
              <BoughtActionButton
                $variant="cancel"
                onClick={() => setIsStopModalOpen(false)}
              >
                취소
              </BoughtActionButton>
              <BoughtActionButton $variant="confirm" onClick={handleStopDiet}>
                중단하기
              </BoughtActionButton>
            </BoughtActions>
          </BoughtModalBox>
        </BoughtModalOverlay>
      )}

      {isToastVisible && (
        <Toast>
          <img src={checkCircleWhiteIcon} alt="" />
          <span>{toastMessage}</span>
        </Toast>
      )}

      <BottomFixedButton variant="inline" onClick={() => navigate(`/cooking/${selectedMealId}`)}>
        식단 시작하기
      </BottomFixedButton>
    </PageContainer>
  );
}