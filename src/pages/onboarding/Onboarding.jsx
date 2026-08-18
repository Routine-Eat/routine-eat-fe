import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import BackButton from '../../common/button/BackButton';
import { completeOnboarding } from '../../utils/onboarding';
import FirstStep from './steps/FirstStep';
import FourthStep from './steps/FourthStep';
import SecondStep, { SelectedChips } from './steps/SecondStep';
import ThirdStep, { SelectedToolChips } from './steps/ThirdStep';

const TOTAL_STEPS = 4;

function Onboarding() {
  const navigate = useNavigate();
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
    next.forEach((item) => map.set(item.id, item));
    return [...map.values()];
  };

  const finish = () => {
    completeOnboarding();
    navigate('/', { replace: true });
  };

  const handleConfirm = () => {
    if (step === 1 && !cookingLevel) return;
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }
    finish();
  };

  const handleSkip = () => {
    if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
    else finish();
  };

  const selectionCount = step === 2 ? dislikedIds.length : step === 3 ? toolIds.length : 0;
  const confirmLabel =
    (step === 2 || step === 3) && selectionCount > 0 ? `선택완료(${selectionCount})` : '확인';

  const showSelected = (step === 2 && dislikedIds.length > 0) || (step === 3 && toolIds.length > 0);

  return (
    <Page>
      {/* 상단: 뒤로가기 + 프로그레스 + skip */}
      <TopBar>
        <BackButton onClick={handleBack} />
        {/* 4칸 프로그레스 바(활성 칸 연두 긴 막대) */}
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

      {step === 1 && <FirstStep selected={cookingLevel} onSelect={setCookingLevel} />}
      {step === 2 && <SecondStep selectedIds={dislikedIds} onToggle={toggleDislike} />}
      {step === 3 && <ThirdStep selectedIds={toolIds} onToggle={toggleTool} />}
      {step === 4 && (
        <FourthStep
          ingredients={ingredients}
          seasonings={seasonings}
          onSaveIngredients={(items) => setIngredients((prev) => mergeById(prev, items))}
          onSaveSeasonings={(items) => setSeasonings((prev) => mergeById(prev, items))}
        />
      )}

      {/* 하단 흰 라운드 패널(선택 칩 + 확인 버튼) */}
      <Footer $tall={showSelected}>
        {step === 2 && <SelectedChips selectedIds={dislikedIds} onRemove={toggleDislike} />}
        {step === 3 && <SelectedToolChips selectedIds={toolIds} onRemove={toggleTool} />}
        {/* 확인/선택완료 둥근 사각형 버튼 */}
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

/* 온보딩 전체 화면(세로 풀스크린) */
const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fffefd;
  overflow: hidden;
`;

/* 상단 툴바 가로 행 */
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 346px;
  margin: 60px 0 0 22px;
`;

/* 프로그레스 점/막대 가로 줄 */
const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* 프로그레스 한 칸(비활성 짧은 막대 / 활성 긴 연두 막대) */
const Dot = styled.span`
  width: ${({ $active }) => ($active ? 24 : 12)}px;
  height: 4px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? '#c2ee73' : '#d9d9da')};
`;

/* skip 자리 맞춤용 빈 사각 */
const TopSpacer = styled.div`
  width: 36px;
`;

/* skip 텍스트 버튼 */
const SkipBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 20px;
  color: #8b8b8b;
  cursor: pointer;
`;

/* 하단 고정 흰 라운드 패널(위쪽만 둥근 사각) */
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

/* 확인/선택완료 둥근 사각형 버튼(초록/주황) */
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
