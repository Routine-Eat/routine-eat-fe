import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import styled from "styled-components";

import { getUserFoodIngredients, patchUserFoodIngredientAmount } from "@/api/userApi";
import { useUserStore } from "@/hooks/useUserStore";
import { useCookingStore } from "../../hooks/useCookingStore";
import { patchCookingResult } from "../../api/cookingRecord";
import { patchPlanMenuCompleted, getUserMealPlanDetail, patchUserMealPlanStatus } from "../../api/mealPlanApi";
import BackButton from "../../common/button/BackButton";
import checkBadgeGreenIcon from "../../assets/icons/checkCircleWhite.svg";
import arrowLeftIcon from "../../assets/icons/arrowLeft.svg";
import forkKnifeImg from "../../assets/images/forkKnife.svg";


const PageContainer = styled.div`
  background: #fffefd;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  padding: 60px 20px 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Title = styled.p`
  margin: 130px 0 0;
  color: #030303;
  font-size: 22px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.44px;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #8b8b8b;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.3px;
  text-align: center;
`;

const IngredientBox = styled.div`
  margin: 40px auto 0;
  max-width: 100%;
  width: 350px;
  border: 1px solid #d9d9da;
  border-radius: 20px;
  padding: 20px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
   justify-content: flex-start;
 max-height: 240px;
 overflow-y: auto;
 scrollbar-width: none;
 -ms-overflow-style: none;

 &::-webkit-scrollbar {
   display: none;
 }
`;

const IngredientChip = styled.div`
  padding: 8px 10px;
  border-radius: 8px;
  background: #f5f5f6;
  color: #444;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  white-space: nowrap;
`;

const FootNote = styled.p`
  margin: 16px 0 0;
  color: #8b8b8b;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.3px;
  text-align: center;
`;

const BottomButtonGroup = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 42px);
  max-width: 348px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  background: ${({ $variant }) => ($variant === "primary" ? "#96D960" : "#e9e9e9")};
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "#5a5a5b")};
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

   &:disabled {
   opacity: 0.6;
   cursor: not-allowed;
 }

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    &:active:not(:disabled) {
      background: #36a73c;
      color: #c6f5a6;
      font-size: 17px;
      transform: scale(0.97);
    }
  `
      : ""}
`;

const ReflectedModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

const ReflectedModalBox = styled.div`
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

const ReflectedIconBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 40px;
    height: 40px;
  }
`;

const ReflectedTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const ReflectedTitle = styled.p`
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  line-height: 1.3;
`;

const ReflectedDesc = styled.p`
  margin: 0;
  color: #8b8b8b;
  font-size: 14px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 1.3;
`;

const ReflectedConfirmButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #96D960;
  color: white;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.16px;
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

  &:active {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 15px;
    transform: scale(0.97);
  }
`;

const CompleteModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
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
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 40px;
    height: 40px;
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

const CompleteConfirmButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #96D960;
  color: white;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.16px;
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

  &:active {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 15px;
    transform: scale(0.97);
  }
`;


/* ---- 중앙 모달 공통 (Figma "필터" 컴포넌트, node 1649:6264 / 1699:6462) ---- */
const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

/* 두 화면(목록/입력) 모두 이 고정 크기 박스를 그대로 씁니다.
   내부는 항상 "콘텐츠 영역(flex:1)" + "버튼"의 2단 구성으로,
   콘텐츠가 적어도 버튼은 항상 박스 맨 아래에 붙습니다. */
const SheetBox = styled.div`
  width: 360px;
  height: 360px;
  background: white;
  border: 0.5px solid #d9d9da;
  border-radius: 22px;
  padding: 24px 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
`;

/* ---- 1단계: 재료 목록 수정 (node 1649:6264) ---- */
const SheetContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  gap: 24px;
  width: 100%;
`;

const SheetTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 8px;
`;

const SheetTitle = styled.p`
  margin: 0;
  color: #030303;
  font-size: 22px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.44px;
`;

const SheetSubtitle = styled.p`
  margin: 0;
  color: #8b8b8b;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  letter-spacing: -0.3px;
`;

const SheetIngredientBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
   justify-content: flex-start;
 max-height: 160px;
 overflow-y: auto;
 scrollbar-width: none;
 -ms-overflow-style: none;

 &::-webkit-scrollbar {
   display: none;
 }
`;

const SheetIngredientChip = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  background: #f5f5f6;
  color: #444;
  font-size: 15px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: none;
`;

const SheetButtonRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const SheetCancelButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: #f5f5f6;
  color: #8b8b8b;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
`;

const SheetConfirmButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: #96D960;
  color: white;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

  &:active {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 17px;
    transform: scale(0.97);
  }
`;

/* ---- 2단계: 개별 재료 수량 입력 (node 1699:6462) ---- */
const DetailBackRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 4px;
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  margin-top: -50px;

  img {
    width: 10px;
    height: 20px;
  }

  span {
    color: #5a5a5b;
    font-size: 16px;
    font-family: Wanted Sans Variable;
    font-weight: 500;
    line-height: 1;
  }
`;

const DetailBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const DetailChip = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f5f6;
  color: #444;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
`;

const DetailInputRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
`;

const DetailQuestion = styled.p`
  margin: 0;
  color: #1a1a1a;
  font-size: 20px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
`;

const DetailInputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailInput = styled.input`
  width: 100px;
  height: 36px;
  border: 1px solid #d9d9da;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  font-family: Wanted Sans Variable;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;

  &:focus {
    border-color: #72d472;
  }
`;

const DetailUnit = styled.p`
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
`;

const DetailConfirmButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #96D960;
  color: white;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;

  &:active {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 17px;
    transform: scale(0.97);
  }
`;

/* "200G" / "1" -> 200 / 1. Secondary 단위·수량은 사용하지 않음 */
const getPrimaryAmountValue = (amount) => {
  if (!amount) return null;

  const value = parseFloat(amount);

  return Number.isNaN(value) ? null : value;
};

const pickAmount = (...values) =>
  values.find((value) => value != null && Number(value) !== 0) ?? 0;

const getUsedPrimaryAmount = (item) => {
  const prev = Number(item?.prevPrimaryAmountValue);
  const current = Number(item?.currentPrimaryAmountValue);
  if (!Number.isFinite(prev) || !Number.isFinite(current)) return null;
  return Math.max(prev - current, 0);
};

export default function CookingIngredientCheck() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const location = useLocation();
  const userId = useUserStore((state) => state.userId);
    const userLoginNumber = useUserStore((state) => state.userLoginNumber);
  const cookingRecordId = useCookingStore((state) => state.cookingRecordId);
  const photoFile = useCookingStore((state) => state.photoFile);
  const mealPlanId = useCookingStore((state) => state.mealPlanId);
  const planMenuId = useCookingStore((state) => state.planMenuId);
  const clearCookingSession = useCookingStore((state) => state.clearCookingSession);

  // CookingReview.jsx에서 navigate state로 넘겨준 값
  const { difficultyLevel, foodIngredients: apiFoodIngredients } = location.state ?? {};

  // API 응답을 화면에서 쓰는 형태로 변환
  const mapApiIngredientsToState = (raw) =>
    (raw?.foodIngredients ?? []).map((item) => ({
      id: item.cookingRecordFoodIngredientId,
      foodIngredientId: item.foodIngredientId,
      name: item.name,
      amount: getUsedPrimaryAmount(item) ?? pickAmount(
        item.primaryNeedAmountValue,
        item.primaryAmountValue,
        item.primaryUsedAmountValue
      ),
      unit: item.primaryUnit,
    }));
  const [isReflectedModalOpen, setIsReflectedModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [ingredients, setIngredients] = useState(() => mapApiIngredientsToState(apiFoodIngredients));
  const [editingId, setEditingId] = useState(null); // null이면 목록 화면, id가 있으면 상세 입력 화면
  const [editingAmount, setEditingAmount] = useState("");
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUsedDifferently = () => {
    setIsEditModalOpen(true);
  };

  const saveOwnedIngredientAmounts = async (list) => {
    if (!userId) {
      console.error("사용자 정보가 없습니다.");
      return false;
    }

    try {
      const response = await getUserFoodIngredients(userId, "OWN");
      const payload = response?.data ?? response;
      const ownedById = new Map(
        (payload?.foodIngredientList ?? []).map((item) => [String(item.foodIngredientId), item])
      );

      const foodIngredientList = list
        .map((item) => {
          const used = getPrimaryAmountValue(item.amount);
          const owned = ownedById.get(String(item.foodIngredientId));
          if (!owned || owned.foodIngredientType === "SEASONING") return null;

          const ownedAmount = Number(owned.primaryAmountValue);
          if (!Number.isFinite(used) || !Number.isFinite(ownedAmount) || ownedAmount <= used) {
            return null;
          }

          return {
            foodIngredientId: Number(item.foodIngredientId),
            primaryAmountValue: ownedAmount - used,
          };
        })
        .filter(
          (item) => item && Number.isFinite(item.foodIngredientId) && item.primaryAmountValue > 0
        );

      if (foodIngredientList.length === 0) return true;

      await patchUserFoodIngredientAmount(userId, { foodIngredientList });
      return true;
    } catch (error) {
      console.error("사용자 식재료 보유량 수정 실패:", error);
      return false;
    }
  };

    // 요리 결과 최종 저장 (맛 평가/난이도/팁/실제 사용량/사진)
  const saveCookingResult = async (list) => {
    if (!userLoginNumber) {
      console.error("userLoginNumber가 없습니다.");
      return false;
    }

    const modifiedCookingRecordFoodIngredients = list
      .map((item) => ({
        cookingRecordFoodIngredientId: item.id,
        usedPrimaryAmountValue: getPrimaryAmountValue(item.amount),
        usedSecondaryAmountValue: null,
      }))
      .filter((item) => item.usedPrimaryAmountValue != null);

    try {
      await patchCookingResult(userLoginNumber, {
        tasteRating: "LEVEL_1",
        difficultyLevel: difficultyLevel ?? "LEVEL_1",
        cookingTip: "",
        modifiedCookingRecordFoodIngredients,
        image: photoFile,
      });
      return true;
    } catch (error) {
      console.error("요리 결과 저장 실패:", error);
      return false;
    }
  };
  const handleUsedAsIs = async () => {
    setIsSaving(true);
    const saved = await saveOwnedIngredientAmounts(ingredients);
    if (!saved) { setIsSaving(false); return; }
        const resultSaved = await saveCookingResult(ingredients);
    setIsSaving(false);
    if (!resultSaved) return;

    setIsReflectedModalOpen(true);
  };

  const handleConfirmReflected = () => {
    setIsReflectedModalOpen(false);
    setIsCompleteModalOpen(true);
  };

    const handleFinalComplete = async () => {
      console.log("!!! handleFinalComplete 진입함 !!!");
    setIsCompleteModalOpen(false);
    const nextDietId = mealPlanId ?? mealId;
    if (userId && planMenuId) {
      try {
        await patchPlanMenuCompleted(userId, planMenuId, true);
      } catch (error) {
        console.error("식단 메뉴 완료 여부 수정 실패:", error);
      }
    }
    clearCookingSession();
       let isMealPlanDone = false;
   if (userId && nextDietId) {
     try {
       const res = await getUserMealPlanDetail(userId, nextDietId);
       const detail = res.data ?? res;
       console.log("식단 상세 응답:", detail);
              const planMenuList = detail?.planMenuList ?? [];
       isMealPlanDone =
         detail?.mealPlanStatus === "DONE" ||
         (planMenuList.length > 0 && planMenuList.every((m) => m.planMenuCompleted));
         console.log("isMealPlanDone 계산 결과:", isMealPlanDone);
               if (isMealPlanDone && detail?.mealPlanStatus !== "DONE") {
        try {
          await patchUserMealPlanStatus(nextDietId, userId, "DONE");
        } catch (error) {
          console.error("식단 완료 상태 수정 실패:", error);
        }
      }
     } catch (error) {
       console.error("식단 상태 재조회 실패:", error);
     }
   }

      if (isMealPlanDone) {
        console.log("activeMealPlanId를 null로 초기화합니다");
     useCookingStore.getState().setActiveMealPlanId(null);
   }

   navigate(isMealPlanDone ? "/" : `/diet-start/${nextDietId}`);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
  };

  const handleChipClick = (item) => {
    setEditingId(item.id);
    setEditingAmount(item.amount);
  };

  const handleDetailBack = () => {
    setEditingId(null);
  };

  const handleDetailConfirm = () => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, amount: editingAmount.trim() || item.amount } : item
      )
    );
    setEditingId(null);
  };

  const handleListCancel = () => {
   setIngredients(mapApiIngredientsToState(apiFoodIngredients));
    closeEditModal();
  };

  const handleListConfirm = async () => {
    setIsSaving(true);
    const saved = await saveOwnedIngredientAmounts(ingredients);
    if (!saved) { setIsSaving(false); return; }

        const resultSaved = await saveCookingResult(ingredients);
    setIsSaving(false);
    if (!resultSaved) return;

    closeEditModal();
    setIsCompleteModalOpen(true);
  };

  const editingItem = ingredients.find((item) => item.id === editingId);

  return (
    <PageContainer>
      <TopRow>
        <BackButton className="back-button-wrap" onClick={() => navigate(-1)} />
      </TopRow>

      <Title>이번 요리에 사용한 재료들이에요</Title>
      <Subtitle>재료 사용량이 자동으로 반영돼요</Subtitle>

      <IngredientBox>
        {ingredients.map((item) => (
          <IngredientChip key={item.id}>
            {item.name} {item.amount}
            {item.unit}
          </IngredientChip>
        ))}
      </IngredientBox>

      <FootNote>조미료는 반영되지 않아요</FootNote>

      <BottomButtonGroup>
               <ActionButton onClick={handleUsedDifferently} disabled={isSaving}>다르게 썼어요</ActionButton>
       <ActionButton $variant="primary" onClick={handleUsedAsIs} disabled={isSaving}>
          그대로 사용했어요
        </ActionButton>
      </BottomButtonGroup>

      {isReflectedModalOpen && (
        <ReflectedModalOverlay onClick={() => setIsReflectedModalOpen(false)}>
          <ReflectedModalBox onClick={(e) => e.stopPropagation()}>
            <ReflectedIconBox>
              <img src={checkBadgeGreenIcon} alt="" />
            </ReflectedIconBox>
            <ReflectedTextBox>
              <ReflectedTitle>재료 사용량을 반영했어요</ReflectedTitle>
              <ReflectedDesc>남은 재료는 마이 탭에서 확인할 수 있어요</ReflectedDesc>
            </ReflectedTextBox>
            <ReflectedConfirmButton onClick={handleConfirmReflected}>
              확인했어요
            </ReflectedConfirmButton>
          </ReflectedModalBox>
        </ReflectedModalOverlay>
      )}

      {isEditModalOpen && (
        <SheetOverlay onClick={closeEditModal}>
          <SheetBox onClick={(e) => e.stopPropagation()}>
            {editingId === null ? (
              <>
                <SheetContent>
                  <SheetTextBox>
                    <SheetTitle>재료 사용량을 수정해주세요</SheetTitle>
                    <SheetSubtitle>재료 사용량이 자동으로 반영돼요</SheetSubtitle>
                  </SheetTextBox>

                  <SheetIngredientBox>
                    {ingredients.map((item) => (
                      <SheetIngredientChip key={item.id} onClick={() => handleChipClick(item)}>
                        {item.name} {item.amount}
                        {item.unit}
                      </SheetIngredientChip>
                    ))}
                  </SheetIngredientBox>
                </SheetContent>

                <SheetButtonRow>
                  <SheetCancelButton onClick={handleListCancel}>취소</SheetCancelButton>
                  <SheetConfirmButton onClick={handleListConfirm}>완료</SheetConfirmButton>
                </SheetButtonRow>
              </>
            ) : (
              <>
                <SheetContent>
                  <DetailBackRow onClick={handleDetailBack}>
                    <img src={arrowLeftIcon} alt="" />
                    <span>뒤로가기</span>
                  </DetailBackRow>

                  <DetailBody>
                    <DetailChip>{editingItem?.name}</DetailChip>
                    <DetailInputRow>
                      <DetailQuestion>재료 사용량을 입력해주세요</DetailQuestion>
                      <DetailInputBox>
                        <DetailInput
                          autoFocus
                          value={editingAmount}
                          onChange={(e) => setEditingAmount(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleDetailConfirm()}
                        />
                        <DetailUnit>{editingItem?.unit}</DetailUnit>
                      </DetailInputBox>
                    </DetailInputRow>
                  </DetailBody>
                </SheetContent>

                <DetailConfirmButton onClick={handleDetailConfirm}>입력완료</DetailConfirmButton>
              </>
            )}
          </SheetBox>
        </SheetOverlay>
      )}
            {isCompleteModalOpen && (
        <CompleteModalOverlay onClick={() => setIsCompleteModalOpen(false)}>
          <CompleteModalBox onClick={(e) => e.stopPropagation()}>
            <CompleteIconBox>
              <img src={forkKnifeImg} alt="" />
            </CompleteIconBox>
            <CompleteTextBox>
              <CompleteTitle>레시피를 완료했어요</CompleteTitle>
              <CompleteDesc>
                <p>요리 기록은 마이 탭에서</p>
                <p>확인할 수 있어요</p>
              </CompleteDesc>
            </CompleteTextBox>
            <CompleteConfirmButton onClick={handleFinalComplete}>
              확인했어요
            </CompleteConfirmButton>
          </CompleteModalBox>
       </CompleteModalOverlay>
      )}
    </PageContainer>
  );
}