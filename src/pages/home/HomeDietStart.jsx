import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../common/button/BackButton";
import { DUMMY_DIET_PROGRESS } from "../../constants/home/DummyHome.js";
import checkIcon from "../../assets/icons/check2.svg";

const PageContainer = styled.div`
background: #fffdfc;
max-width: 390px;
margin: 0 auto;
min-height: 100vh;
padding: 60px 20px 100px;
position: relative;
`;

const Header = styled.div`
display: flex;
align-items: center;
`;

const SectionTitle = styled.div`
margin-top: 24px;
display: flex;
align-items: center;
justify-content: space-between;

.title{
color: #030303;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
}

.toggle-label{
display: flex;
align-items: center;
gap: 6px;
color: #616161;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;
}
`;

const MealTabs = styled.div`
margin-top: 15px;
display: flex;
gap: 10px;
`;

const MealTab = styled.button`
flex: 1;
height: 62px;
border-radius: 10px;
border: ${({ $done }) => ($done ? "3px solid #c2ee73" : "none")};
background: ${({ $done }) => ($done ? "#d6f3a1" : "#f5f5f6")};
color: ${({ $done }) => ($done ? "#444" : "#8b8b8b")};
font-size: 12px;
font-family: Pretendard Variable;
font-weight: ${({ $done }) => ($done ? "700" : "600")};
cursor: pointer;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
padding: 8px 0 0 21px;

.check-icon{
width: 18px;
height: 13px;
}
`;

const ProgressHeader = styled.div`
margin-top: 24px;
display: flex;
align-items: center;
justify-content: space-between;

.title{
color: #030303;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
}

.count{
color: #8b8b8b;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;
}
`;

const MealList = styled.div`
margin-top: 8px;
display: flex;
flex-direction: column;
gap: 4px;
`;

const MealRow = styled.div`
position: relative;
padding: 8px;
border-radius: 10px;
background: ${({ $isNext }) => ($isNext ? "#d6f3a1" : "#ffffff")};
box-shadow: 0px 0px 10px 0px rgba(154, 80, 0, 0.05), 0px 0px 40px 0px rgba(154, 80, 0, 0.08);
border: ${({ $isNext }) => ($isNext ? "3px solid #c2ee73" : "none")};

.row{
display: flex;
align-items: center;
gap: 11px;
}

.thumb-box{
flex-shrink: 0;
width: 46px;
height: 46px;
border-radius: 10px;
background: #f1f1f1;
display: flex;
align-items: center;
justify-content: center;
overflow: hidden;
}

.thumb{
width: 30px;
height: 30px;
border-radius: 50%;
object-fit: cover;
}

.info{
width: 261px;
display: flex;
align-items: center;
justify-content: space-between;
}

.name-wrap{
display: flex;
flex-direction: column;
gap: 4px;
}

.meal-name{
color: #2e2e2e;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 600;
}

.meal-status{
color: ${({ $isNext }) => ($isNext ? "#727272" : "#bebebf")};
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 500;
}

.meal-complete{
color: ${({ $completed, $isNext }) =>
  $completed ? "#72d472" : $isNext ? "#727272" : "#bebebf"};
font-size: 13px;
font-family: Pretendard Variable;
font-weight: 600;
}
`;

const StartButton = styled.button`
position: fixed;
bottom: 24px;
left: 50%;
transform: translateX(-50%);
width: calc(100% - 40px);
max-width: 350px;
height: 48px;
border-radius: 10px;
border: none;
background: #72d271;
box-shadow: 0px 0px 10px 0px rgba(154, 80, 0, 0.05), 0px 0px 40px 0px rgba(154, 80, 0, 0.08);
color: #f5f5f6;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 600;
cursor: pointer;
`;

const MEAL_SLOTS = ["1끼", "2끼", "3끼", "4끼", "5끼"];

export default function HomeDietStart() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const completedCount = DUMMY_DIET_PROGRESS.filter((m) => m.completed).length;
  const nextMealId = DUMMY_DIET_PROGRESS.find((m) => !m.completed)?.id;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)} />
      </Header>

      <SectionTitle>
        <span className="title">진행중인 식단</span>
        <span className="toggle-label">식단 토글</span>
      </SectionTitle>

      <MealTabs>
          {MEAL_SLOTS.map((slot, idx) => (
    <MealTab key={slot} $done={idx < completedCount}>
      {slot}
      {idx < completedCount && (
        <img className="check-icon" src={checkIcon} alt="" />
      )}
    </MealTab>
   ))}
      </MealTabs>

      <ProgressHeader>
        <span className="title">진행 상황</span>
        <span className="count">{completedCount}/5끼 완료</span>
      </ProgressHeader>

      <MealList>
        {DUMMY_DIET_PROGRESS.map((meal) => (
              <MealRow
      key={meal.id}
      $isNext={meal.id === nextMealId}
      $completed={meal.completed}
    >
            <div className="row">
              <div className="thumb-box">
                <img className="thumb" src={meal.image} alt={meal.name} />
              </div>
              <div className="info">
                <div className="name-wrap">
                  <span className="meal-name">{meal.name}</span>
                  <span className="meal-status">{meal.status}</span>
                </div>
                <span className="meal-complete">
                  {meal.completed ? "완료" : "미완료"}
                </span>
              </div>
            </div>
          </MealRow>
        ))}
      </MealList>

      <StartButton onClick={() => navigate(`/cooking/${mealId}`)}>
        요리 시작하기
      </StartButton>
    </PageContainer>
  );
}