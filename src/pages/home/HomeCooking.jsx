import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import checkCircleIcon from "../../assets/icons/CheckCircle.svg";
import micIcon from "../../assets/icons/Mic.svg";
import clockIcon from "../../assets/icons/Clock.svg";
import chevronUpIcon from "../../assets/icons/ChevronUp.svg";
import chevronDownIcon from "../../assets/icons/ChevronDown.svg";
import { DUMMY_DISHES } from "../../constants/home/DummyHome.js";

const TUTORIAL_STORAGE_KEY = "hasSeenCookingTutorial";

const PageContainer = styled.div`
background: #f5f5f6;
max-width: 390px;
margin: 0 auto;
min-height: 100vh;
position: relative;
overflow: hidden;
`;

const GlassButton = styled.button`
position: absolute;
top: 43px;
width: 48px;
height: 48px;
border-radius: 1000px;
border: none;
background: rgba(255, 255, 255, 0.75);
box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;

img{
width: 24px;
height: 24px;
}
`;

const DishCard = styled.div`
position: absolute;
left: 50%;
transform: translateX(-50%);
top: 115px;
width: 364px;
height: 141px;
border-radius: 28px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05);
display: flex;
align-items: center;
gap: 20px;
padding: 0 20px;

.thumb{
width: 107px;
height: 108px;
border-radius: 50%;
object-fit: cover;
box-shadow: 0px 0px 10px 0px rgba(61, 32, 0, 0.05), 0px 0px 40px 0px rgba(110, 58, 0, 0.13);
}

.dish-name{
color: #030303;
font-size: 22px;
font-family: Pretendard Variable;
font-weight: 700;
}

.dish-time{
margin-top: 8px;
color: #444;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 500;
}
`;

const ChecklistCard = styled.div`
position: absolute;
left: 50%;
transform: translateX(-50%);
top: 290px;
width: 364px;
border-radius: 28px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05);
padding: 33px 26px 33px;

.title-row{
display: flex;
align-items: center;
gap: 8px;
}

.title{
color: #000;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
}

.check-icon{
width: 30px;
height: 30px;
}

.tip{
margin-top: 30px;
color: #000;
font-size: 22px;
font-family: Pretendard Variable;
font-weight: 500;
line-height: 1.3;
letter-spacing: -0.44px;
}
`;

const NextStepCard = styled.div`
position: absolute;
left: 13px;
top: 619px;
width: 364px;
height: 96px;
border-radius: 26px;
background: white;
display: flex;
align-items: center;
padding: 0 28px;
cursor: pointer;

.label{
color: #000;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 500;
}
`;

const BottomBar = styled.div`
position: absolute;
left: 13px;
top: 727px;
width: 364px;
height: 60px;
border-radius: 20px;
background: white;
`;

const TutorialOverlay = styled.div`
position: absolute;
inset: 0;
background: rgba(7, 7, 7, 0.67);
z-index: 200;
cursor: pointer;

.hint{
position: absolute;
left: 50%;
transform: translateX(-50%);
color: white;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
text-align: center;
white-space: nowrap;
}

.hint-down{
top: 244px;
}
.hint-down-voice{
top: 281px;
}
.hint-up{
top: 554px;
}
.hint-up-voice{
top: 589px;
}

.chevron-down-wrap{
position: absolute;
left: 50%;
transform: translateX(-50%);
top: 168px;
display: flex;
flex-direction: column;
align-items: center;
}

.chevron-up-wrap{
position: absolute;
left: 50%;
transform: translateX(-50%);
top: 635px;
}
`;

export default function HomeCooking() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [showTutorial, setShowTutorial] = useState(
    () => localStorage.getItem(TUTORIAL_STORAGE_KEY) !== "true"
  );

  const dismissTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setShowTutorial(false);
  };

  const dish = DUMMY_DISHES[0]; // TODO: mealId 기준으로 실제 조리 단계 데이터 연결

  return (
    <PageContainer>
      <GlassButton style={{ left: 20 }} onClick={() => navigate(-1)}>
        <span style={{ fontSize: 22, color: "#444" }}>‹</span>
      </GlassButton>
      <GlassButton style={{ left: "calc(60% + 32px)" }}>
        <img src={micIcon} alt="음성 명령" />
      </GlassButton>
      <GlassButton style={{ left: "calc(80% + 10px)" }}>
        <img src={clockIcon} alt="타이머 기록" />
      </GlassButton>

      <DishCard>
        <img className="thumb" src={dish.image} alt={dish.name} />
        <div>
          <div className="dish-name">계란 대파 볶음밥</div>
          <div className="dish-time">8분 소요 예정</div>
        </div>
      </DishCard>

      <ChecklistCard>
        <div className="title-row">
          <img className="check-icon" src={checkCircleIcon} alt="" />
          <span className="title">시작 전 확인 목록</span>
        </div>
        <p className="tip">밥이 너무 뜨거우면 그릇에 펼쳐 1~2분 식혀주세요.</p>
        <p className="tip">프라이팬에 물기가 남아 있지 않은지 확인해 주세요.</p>
        <p className="tip">계란을 만진 뒤에는 손을 씻어주세요.</p>
      </ChecklistCard>

      <NextStepCard>
        <span className="label">다음 단계 : 재료 준비</span>
      </NextStepCard>

      <BottomBar />

      {showTutorial && (
        <TutorialOverlay onClick={dismissTutorial}>
          <div className="chevron-down-wrap">
            <img src={chevronUpIcon} alt="" style={{ width: 25, height: 43 }} />
          </div>
          <span className="hint hint-down">화면을 아래로 쓸어내려 전 단계로 이동</span>
          <span className="hint hint-down-voice">또는 음성 실행 후 "전 단계로 이동"</span>

          <span className="hint hint-up-voice">또는 음성 실행 후 "다음 단계로 이동"</span>
          <span className="hint hint-up">화면을 아래로 쓸어올려 다음 단계로 이동</span>
          <div className="chevron-up-wrap">
            <img src={chevronDownIcon} alt="" style={{ width: 43, height: 50 }} />
          </div>
        </TutorialOverlay>
      )}
    </PageContainer>
  );
}