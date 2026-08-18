import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import {
  getUserFoodIngredients,
  postUserCookingEquipments,
  postUserFoodIngredients,
} from '@/api/userApi';
import { useUserStore } from '@/hooks/useUserStore';

import BackButton from '../../common/button/BackButton';
import { completeOnboarding } from '../../utils/onboarding';
import FirstStep from './steps/FirstStep';
import FourthStep from './steps/FourthStep';
import SecondStep, { SelectedChips } from './steps/SecondStep';
import ThirdStep, { SelectedToolChips } from './steps/ThirdStep';

const TOTAL_STEPS = 4;

function Onboarding() {
  const navigate = useNavigate();

  // 로그인할 때 Zustand에 저장된 현재 사용자 ID
  const userId = useUserStore((state) => state.userId);

  const [step, setStep] = useState(1);
  const [cookingLevel, setCookingLevel] = useState(null);
  const [dislikedIds, setDislikedIds] = useState([]);
  const [toolIds, setToolIds] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [seasonings, setSeasonings] = useState([]);

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
      return;
    }

    setStep((prev) => prev - 1);
  };

  const toggleDislike = (id) => {
    setDislikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleTool = (id) => {
    setToolIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  /* 식재료/조미료 등록 병합(같은 id면 덮어씀) */
  const mergeById = (prev, next) => {
    const map = new Map(prev.map((item) => [item.id, item]));

    next.forEach((item) => {
      map.set(item.id, item);
    });

    return [...map.values()];
  };

  const finish = () => {
    completeOnboarding();
    navigate('/', { replace: true });
  };

  /*
   * "200G" 같은 문자열에서 숫자만 추출
   *
   * 예:
   * "200G" -> 200
   * "3ML" -> 3
   *
   * 수량 미입력 -> null
   *
   * SecondaryUnit은 사용하지 않음
   */
  const getPrimaryAmountValue = (qty) => {
    if (!qty) return null;

    const value = parseFloat(qty);

    return Number.isNaN(value) ? null : value;
  };

  const handleConfirm = async () => {
    /*
     * 1단계
     * 요리 실력 선택 필수
     */
    if (step === 1 && !cookingLevel) {
      return;
    }

    /*
     * 3단계
     * 선택한 조리도구 서버 저장
     */
    if (step === 3) {
      if (!userId) {
        console.error('사용자 정보가 없습니다.');
        return;
      }

      try {
        await postUserCookingEquipments(userId, toolIds);

        console.log('사용자 조리도구 저장 성공:', toolIds);
      } catch (error) {
        console.error('사용자 조리도구 저장 실패:', error);
        return;
      }
    }

    /*
     * 4단계
     * 식재료 + 조미료 저장
     */
    if (step === 4) {
      if (!userId) {
        console.error('사용자 정보가 없습니다.');
        return;
      }

      /*
       * 식재료와 조미료 모두
       * food-ingredients API에서 관리되므로
       * 하나의 배열로 합침
       */
      const allFoodIngredients = [...ingredients, ...seasonings];

      /*
       * 아무것도 등록하지 않았다면
       * API 호출 없이 온보딩 종료
       */
      if (allFoodIngredients.length > 0) {
        try {
          /*
           * 1.
           * 이미 사용자가 보유하고 있는
           * 식재료 조회
           */
          const response = await getUserFoodIngredients(userId, 'OWN');

          const ownedIngredients = response.data?.foodIngredientList ?? [];

          /*
           * 현재 서버에 저장되어 있는
           * 식재료 ID 목록
           */
          const ownedIds = ownedIngredients.map((item) => item.foodIngredientId);

          /*
           * 2.
           * 사용자가 이번에 선택한 재료 중
           * 이미 서버에 존재하는 것은 제외
           */
          const newFoodIngredients = allFoodIngredients.filter(
            (item) => !ownedIds.includes(item.id)
          );

          /*
           * 3.
           * 새롭게 추가할 재료가 있는 경우에만
           * POST 요청
           */
          if (newFoodIngredients.length > 0) {
            const foodIngredientData = {
              /*
               * 온보딩에서 등록하는 재료는
               * 사용자가 현재 보유한 재료
               */
              relationType: 'OWN',

              foodIngredientList: newFoodIngredients.map((item) => ({
                foodIngredientId: item.id,

                /*
                 * PrimaryUnit에 해당하는
                 * 수량 값만 서버로 전송
                 *
                 * 예:
                 * 감자 200G
                 * -> primaryAmountValue: 200
                 *
                 * 수량 미입력
                 * -> primaryAmountValue: null
                 *
                 * secondaryAmountValue는
                 * 사용하지 않음
                 */
                primaryAmountValue: getPrimaryAmountValue(item.qty),
              })),
            };

            await postUserFoodIngredients(userId, foodIngredientData);

            console.log('사용자 식재료 저장 성공:', foodIngredientData);
          } else {
            /*
             * 선택한 재료가 전부
             * 이미 서버에 등록되어 있는 경우
             */
            console.log('새로 추가할 식재료가 없습니다.');
          }
        } catch (error) {
          console.error('사용자 식재료 저장 실패:', error);
          return;
        }
      }
    }

    /*
     * 아직 마지막 단계가 아니라면
     * 다음 단계로 이동
     */
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    /*
     * 4단계 완료
     */
    finish();
  };

  const handleSkip = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    } else {
      finish();
    }
  };

  const selectionCount = step === 2 ? dislikedIds.length : step === 3 ? toolIds.length : 0;

  const confirmLabel =
    (step === 2 || step === 3) && selectionCount > 0 ? `선택완료(${selectionCount})` : '확인';

  const showSelected = (step === 2 && dislikedIds.length > 0) || (step === 3 && toolIds.length > 0);

  return (
    <Page>
      {/* 상단 */}
      <TopBar>
        <BackButton onClick={handleBack} />

        <Progress>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <Dot key={i} $active={i + 1 === step} />
          ))}
        </Progress>

        {step >= 2 ? (
          <SkipBtn type="button" onClick={handleSkip}>
            skip
          </SkipBtn>
        ) : (
          <TopSpacer aria-hidden />
        )}
      </TopBar>

      {/* 1단계 */}
      {step === 1 && <FirstStep selected={cookingLevel} onSelect={setCookingLevel} />}

      {/* 2단계 */}
      {step === 2 && <SecondStep selectedIds={dislikedIds} onToggle={toggleDislike} />}

      {/* 3단계 */}
      {step === 3 && <ThirdStep selectedIds={toolIds} onToggle={toggleTool} />}

      {/* 4단계 */}
      {step === 4 && (
        <FourthStep
          ingredients={ingredients}
          seasonings={seasonings}
          onSaveIngredients={(items) => setIngredients((prev) => mergeById(prev, items))}
          onSaveSeasonings={(items) => setSeasonings((prev) => mergeById(prev, items))}
        />
      )}

      {/* 하단 */}
      <Footer $tall={showSelected}>
        {step === 2 && <SelectedChips selectedIds={dislikedIds} onRemove={toggleDislike} />}

        {step === 3 && <SelectedToolChips selectedIds={toolIds} onRemove={toggleTool} />}

        <ConfirmBtn
          type="button"
          $orange={step === 2}
          disabled={step === 1 && !cookingLevel}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </ConfirmBtn>
      </Footer>
    </Page>
  );
}

/* 온보딩 전체 화면 */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fffefd;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 346px;
  margin: 60px 0 0 22px;
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span`
  width: ${({ $active }) => ($active ? 24 : 12)}px;
  height: 4px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? '#c2ee73' : '#d9d9da')};
`;

const TopSpacer = styled.div`
  width: 36px;
`;

const SkipBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 20px;
  color: #8b8b8b;
  cursor: pointer;
`;

const Footer = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 10;
  width: 100%;
  max-width: 390px;
  transform: translateX(-50%);
  padding: ${({ $tall }) => ($tall ? '20px 20px 32px' : '28px 20px 32px')};
  background: #fff;
  border-radius: 36px 36px 0 0;
  box-shadow:
    0 0 10px rgba(3, 3, 3, 0.06),
    0 0 40px rgba(3, 3, 3, 0.08);
`;

const ConfirmBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: ${({ $orange }) => ($orange ? '#ff9b44' : '#72d472')};
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.18px;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

export default Onboarding;
