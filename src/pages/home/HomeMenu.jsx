import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import starFilledIcon from "../../assets/icons/StarFilled.svg";
import { DUMMY_DISHES } from "../../constants/home/DummyHome.js";
import BackButton from "../../common/button/BackButton";

const PageContainer = styled.div`
background: #fffdfc;
max-width: 390px;
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

const RecipeList = styled.div`
display: flex;
flex-direction: column;
gap: 16px;
margin-top: 16px;
`;

const RecipeCard = styled.div`
display: flex;
align-items: center;
gap: 15px;
height: 124px;
padding: 13px 15px;
border-radius: 20px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(72, 28, 0, 0.05), 0px 0px 30px 0px rgba(72, 28, 0, 0.06);

.thumb-box{
flex-shrink: 0;
width: 99px;
height: 99px;
border-radius: 18px;
background: #f1f1f1;
display: flex;
align-items: center;
justify-content: center;
overflow: hidden;
}

.thumb{
width: 73px;
height: 74px;
border-radius: 50%;
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
font-size: 13px;
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
font-size: 13px;
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
font-size: 13px;
font-family: Pretendard Variable;
font-weight: 500;
}

.star{
width: 15px;
height: 15px;
}
}
`;

const StartButton = styled.button`
position: fixed;
bottom: 24px;
left: 50%;
transform: translateX(-50%);
width: calc(100% - 48px);
max-width: 342px;
height: 48px;
border-radius: 10px;
border: none;
background: #72d472;
box-shadow: 0px 0px 8px 0px rgba(3, 3, 3, 0.05), 0px 0px 30px 0px rgba(3, 3, 3, 0.05);
color: white;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
cursor: pointer;
`;

export default function HomeMenu() {
  const navigate = useNavigate();
  const { mealId } = useParams();

  return (
    <PageContainer>
      <Header>
        <BackButton className="back-button" onClick={() => navigate(-1)} />
      </Header>

      <RecipeList>
        {DUMMY_DISHES.map((recipe) => (
          <RecipeCard key={recipe.id}>
            <div className="thumb-box">
              <img className="thumb" src={recipe.image} alt={recipe.name} />
            </div>
            <div className="info">
              <div className="recipe-name">{recipe.name}</div>
              <div className="recipe-meta">
                <span className="time">{recipe.time}</span>
                <span className="no-extra">추가 재료 구매 X</span>
              </div>
              <div className="recipe-cost">{recipe.cost}</div>
              <div className="recipe-difficulty">
                <span className="label">난이도</span>
                {Array.from({ length: recipe.difficulty }).map((_, idx) => (
                  <img key={idx} className="star" src={starFilledIcon} alt="" />
                ))}
              </div>
            </div>
          </RecipeCard>
        ))}
      </RecipeList>

            <StartButton onClick={() => navigate(`/diet-start/${mealId}`)}>
        식단 시작하기
      </StartButton>
    </PageContainer>
  );
}