import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import micIcon from "../../assets/icons/mic2.svg";
import BackButton from "../../common/button/BackButton";
import checkCircleIcon from "../../assets/icons/checkcircle.svg";
import { DUMMY_COOKING_STEPS } from "../../constants/home/DummyHome.js";
import styled, { keyframes } from "styled-components";
import chevronNavIcon from "../../assets/icons/chevronNavIcon.svg";
import forkKnifeImg from "../../assets/images/forkKnife.svg";
import chevronRightIcon from "../../assets/icons/chevronRight.svg";
import chevronsUpIcon from "../../assets/icons/chevronsUp.svg";
import chevronLeftSmallIcon from "../../assets/icons/chevronLeftSmall.svg";
import chevronToggleSmallIcon from "../../assets/icons/chevronToggleSmall.svg";
import squidExampleImg from "../../assets/images/squidExample.svg";
import micMoveIcon from "../../assets/icons/micMove.svg";
import { VOICE_HISTORY } from "../../constants/home/DummyHome.js";

const SWIPE_TUTORIAL_KEY = "hasSeenStepTutorial";
const VOICE_TUTORIAL_KEY = "hasSeenVoiceTutorial";

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

const MicGroup = styled.div`
display: flex;
align-items: center;
gap: 12px;
`;

const HistoryOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 300;
`;

const HistoryBox = styled.div`
  width: 100%;
  max-width: 372px;
  max-height: 80vh;
  margin-bottom: 20px;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.12), 0px 0px 40px 0px rgba(3, 3, 3, 0.25);
  position: relative;
  box-sizing: border-box;
    overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HistoryScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  padding: 48px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HistoryHandle = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
  touch-action: none;
    display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  background: transparent;
  border: none;
  &::after {
    content: "";
    width: 48px;
    height: 4px;
    border-radius: 34px;
    background: #d9d9da;
    display: block;
  }
`;

const HistoryScrollFade = styled.div`
position: absolute;
  left: 0;
    right: 0;
  bottom: 0;
  width: 100%;
  height: 105px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, white 100%);
  pointer-events: none;
`;

const HistoryTurn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryQuestion = styled.div`
  align-self: flex-end;
  max-width: 227px;
  background: #f5f5f6;
  border-radius: 12px;
  padding: 12px;
  color: #444;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  line-height: 1.4;
  text-align: right;
`;

const HistoryAnswer = styled.div`
  color: #444;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.14px;

  p {
    margin: 0 0 4px;
  }

  strong {
    font-weight: 700;
  }
`;

const VoiceWaveIcon = styled.img`
width: 80px;
height: 32px;
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
font-weight: 500;
line-height: 1.41;

strong{
font-weight: 700;
}

.segmented{
font-size: 18px;
line-height: 1.4;
}
}

.tip{
margin-top: 4px;
color: #adadad;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 500;
line-height: 1.7;
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
background: none;
border: none;
outline: none;
cursor: pointer;
padding: 0;
text-align: left;
width: fit-content;
-webkit-appearance: none;
appearance: none;
}

.ingredient-tags{
margin-top: 20px;
display: flex;
gap: 4px;
flex-wrap: wrap;
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

.detail-label{
width: 100%;
text-align: right;
color: #2e2e2e;
font-size: 14px;
font-family: Pretendard Variable;
font-weight: 500;
letter-spacing: -0.14px;
}

.detail-back{
display: flex;
align-items: center;
gap: 8px;
margin-top: 8px;
background: none;
border: none;
cursor: pointer;
padding: 0;
color: #2e2e2e;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 600;
letter-spacing: -0.32px;

img{
width: 6px;
height: 11px;
}
}

.detail-section{
margin-top: 24px;
}

.detail-title{
margin: 0;
color: #2e2e2e;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 500;
}

.detail-body{
margin: 4px 0 0;
color: #2e2e2e;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 500;
line-height: 1.5;

strong{
font-weight: 700;
}
}

.detail-note{
margin: 4px 0 0;
color: #2e2e2e;
font-size: 18px;
font-family: Pretendard Variable;
font-weight: 500;
}

.example-toggle{
display: flex;
align-items: center;
gap: 8px;
margin-top: 24px;
background: none;
border: none;
cursor: pointer;
padding: 0;
color: #adadad;
font-size: 16px;
font-family: Pretendard Variable;
font-weight: 500;
letter-spacing: -0.32px;

.toggle-icon{
width: 10px;
height: 6px;
transition: transform 0.2s ease;
transform: rotate(180deg);
}

.toggle-icon.open{
transform: rotate(0deg);
}
}

.example-image{
margin-top: 12px;
width: 200px;
height: 200px;
border-radius: 20px;
object-fit: cover;
display: block;
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

const TutorialOverlay = styled.div`
position: absolute;
inset: 0;
background: linear-gradient(180deg, rgba(80, 80, 80, 0.82) 0%, rgba(25, 25, 25, 0.95) 100%);
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
top: 370px;
}

.hint-bottom{
top: 500px;
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
width: 62px;
height: 62px;
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

const VoiceTutorialOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(80, 80, 80, 0.82) 0%, rgba(25, 25, 25, 0.95) 100%);
  z-index: 200;
  cursor: pointer;
`;

const glowPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.12); opacity: 1; }
`;

const VoiceGlowWrap = styled.div`
  position: absolute;
  top: -20px;
  right: -56px;
  width: 200px;
  height: 200px;
  pointer-events: none;
    border-radius: 50%;
  background:
    radial-gradient(
      circle,
      rgba(255, 243, 196, 0.75) 0%,
      rgba(255, 243, 196, 0.25) 55%,
      rgba(255, 243, 196, 0) 100%
    );

animation: ${glowPulse} 2s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background:
      radial-gradient(
        circle,
        rgba(255, 233, 168, 0.5) 0%,
        rgba(255, 233, 168, 0.15) 60%,
        rgba(255, 233, 168, 0) 100%
      );
  }
`;

const HighlightMic = styled.div`
  position: absolute;
  top: 56px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 1000px;
  border: 0.5px solid #ffeca0;
  background: #444;
  box-shadow: inset 0px 0px 3.4px 0px white, 0 0 20px rgba(255, 236, 160, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  img {
    width: 34px;
    height: 34px;
  }
`;

const VoiceHintText = styled.div`
  position: absolute;
  top: 66px;
  right: 78px;
  text-align: right;
  color: #f5f5f6;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  line-height: 1.2;

  p {
    margin: 0;
  }
`;

const VoiceCapabilities = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;

  .heading {
    color: white;
    font-size: 18px;
    font-family: Wanted Sans Variable;
    font-weight: 600;
    text-align: center;
    margin: 0 0 44px;
    white-space: nowrap;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-left: 8px;
  }

  .item-title {
    color: #d6f3a1;
    font-size: 18px;
    font-family: Wanted Sans Variable;
    font-weight: 600;
    margin: 0;
  }

  .item-desc {
    color: white;
    font-size: 18px;
    font-family: Wanted Sans Variable;
    font-weight: 500;
    margin: 4px 0 0;
  }
`;

const CompleteModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
`;

const CompleteModalBox = styled.div`
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

const CompleteIconBox = styled.div`
  width: 40px;
  height: 40px;

  img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const CompleteTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const CompleteTitle = styled.p`
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  line-height: 1.3;
`;

const CompleteDesc = styled.div`
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

const CompleteActions = styled.div`
  display: flex;
  gap: 8px;
`;

const CompleteActionButton = styled.button`
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

export default function HomeCookingStep() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState("next");
    const [detailStepKey, setDetailStepKey] = useState(null);
  const [isExampleImageOpen, setIsExampleImageOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const longPressTimerRef = useRef(null);
  const longPressFiredRef = useRef(false);
    const [historyHeight, setHistoryHeight] = useState(null); // null이면 기본(80vh)
  const dragStartYRef = useRef(null);
  const dragStartHeightRef = useRef(null);
  const [isHistoryDragging, setIsHistoryDragging] = useState(false);
    const historyBoxRef = useRef(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const checkHasMoreBelow = () => {
    const el = historyBoxRef.current;
    if (!el) return;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    setHasMoreBelow(remaining > 4);
  };

  useEffect(() => {
    if (isHistoryOpen) {
      // 다음 프레임에 실제 렌더된 높이 기준으로 체크
      requestAnimationFrame(checkHasMoreBelow);
    }
  }, [isHistoryOpen, historyHeight]);
  const [tutorialStage, setTutorialStage] = useState(() => {
    if (localStorage.getItem(SWIPE_TUTORIAL_KEY) !== "true") return "swipe";
    if (localStorage.getItem(VOICE_TUTORIAL_KEY) !== "true") return "voice";
    return null;
  });
  const currentStep = DUMMY_COOKING_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === DUMMY_COOKING_STEPS.length - 1;

  const handleMicPressStart = () => {
    longPressFiredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      setHistoryHeight(null);
      setIsHistoryOpen(true);
    }, 500);
  };

  const handleMicPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!longPressFiredRef.current) {
      setIsListening((prev) => !prev);
    }
  };

  const handleMicPressCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

    const HISTORY_MIN_HEIGHT = 240;
  const HISTORY_MAX_HEIGHT = () => window.innerHeight * 0.9;

  const handleHandleDragStart = (clientY) => {
    dragStartYRef.current = clientY;
    const boxEl = document.getElementById("history-box");
    dragStartHeightRef.current = boxEl ? boxEl.getBoundingClientRect().height : window.innerHeight * 0.8;
  };

  const handleHandleDragMove = (clientY) => {
    if (dragStartYRef.current === null) return;
    const deltaY = dragStartYRef.current - clientY; // 위로 끌면 양수 → 커짐
    const nextHeight = dragStartHeightRef.current + deltaY;
    const clamped = Math.min(Math.max(nextHeight, HISTORY_MIN_HEIGHT), HISTORY_MAX_HEIGHT());
    setHistoryHeight(clamped);
    requestAnimationFrame(checkHasMoreBelow);
  };

  const handleHandleDragEnd = () => {
    dragStartYRef.current = null;
    dragStartHeightRef.current = null;
    setIsHistoryDragging(false);
  };

  const handleHandlePointerDown = (e) => {
    e.preventDefault();
    setIsHistoryDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    handleHandleDragStart(clientY);
    const onMove = (ev) => {
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      handleHandleDragMove(y);
    };
    const onUp = () => {
      handleHandleDragEnd();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  const justMountedRef = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      justMountedRef.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const advanceTutorial = () => {
    if (tutorialStage === "swipe") {
      localStorage.setItem(SWIPE_TUTORIAL_KEY, "true");
      if (localStorage.getItem(VOICE_TUTORIAL_KEY) !== "true") {
        setTutorialStage("voice");
      } else {
        setTutorialStage(null);
      }
    } else if (tutorialStage === "voice") {
      localStorage.setItem(VOICE_TUTORIAL_KEY, "true");
      setTutorialStage(null);
    }
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
    if (isHistoryOpen) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isHistoryOpen) return;
    if (justMountedRef.current) return;
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (deltaY < -120) {
           if (tutorialStage) {
        advanceTutorial();
        touchStartY.current = null;
        return;
      }
      lockAndRun(handleGoBackStep);
    } else if (deltaY > 120) {
      if (isLastStep) { touchStartY.current = null; return; }
            if (tutorialStage) {
        advanceTutorial();
        touchStartY.current = null;
        return;
      }
      lockAndRun(handleGoNextStep);
    }
    touchStartY.current = null;
  };

  const handleMouseDown = (e) => {
    if (isHistoryOpen) return;
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
            if (tutorialStage) {
        advanceTutorial();
        return;
      }
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
            if (tutorialStage) {
        advanceTutorial();
        return;
      }
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
    if (isHistoryOpen) return;
    if (justMountedRef.current) return;
    if (e.deltaY < -60) {
            if (tutorialStage) {
        advanceTutorial();
        return;
      }
      lockAndRun(handleGoBackStep);
    } else if (e.deltaY > 60) {
      if (isLastStep) return;
            if (tutorialStage) {
        advanceTutorial();
        return;
      }
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
                <MicGroup>
          {isListening && <VoiceWaveIcon src={micMoveIcon} alt="" />}
                    <MicCircle
            onMouseDown={handleMicPressStart}
            onMouseUp={handleMicPressEnd}
            onMouseLeave={handleMicPressCancel}
            onTouchStart={handleMicPressStart}
            onTouchEnd={handleMicPressEnd}
            onTouchCancel={handleMicPressCancel}
          >
            <img src={micIcon} alt="음성인식" />
          </MicCircle>
        </MicGroup>
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

                        if (detailStepKey === idx && step.squidDetail) {
              return (
                <StepCard key={idx} $direction={direction}>
                  <div className="detail-label">{step.link1}</div>
                  <button
                    className="detail-back"
                    onClick={() => setDetailStepKey(null)}
                  >
                    <img src={chevronLeftSmallIcon} alt="" />
                    레시피로 돌아가기
                  </button>
                  {step.squidDetail.sections.map((sec, i) => (
                    <div className="detail-section" key={i}>
                      <p className="detail-title">{sec.title}</p>
                      <p className="detail-body">
                        {sec.segments.map((seg, j) =>
                          seg.bold ? (
                            <strong key={j}>{seg.text}</strong>
                          ) : (
                            <span key={j}>{seg.text}</span>
                          )
                        )}
                      </p>
                      {sec.note && <p className="detail-note">{sec.note}</p>}
                    </div>
                  ))}
                  <button
                    className="example-toggle"
                    onClick={() => setIsExampleImageOpen((prev) => !prev)}
                  >
                    <img
                      className={`toggle-icon ${isExampleImageOpen ? "open" : ""}`}
                      src={chevronToggleSmallIcon}
                      alt=""
                    />
                    예시 이미지 보기
                  </button>
                  {isExampleImageOpen && (
                    <img
                      className="example-image"
                      src={squidExampleImg}
                      alt="오징어 써는 법 예시"
                    />
                  )}
                </StepCard>
              );
            }
            return (
              <StepCard key={idx} $direction={direction}>
                <div className="step-count">{idx + 1}/{totalSteps}</div>
                <div className="title-row">
                  <img className="check-icon" src={checkCircleIcon} alt="" />
                  <span className="title">{step.title}</span>
                </div>
                <div className="body">
                                   {step.bodySegments ? (
                    <p className="segmented" style={{ margin: 0 }}>
                      {step.bodySegments.map((seg, i) =>
                        seg.bold ? (
                          <strong key={i}>{seg.text}</strong>
                        ) : (
                          <span key={i}>{seg.text}</span>
                        )
                      )}
                    </p>
                  ) : (
                    step.body.map((line, i) => (
                      <p key={i} style={{ margin: 0 }}>{line}</p>
                    ))
                  )}
                </div>
                {step.tip && <p className="tip">{step.tip}</p>}
                {step.link1 && (
                  step.squidDetail ? (
                    <button
                      className="link"
                      onClick={() => {
                        setDetailStepKey(idx);
                        setIsExampleImageOpen(false);
                      }}
                    >
                      {step.link1}
                    </button>
                  ) : (
                    <a className="link" href="#!">{step.link1}</a>
                  )
                )}
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
          <CompleteButton onClick={() => setIsCompleteModalOpen(true)}>
            <span className="left">
              <img className="icon" src={forkKnifeImg} alt="" />
              <span className="label">요리 완료!</span>
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

      {tutorialStage === "swipe" && (
        <TutorialOverlay onClick={advanceTutorial}>
          <ChevronStack $top={300} $direction="up">
            <img src={chevronsUpIcon} alt="" />
          </ChevronStack>
          <div className="hint-block hint-top">
            <p>화면을 아래로 쓸어내려</p>
            <p>이전 단계로 이동</p>
          </div>
          <div className="hint-block hint-bottom">
            <p>화면을 위로 쓸어올려</p>
            <p>다음 단계로 이동</p>
          </div>
          <ChevronStack $top={570} $direction="down">
            <img src={chevronsUpIcon} alt="" />
          </ChevronStack>
        </TutorialOverlay>
      )}

      {tutorialStage === "voice" && (
        <VoiceTutorialOverlay onClick={advanceTutorial}>

<VoiceGlowWrap />
          <HighlightMic>
            <img src={micIcon} alt="" />
          </HighlightMic>
          <VoiceHintText>
            <p>클릭 시 활성화</p>
            <p>꾹 눌러 대화내역 보기</p>
          </VoiceHintText>
          <VoiceCapabilities>
            <p className="heading">루틴잇 AI, 이런 것들을 도와줄 수 있어요</p>
            <div className="list">
              <div>
                <p className="item-title">대체 재료 추천</p>
                <p className="item-desc">굴소스 없는데 어떡해?</p>
              </div>
              <div>
                <p className="item-title">요리 중 화면 조작</p>
                <p className="item-desc">다음 단계로 넘겨줘</p>
              </div>
              <div>
                <p className="item-title">조리 중 긴급 조언</p>
                <p className="item-desc">바닥이 타는데 어떻게 해야돼?</p>
              </div>
            </div>
          </VoiceCapabilities>
        </VoiceTutorialOverlay>
      )}

            {isCompleteModalOpen && (
        <CompleteModalOverlay onClick={() => setIsCompleteModalOpen(false)}>
          <CompleteModalBox onClick={(e) => e.stopPropagation()}>
            <CompleteIconBox>
              <img src={forkKnifeImg} alt="" />
            </CompleteIconBox>
            <CompleteTextBox>
              <CompleteTitle>요리를 완료할게요</CompleteTitle>
              <CompleteDesc>
                <p>간단한 피드백을 기록하면</p>
                <p>더 정교하게 추천해드려요</p>
              </CompleteDesc>
            </CompleteTextBox>
            <CompleteActions>
              <CompleteActionButton
                $variant="cancel"
                onClick={() => setIsCompleteModalOpen(false)}
              >
                취소
              </CompleteActionButton>
              <CompleteActionButton
                $variant="confirm"
                onClick={() => navigate(`/cooking/${mealId}/complete`)}
              >
                완료
              </CompleteActionButton>
            </CompleteActions>
          </CompleteModalBox>
        </CompleteModalOverlay>
      )}
            {isHistoryOpen && (
        <HistoryOverlay onClick={() => setIsHistoryOpen(false)}>
          <HistoryBox
          id="history-box"
           onClick={(e) => e.stopPropagation()}
                       onWheel={(e) => e.stopPropagation()}
           onTouchStart={(e) => e.stopPropagation()}
           onTouchMove={(e) => e.stopPropagation()}
           style={historyHeight ? { height: historyHeight, maxHeight: historyHeight } : undefined}
           >
             <HistoryHandle
              onMouseDown={handleHandlePointerDown}
              onTouchStart={handleHandlePointerDown}
            />
                        <HistoryScrollArea ref={historyBoxRef} onScroll={checkHasMoreBelow}>
              {VOICE_HISTORY.map((turn, i) => (
                <HistoryTurn key={i}>
                  <HistoryQuestion>{turn.question}</HistoryQuestion>
                  <HistoryAnswer>
                    {turn.answerLines.map((line, li) => (
                      <p key={li}>
                        {line.length === 0
                          ? "\u00A0"
                          : line.map((seg, si) =>
                              seg.bold ? <strong key={si}>{seg.text}</strong> : <span key={si}>{seg.text}</span>
                            )}
                      </p>
                    ))}
                  </HistoryAnswer>
                </HistoryTurn>
              ))}
            </HistoryScrollArea>
            {!isHistoryDragging && hasMoreBelow && <HistoryScrollFade />}
          </HistoryBox>
        </HistoryOverlay>
      )}
    </PageContainer>
  );
}