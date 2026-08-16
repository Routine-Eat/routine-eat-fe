import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_DIET_PROGRESS, THEME_CARDS, MISSING_INGREDIENTS } from "../../constants/home/DummyHome.js";
import muscleIcon from "../../assets/icons/muscle.svg";
import BottomFixedButton from "../../common/button/BottomFixedButton";

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
  margin-top: 32px;
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
  margin: 8px 0 0;
  color: #444;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.32px;
`;

const MealList = styled.div`
  margin-top: 16px;
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
  background: ${({ $isNext }) => ($isNext ? "#d6f3a1" : "#ffffff")};
  border: ${({ $isNext }) => ($isNext ? "2px solid #c2ee73" : "none")};
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
    color: ${({ $isNext }) => ($isNext ? "#006000" : "#bebebf")};
    font-size: 15px;
    font-family: Wanted Sans Variable;
    font-weight: 500;
    letter-spacing: -0.15px;
  }

  .detail-link {
    flex-shrink: 0;
    color: ${({ $isNext }) => ($isNext ? "#5a5a5b" : "#8b8b8b")};
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

export default function HomeDietStart() {
  const navigate = useNavigate();
  const { mealId } = useParams();

  const theme = THEME_CARDS.find((t) => t.id === mealId) || THEME_CARDS[0];
  const meals = DUMMY_DIET_PROGRESS.slice(0, 3);
  const completedCount = meals.filter((m) => m.completed).length;
  const nextMealId = meals.find((m) => !m.completed)?.id;
  const missingIngredients = MISSING_INGREDIENTS;

  const handleAddToShoppingList = () => {
    navigate("/shopping-list");
  };

  return (
    <PageContainer>
      <StopLink onClick={() => navigate("/")}>식단 중단하기 &gt;</StopLink>

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
            <EmptyNotice>
        {completedCount === 0
          ? "아직 진행한 레시피가 없네요!"
          : `${completedCount}끼 챙겨먹기에 성공했어!`}
      </EmptyNotice>

      <MealList>
        {meals.map((meal) => (
          <MealRow key={meal.id} $isNext={meal.id === nextMealId}>
            <div className="thumb-box">
              <img className="thumb" src={meal.image} alt={meal.name} />
            </div>
            <div className="info">
              <span className="meal-name">{meal.name}</span>
              <span className="meal-status">{meal.completed ? "완료" : "미완료"}</span>
            </div>
            <button
              className="detail-link"
              onClick={() => navigate(`/recipes/${meal.id}`)}
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
            <MissingActionButton $variant="bought">
              이미 구매했어요
            </MissingActionButton>
            <MissingActionButton $variant="add" onClick={handleAddToShoppingList}>
              장보기 목록에 추가
            </MissingActionButton>
          </MissingActions>
        </MissingSection>
      )}

            <BottomFixedButton variant="inline" onClick={() => navigate(`/cooking/${mealId}`)}>
        식단 시작하기
      </BottomFixedButton>
    </PageContainer>
  );
}