    import React, { useRef } from "react";
    import styled from "styled-components";
    import { useNavigate, useParams } from "react-router-dom";
    import micIcon from "../../assets/icons/mic.svg";
    import chevronUpIcon from "../../assets/icons/chevronup.svg";
    import { DUMMY_DISHES } from "../../constants/home/DummyHome.js";
    import BackButton from "../../common/button/BackButton";

    const PageContainer = styled.div`
    background: #f5f5f6;
    max-width: 390px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    padding-top: 62px;
    `;

    const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    `;

    const GlassButton = styled.button`
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

    const RightButtons = styled.div`
    display: flex;
    gap: 8px;
    `;

    const StartHint = styled.p`
    margin-top: 182px;
    text-align: center;
    color: #72d472;
    font-size: 26px;
    font-family: Pretendard Variable;
    font-weight: 700;
    `;

    const DishCard = styled.div`
    margin: 26px auto 0;
    width: 366px;
    border-radius: 28px;
    background: white;
    box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.03), 0px 0px 40px 0px rgba(3, 3, 3, 0.05);
    padding: 16px 30px;
    display: flex;
    align-items: center;
    gap: 16px;

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
    letter-spacing: -0.22px;
    }

    .dish-time{
    margin-top: 4px;
    color: #3eb745;
    font-size: 16px;
    font-family: Pretendard Variable;
    font-weight: 500;
    letter-spacing: -0.16px;
    }
    `;

    const ChevronStack = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    img{
    width: 28px;
    height: 16px;
    }
    `;

    export default function HomeCooking() {
    const navigate = useNavigate();
    const { mealId } = useParams();
    const touchStartY = useRef(null);

    const dish = DUMMY_DISHES[0]; // TODO: mealId 기준으로 실제 요리 데이터 연결

    const handleStartSwipe = () => {
        navigate(`/cooking/${mealId}/step`);
    };

        const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (touchStartY.current === null) return;
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        if (deltaY > 50) {
        handleStartSwipe();
        }
        touchStartY.current = null;
    };

    const isDragging = useRef(false);

    const handleMouseDown = (e) => {
        touchStartY.current = e.clientY;
        isDragging.current = true;
            window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUpGlobal);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || touchStartY.current === null) return;
        const deltaY = touchStartY.current - e.clientY;
        if (deltaY > 50) {
        isDragging.current = false;
        touchStartY.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUpGlobal);
        handleStartSwipe();
        }
    };

    const handleMouseUpGlobal = () => {
        isDragging.current = false;
        touchStartY.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUpGlobal);
    };

    const wheelTriggered = useRef(false);

    const handleWheel = (e) => {
        if (e.deltaY > 20 && !wheelTriggered.current) {
        wheelTriggered.current = true;
        handleStartSwipe();
        }
    };


    return (
        <PageContainer
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        >
        <TopBar>
            <BackButton onClick={() => navigate(-1)} />
            <RightButtons>
            <GlassButton>
                <img src={micIcon} alt="음성인식" />
            </GlassButton>
            </RightButtons>
        </TopBar>

        <StartHint>위로 쓸어올려 레시피 시작</StartHint>

        <DishCard>
            <img className="thumb" src={dish.image} alt="계란 대파 볶음밥" />
            <div>
            <div className="dish-name">계란 대파 볶음밥</div>
            <div className="dish-time">8분 소요 예정</div>
            </div>
        </DishCard>

        <ChevronStack>
            <img src={chevronUpIcon} alt="" />
            <img src={chevronUpIcon} alt="" />
        </ChevronStack>
        </PageContainer>
    );
    }