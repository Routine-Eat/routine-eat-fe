import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../common/button/BackButton";
import faceGoodIcon from "../../assets/icons/faceGood.svg";
import faceNeutralIcon from "../../assets/icons/faceNeutral.svg";
import faceBadIcon from "../../assets/icons/faceBad.svg";
import BottomFixedButton from "../../common/button/BottomFixedButton";

const PageContainer = styled.div`
  background: #fffefd;
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 24px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  width: 100%;

  .back-button-wrap {
    position: absolute;
    left: 0;
  }
`;

const Question = styled.p`
  margin: 170px 0 0;
  color: #030303;
  font-size: 22px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.44px;
  text-align: center;
`;

const OptionList = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 350px;
`;

const OptionButton = styled.button`
  height: 76px;
  border-radius: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${({ $selected }) => ($selected ? "#d6f3a1" : "white")};
  border: ${({ $selected }) => ($selected ? "3px solid #c2ee73" : "1px solid #d9d9da")};
  box-shadow: ${({ $selected }) =>
    $selected
      ? "0px 0px 15px 0px rgba(3, 3, 3, 0.05), 0px 0px 4px 0px rgba(3, 3, 3, 0.05)"
      : "none"};

  img {
    width: 32px;
    height: 32px;
    display: block;
  }

  .label {
    color: #030303;
    font-size: 18px;
    font-family: Wanted Sans Variable;
    font-weight: 600;
  }
`;

const OPTIONS = [
  { id: "good", icon: faceGoodIcon, label: "쉬웠어요" },
  { id: "ok", icon: faceNeutralIcon, label: "보통이었어요" },
  { id: "bad", icon: faceBadIcon, label: "어려웠어요" },
];

export default function CookingReview() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [selected, setSelected] = useState(null);

  return (
    <PageContainer>
      <TopRow>
        <BackButton className="back-button-wrap" onClick={() => navigate(-1)} />
      </TopRow>

            <Question>이 레시피, 난이도는 어땠나요?</Question>

      <OptionList>
        {OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            $selected={selected === option.id}
            onClick={() => setSelected(option.id)}
          >
            <img src={option.icon} alt="" />
            <span className="label">{option.label}</span>
          </OptionButton>
        ))}
      </OptionList>
            <BottomFixedButton onClick={() => navigate(`/cooking/${mealId}/review/ingredients`)}>
        완료
      </BottomFixedButton>
    </PageContainer>
  );
}