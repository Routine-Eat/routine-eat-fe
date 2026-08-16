import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import backArrowIcon from "../../assets/icons/backArrow.svg";
import BottomNextButton from "../../common/button/BottomNextButton";

const PageContainer = styled.div`
background: #e4e4e4;
max-width: 390px;
margin: 0 auto;
min-height: 100vh;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
padding: 45px 20px 24px;
`;

const TopRow = styled.div`
display: flex;
align-items: center;
position: relative;
justify-content: center;
width: 100%;
`;

const BackArrow = styled.button`
width: 18px;
height: 36px;
border: none;
background: none;
padding: 0;
cursor: pointer;
position: absolute;
left: 0;
display: flex;
align-items: center;
justify-content: center;

img{
width: 11px;
height: 19px;
}
`;

const ProgressBar = styled.div`
display: flex;
gap: 9px;
`;

const ProgressSegment = styled.div`
width: 63px;
height: 4px;
background: ${({ $active }) => ($active ? "#616161" : "#b8b8b8")};
`;

const Question = styled.p`
margin: 96px 0 0;
color: #000;
font-size: 24px;
font-family: Pretendard Variable;
font-weight: 600;
line-height: 1.48;
text-align: center;
`;

const OptionList = styled.div`
margin-top: 60px;
display: flex;
flex-direction: column;
gap: 13px;
width: 100%;
max-width: 341px;
margin-left: auto;
margin-right: auto;
`;

const OptionButton = styled.button`
height: 76px;
border-radius: 50px;
border: none;
background: ${({ $selected }) => ($selected ? "#6ec280" : "white")};
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06), 0px 0px 50px 0px rgba(0, 0, 0, 0.05);
display: flex;
align-items: center;
justify-content: center;
gap: 6px;
cursor: pointer;

.emoji{
font-size: 24px;
}

.label{
color: #000;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 500;
}
`;

const OPTIONS = [
  { id: "good", emoji: "😃", label: "맛있어요" },
  { id: "ok", emoji: "🙂", label: "적당했어요" },
  { id: "bad", emoji: "😑", label: "별로예요" },
];

export default function CookingReview() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [selected, setSelected] = useState(null);

  return (
    <PageContainer>
      <TopRow>
        <BackArrow onClick={() => navigate(-1)}>
          <img src={backArrowIcon} alt="뒤로가기" />
        </BackArrow>
        <ProgressBar>
          <ProgressSegment $active />
          <ProgressSegment />
          <ProgressSegment />
        </ProgressBar>
      </TopRow>

      <Question>맛은 어땠나요?</Question>

      <OptionList>
        {OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            $selected={selected === option.id}
            onClick={() => setSelected(option.id)}
          >
            <span className="emoji">{option.emoji}</span>
            <span className="label">{option.label}</span>
          </OptionButton>
        ))}
      </OptionList>

      <BottomNextButton onClick={() => navigate(`/cooking/${mealId}/review/2`)} />
    </PageContainer>
  );
}