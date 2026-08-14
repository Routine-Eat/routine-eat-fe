import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import micIcon from "../../assets/icons/mic2.svg";
import stopwatchIcon from "../../assets/icons/stopwatch.svg";
import BackButton from "../../common/button/BackButton";
import checkCircleIcon from "../../assets/icons/checkcircle.svg";
import { DUMMY_COOKING_STEPS } from "../../constants/home/DummyHome.js";
import chevronDoubleIcon from "../../assets/icons/chevronDouble.svg";
import styled, { keyframes } from "styled-components";
import chevronNavIcon from "../../assets/icons/chevronNavIcon.svg";
import forkKnifeImg from "../../assets/images/forkKnife.svg";
import chevronRightIcon from "../../assets/icons/chevronRight.svg";

const STEP_TUTORIAL_KEY = "hasSeenStepTutorial";

const PageContainer = styled.div`
background: #444;
max-width: 390px;
margin: 0 auto;
min-height: 100vh;
position: relative;
padding-bottom: 60px;
`;

const TopBar = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 56px 20px 0;
`;

const MicCircle = styled.button`
width: 48px;
height: 48px;
border-radius: 1000px;
border: 0.5px solid #ffeca0;
background: #444;
box-shadow: inset 0px 0px 3.4px 0px white;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;

img{
width: 48px;
height: 48px;
}
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-28px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CardStack = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 8px;
padding-top: ${({ $hasUpHint }) => ($hasUpHint ? "0px" : "76px")};
`;

const StepCard = styled.div`
width: 366px;
border-radius: 28px;
background: white;
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05);
padding: 24px 28px 32px;
animation: ${({ $direction }) => ($direction === "prev" ? slideDown : slideUp)} 0.28s ease;

.step-count{
text-align: right;
color: #5a5a5b;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 500;
letter-spacing: -0.14px;
}

.title-row{
display: flex;
align-items: center;
gap: 8px;
}

.check-icon{
width: 30px;
height: 30px;
}

.title{
color: #2e2e2e;
font-size: 22px;
font-family: Pretendard Variable;
font-weight: 700;
letter-spacing: -0.44px;
}

.body{
margin-top: 20px;
color: #2e2e2e;
font-size: 20px;
font-family: Pretendard Variable;
font-weight: 600;
line-height: 1.41;
}

.link{
display: block;
margin-top: 8px;
color: #3eb745;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
text-decoration: underline;
letter-spacing: -0.16px;
}

.ingredient-tags{
margin-top: 20px;
display: flex;
gap: 4px;
}

.tag{
padding: 4px 8px;
border: 0.5px solid #8b8b8b;
border-radius: 4px;
background: white;
color: #2e2e2e;
font-size: 12px;
font-family: Pretendard Variable;
font-weight: 600;
letter-spacing: -0.24px;
white-space: nowrap;
}
`;

const PreviewCard = styled.div`
width: 366px;
height: 60px;
border-radius: 20px;
background: ${({ $level }) => ($level === 1 ? "#d9d9da" : "#bebebf")};
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05);
display: flex;
align-items: center;
padding: 0 28px;
gap: 12px;

.count{
color: #2e2e2e;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 500;
letter-spacing: -0.14px;
}

.label{
color: #2e2e2e;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
}
`;

const CompleteButton = styled.button`
width: 366px;
height: 60px;
border-radius: 20px;
background: #d6f3a1;
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05), inset 0px 0px 9px 0px white;
border: none;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 20px;
cursor: pointer;

.left{
display: flex;
align-items: center;
gap: 8px;
}

.icon{
width: 27px;
height: 27px;
}

.label{
color: #2c0500;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 600;
}

.arrow{
width: 20px;
height: 20px;
}
`;


const TimerBar = styled.div`
position: fixed;
bottom: 24px;
left: 50%;
transform: translateX(-50%);
width: 366px;
height: 60px;
border-radius: 20px;
background: #ffeca0;
box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05), inset 0px 0px 9px 0px white;
display: flex;
align-items: center;
gap: 16px;
padding: 0 16px 0 20px;

.stopwatch-icon{
width: 32px;
height: 32px;
}

.time{
color: #481c00;
font-size: 22px;
font-family: Pretendard Variable;
font-weight: 600;
}

.btn{
width: 60px;
height: 40px;
border-radius: 8px;
border: none;
background: white;
box-shadow: 0px 0px 10px 0px rgba(46, 46, 46, 0.05), 0px 0px 3px 0px rgba(26, 26, 26, 0.1);
color: #2e2e2e;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
cursor: pointer;
}
`;

const TutorialOverlay = styled.div`
position: absolute;
inset: 0;
background: rgba(0, 0, 0, 0.55);
z-index: 200;
cursor: pointer;

.hint-block{
position: absolute;
left: 50%;
transform: translateX(-50%);
width: 320px;
color: white;
text-align: center;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 600;
line-height: 1.2;
display: flex;
flex-direction: column;
gap: 4px;

p{
margin: 0;
}
}

.hint-top{
top: 226px;
}

.hint-bottom{
top: 560px;
}
`;

const ChevronStack = styled.div`
position: absolute;
left: 50%;
transform: translateX(-50%);
display: flex;
flex-direction: column;
align-items: center;
gap: 0px;
top: ${({ $top }) => $top}px;

img{
display: block;
width: 43px;
height: auto;
${({ $direction }) => $direction === "down" && "transform: rotate(180deg);"}
}
`;

const NavHint = styled.div`
display: flex;
justify-content: center;
padding: 8px 0;

img{
display: block;
width: 28px;
height: auto;
opacity: 0.7;
${({ $direction }) => $direction === "down" && "transform: rotate(180deg);"}
}
`;

export default function HomeCookingStep() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [showTutorial, setShowTutorial] = useState(
    () => localStorage.getItem(STEP_TUTORIAL_KEY) !== "true"
  );
 const currentStep = DUMMY_COOKING_STEPS[currentStepIndex];
 const isFirstStep = currentStepIndex === 0;
 const isLastStep = currentStepIndex === DUMMY_COOKING_STEPS.length - 1;

  const justMountedRef = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      justMountedRef.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const dismissTutorial = () => {
    localStorage.setItem(STEP_TUTORIAL_KEY, "true");
    setShowTutorial(false);
  };

  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const actionLock = useRef(false);

  const lockAndRun = (action) => {
    if (actionLock.current) return;
    actionLock.current = true;
    action();
    setTimeout(() => {
      actionLock.current = false;
    }, 500);
  };

  const handleGoBackStep = () => {
    setDirection("prev");
    if (isFirstStep) {
      navigate(-1);
    } else {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleGoNextStep = () => {
    setDirection("next");
    if (isLastStep) {
      navigate(`/cooking/${mealId}/complete`);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (justMountedRef.current) return;
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (deltaY < -120) {
        if (showTutorial) dismissTutorial();
      lockAndRun(handleGoBackStep);
          } else if (deltaY > 120) {
            if (isLastStep) { touchStartY.current = null; return; }
            if (showTutorial) dismissTutorial();
      lockAndRun(handleGoNextStep);
    }
    touchStartY.current = null;
  };

  const handleMouseDown = (e) => {
    touchStartY.current = e.clientY;
    isDragging.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUpGlobal);
  };

  const handleMouseMove = (e) => {
    if (justMountedRef.current) return;
    if (!isDragging.current || touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.clientY;
    if (deltaY < -120) {
      isDragging.current = false;
      touchStartY.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
      if (showTutorial) dismissTutorial();
      lockAndRun(handleGoBackStep);
          } else if (deltaY > 120) {
                  if (isLastStep) {
        isDragging.current = false;
        touchStartY.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUpGlobal);
        return;
      }
      isDragging.current = false;
      touchStartY.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
      if (showTutorial) dismissTutorial();
      lockAndRun(handleGoNextStep);
    }
  };

  const handleMouseUpGlobal = () => {
    isDragging.current = false;
    touchStartY.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUpGlobal);
  };

  const handleWheel = (e) => {
    if (justMountedRef.current) return;
        if (e.deltaY < -60) {
            if (showTutorial) dismissTutorial();
      lockAndRun(handleGoBackStep);
    } else if (e.deltaY > 60) {
        if (isLastStep) return;
        if (showTutorial) dismissTutorial();
      lockAndRun(handleGoNextStep);
    }
  };

  const totalSteps = DUMMY_COOKING_STEPS.length;
  let windowStart = currentStepIndex - 1;
  if (windowStart < 0) windowStart = 0;
  if (windowStart + 3 > totalSteps) windowStart = Math.max(0, totalSteps - 3);
  const windowEnd = Math.min(windowStart + 3, totalSteps);
  const visibleIndices = [];
  for (let i = windowStart; i < windowEnd; i++) visibleIndices.push(i);

  const pagesBefore = currentStepIndex;
  const pagesAfter = totalSteps - 1 - currentStepIndex;
  const showUpHint = pagesBefore >= 2;
  const showDownHint = pagesAfter >= 2;


  return (
    <PageContainer
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  onMouseDown={handleMouseDown}
  onWheel={handleWheel}
>
      <TopBar>
        <BackButton onClick={() => navigate(-1)} />
        <MicCircle>
          <img src={micIcon} alt="음성인식" />
        </MicCircle>
      </TopBar>
            {showUpHint && (
        <NavHint $direction="up">
          <img src={chevronNavIcon} alt="" />
        </NavHint>
      )}

            <CardStack $hasUpHint={showUpHint}>
        {visibleIndices.map((idx) => {
          if (idx === currentStepIndex) {
            const step = DUMMY_COOKING_STEPS[idx];
            return (
              <StepCard key={idx} $direction={direction}>
                <div className="step-count">{idx + 1}/{totalSteps}</div>
                <div className="title-row">
                  <img className="check-icon" src={checkCircleIcon} alt="" />
                  <span className="title">{step.title}</span>
                </div>
                <div className="body">
                  {step.body.map((line, i) => (
                    <p key={i} style={{ margin: 0 }}>{line}</p>
                  ))}
                </div>
                {step.link1 && <a className="link" href="#!">{step.link1}</a>}
                {step.body2 && <p className="body" style={{ marginTop: 20 }}>{step.body2}</p>}
                {step.link2 && <a className="link" href="#!">{step.link2}</a>}
                <div className="ingredient-tags">
                  {step.ingredients.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </StepCard>
            );
          }
          const distance = Math.abs(idx - currentStepIndex);
          return (
            <PreviewCard key={idx} $level={distance === 1 ? 1 : 2}>
              <span className="count">{idx + 1}/{totalSteps}</span>
              <span className="label">{DUMMY_COOKING_STEPS[idx].title}</span>
            </PreviewCard>
          );
        })}
                {isLastStep && (
          <CompleteButton onClick={() => navigate(`/cooking/${mealId}/complete`)}>
            <span className="left">
              <img className="icon" src={forkKnifeImg} alt="" />
              <span className="label">레시피 완료하기</span>
            </span>
            <img className="arrow" src={chevronRightIcon} alt="" />
          </CompleteButton>
        )}
      </CardStack>

            {showDownHint && (
        <NavHint $direction="down">
          <img src={chevronNavIcon} alt="" />
        </NavHint>
      )}

      <TimerBar>
        <img className="stopwatch-icon" src={stopwatchIcon} alt="" />
        <span className="time">01분 10초</span>
        <button className="btn">수정</button>
        <button className="btn">시작</button>
      </TimerBar>

      {showTutorial && (
        <TutorialOverlay onClick={dismissTutorial}>
                      <ChevronStack $top={162} $direction="up">
            <img src={chevronDoubleIcon} alt="" />
            <img src={chevronDoubleIcon} alt="" />
          </ChevronStack>
          <div className="hint-block hint-top">
            <p>화면을 아래로 쓸어내려 전 단계로 이동</p>
            <p>또는 음성 실행 후 "전 단계로 이동"</p>
          </div>
          <div className="hint-block hint-bottom">
            <p>화면을 아래로 쓸어올려 다음 단계로 이동</p>
            <p>또는 음성 실행 후 "다음 단계로 이동"</p>
          </div>
                    <ChevronStack $top={630} $direction="down">
            <img src={chevronDoubleIcon} alt="" />
            <img src={chevronDoubleIcon} alt="" />
          </ChevronStack>
        </TutorialOverlay>
      )}
    </PageContainer>
  );
}