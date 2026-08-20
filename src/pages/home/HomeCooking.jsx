  import React, { useRef, useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import chevronUpIcon from "../../assets/icons/chevronup.svg";
    import { DUMMY_DISHES } from "../../constants/home/DummyHome.js";
    import BackButton from "../../common/button/BackButton";
     import styled, { keyframes } from "styled-components";
import { getRecipeDetail } from "@/api/recipe";
   import { useUserStore } from "../../hooks/useUserStore";
   import loaderIcon from "@/common/loader.svg";

 const fadeOutUp = keyframes`
   from { opacity: 1; transform: translateY(0); }
   to { opacity: 0; transform: translateY(-40px); }
 `;

    const PageContainer = styled.div`
    background: #f5f5f6;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    padding-top: 62px;
    animation: ${({ $isLeaving }) => ($isLeaving ? fadeOutUp : "none")} 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
    `;

    const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    `;

    const RightButtons = styled.div`
    display: flex;
    gap: 8px;
    `;

    const StartHint = styled.p`
    margin-top: 182px;
    text-align: center;
    color: #96D960;
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
    color: #6EBA1D;
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

       const LoadingOverlay = styled.div`
   position: fixed;
   inset: 0;
   background: rgba(255, 255, 255, 0.7);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 400;
   `;

   const LoadingSpinner = styled.img`
   width: 40px;
   height: 40px;
   `;

    export default function HomeCooking() {
    const navigate = useNavigate();
    const { mealId } = useParams();
    const userLoginNumber = useUserStore((state) => state.userLoginNumber);
    const touchStartY = useRef(null);
    const [isLeaving, setIsLeaving] = useState(false);

       const dummyDish = DUMMY_DISHES[0];
   const [dish, setDish] = useState({
       name: dummyDish.name,
       image: dummyDish.image,
       timeLabel: null,
   });
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
       if (!mealId || !userLoginNumber) {
           setIsLoading(false);
           return undefined;
       }

       let isMounted = true;

       const fetchRecipeDetail = async () => {
           try {
               const response = await getRecipeDetail(mealId, {
                   userNumber: userLoginNumber,
                   servings: 1,
               });
               const payload = response.data ?? response;

               if (!isMounted) return;

               setDish({
                   name: payload.recipeName ?? dummyDish.name,
                   image: payload.recipeThumbnailUrl ?? dummyDish.image,
                   timeLabel:
                       payload.recipeTimeRequired != null
                           ? `${payload.recipeTimeRequired}분 소요 예정`
                           : null,
               });
           } catch (error) {
               console.error("레시피 상세 조회 실패:", error);
           } finally {
               if (isMounted) setIsLoading(false);
           }
       };

       fetchRecipeDetail();

       return () => {
           isMounted = false;
       };
   }, [mealId, userLoginNumber]);

    const handleStartSwipe = () => {
             if (isLeaving) return; // 중복 트리거 방지
     setIsLeaving(true);
     setTimeout(() => {
        navigate(`/cooking/${mealId}/step`, { replace: true });
        }, 200);
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
        $isLeaving={isLeaving}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        >
        <TopBar>
            <BackButton onClick={() => navigate(-1)} />
        </TopBar>

        <StartHint>위로 쓸어올려 레시피 시작</StartHint>

        <DishCard>
                       <img className="thumb" src={dish.image} alt={dish.name} />
           <div>
           <div className="dish-name">{isLoading ? "불러오는 중..." : dish.name}</div>
           {dish.timeLabel && <div className="dish-time">{dish.timeLabel}</div>}
           </div>
        </DishCard>

        <ChevronStack>
            <img src={chevronUpIcon} alt="" />
            <img src={chevronUpIcon} alt="" />
        </ChevronStack>
               {isLeaving && (
         <LoadingOverlay>
           <LoadingSpinner src={loaderIcon} alt="로딩 중" />
         </LoadingOverlay>
       )}
        </PageContainer>
    );
    }