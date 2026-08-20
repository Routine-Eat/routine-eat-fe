import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled, { keyframes } from 'styled-components';

import { getUserStatistics } from '../../api/userApi';
import closeX from '../../assets/notification/close-x.svg';
import starEmpty from '../../assets/notification/star-empty.svg';
import starFilled from '../../assets/notification/star-filled.svg';
import PillButton from '../../common/PillButton';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';

const EMPTY_REPORT = {
  count: 0,
  recipes: [],
  ingredients: [],
  difficulty: 0,
};

const ROTATES = [11.8, -11.23, 4.07, 0];

function NotificationReportModal({ contentId, onClose }) {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const [step, setStep] = useState(0);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [animatedDifficulty, setAnimatedDifficulty] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!userId || !contentId) return undefined;

    const fetchReport = async () => {
      try {
        const response = await getUserStatistics(userId, contentId);
        const payload = response.data ?? response;
        const recipes = (payload.recipeReport?.recipeList ?? []).map((item) => item.recipeName);
        const ingredients = (payload.mostUsedFoodIngredientList ?? []).map((item, index) => ({
            name: item.foodIngredientName,
            detailType: item.foodIngredientType,
            rotate: ROTATES[index % ROTATES.length],
        }));
        const difficulty = Number(String(payload.averageDifficultyLevel ?? '').replace('LEVEL_', ''));

        setReport({
          count: recipes.length || Number(payload.recipeReport?.count) || 0,
          recipes,
          ingredients,
          difficulty: Number.isFinite(difficulty) && difficulty > 0 ? difficulty : 0,
        });
      } catch (error) {
        console.error('사용자 통계 조회 실패:', error);
        setReport(EMPTY_REPORT);
      }
    };

    fetchReport();
  }, [userId, contentId]);

  useEffect(() => {
    if (step !== 2) {
      setAnimatedDifficulty(0);
      return undefined;
    }

    const target = Math.min(5, Math.max(0, report.difficulty));
    const timers = Array.from({ length: target }, (_, index) =>
      window.setTimeout(
        () => setAnimatedDifficulty(index + 1),
        180 + index * 320
      )
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [step, report.difficulty]);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 280);
  };

  return (
    <Overlay $closing={closing} onClick={handleClose}>
      <Stage onClick={(e) => e.stopPropagation()}>
        {step > 0 && (
          <SideBtn $side="left">
            <BackButton aria-label="이전" onClick={() => setStep((prev) => prev - 1)} />
          </SideBtn>
        )}

        <Card key={step} $tall={step === 0} $closing={closing}>
          {step === 0 && (
            <>
              <CardTitle>여태까지 루틴잇을 통해</CardTitle>
              <CountRow>
                <CountChip>{report.count}개</CountChip>
                <CountText>의 레시피를 요리했어요</CountText>
              </CountRow>
              <RecipeList>
                {report.recipes.map((name, index) => (
                  <RecipeChip key={`${name}-${index}`} $index={index}>
                    {name}
                  </RecipeChip>
                ))}
              </RecipeList>
            </>
          )}

          {step === 1 && (
            <>
              <CardTitle>최근 가장 많이 요리한 재료는?</CardTitle>
              <IngredientField>
                {report.ingredients.slice(0, 4).map((item, index) => (
                  <IngChip
                    key={item.name}
                    $rotate={item.rotate}
                    $index={index}
                  >
                    <PillButton
                      kind="INGREDIENT"
                      detailType={item.detailType}
                      name={item.name}
                      isSelected={false}
                      deleteAvailable={false}
                    />
                  </IngChip>
                ))}
              </IngredientField>
            </>
          )}

          {step === 2 && (
            <>
              <CardTitle>최근 요리한 레시피의 평균 난이도는?</CardTitle>
              <StarRow>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarImg
                    key={`${i}-${i < animatedDifficulty}`}
                    src={i < animatedDifficulty ? starFilled : starEmpty}
                    alt=""
                    $filled={i < animatedDifficulty}
                  />
                ))}
              </StarRow>
              <Score>{animatedDifficulty}점</Score>
              <ScoreHint>더 높은 난이도에 도전해볼까요?</ScoreHint>
              <ChallengeBtn
                type="button"
                onClick={() => navigate('/menu/skill-up')}
              >
                스텝업 식단 도전하기
              </ChallengeBtn>
            </>
          )}
        </Card>

        {step < 2 && (
          <SideBtn $side="right">
            <BackButton aria-label="다음" onClick={() => setStep((prev) => prev + 1)} />
          </SideBtn>
        )}
      </Stage>

      <CloseBtn
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        aria-label="닫기"
        $visible={step === 2}
      >
        <img src={closeX} alt="" />
      </CloseBtn>
    </Overlay>
  );
}

export default NotificationReportModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(3, 3, 3, 0.15);
  opacity: ${({ $closing }) => ($closing ? 0 : 1)};
  transition: opacity 280ms ease;
  pointer-events: ${({ $closing }) => ($closing ? 'none' : 'auto')};
`;

const Stage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 390px;
`;

const SideBtn = styled.div`
  position: absolute;
  top: 50%;
  z-index: 2;
  ${({ $side }) => ($side === 'left' ? 'left: 8px;' : 'right: 8px;')}
  transform: translateY(-50%) ${({ $side }) => ($side === 'right' ? 'scaleX(-1)' : 'none')};
`;

const reportCardEnter = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(18px, 0, 0) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const reportCardExit = keyframes`
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.94);
  }
`;

const Card = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 350px;
  height: ${({ $tall }) => ($tall ? '320px' : '286px')};
  padding: 44px 20px 20px;
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(107, 56, 0, 0.06),
    0 0 40px 0 rgba(97, 51, 0, 0.05),
    inset 0 0 5px 0 #fff;
  animation: ${({ $closing }) => ($closing ? reportCardExit : reportCardEnter)}
    ${({ $closing }) => ($closing ? '280ms ease' : '360ms cubic-bezier(0.22, 1, 0.36, 1)')}
    both;
  will-change: transform, opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CardTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #2e2e2e;
  text-align: center;
`;

const CountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
`;

const CountChip = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 6px;
  background: #ffe6bd;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  color: #ff871f;
`;

const CountText = styled.span`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.18px;
  color: #2e2e2e;
`;

const RecipeList = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: calc(100% + 40px);
  max-height: 200px;
  gap: 8px;
  align-items: center;
  margin: 0 -20px;
  padding: 20px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const recipeChipPop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.88);
  }
  58% {
    opacity: 1;
    transform: translateY(2px) scale(1.04);
  }
  78% {
    transform: translateY(-1px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const RecipeChip = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 268px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $index }) => ['#fff6b4', '#fff9d2', '#fffcec'][$index] ?? '#fffcec'};
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.16px;
  color: #481c00;
  transform-origin: center;
  animation: ${recipeChipPop} 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index }) => $index * 180}ms;
  will-change: transform, opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const IngredientField = styled.div`
  position: absolute;
  right: 12px;
  bottom: 16px;
  left: 12px;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 8px 6px;
  align-items: end;
  justify-content: center;
  pointer-events: none;
`;

const ingredientDrop = keyframes`
  0% {
    opacity: 0;
    transform:
      translate3d(var(--drop-x), var(--drop-height), 0)
      rotate(var(--final-rotate))
      scale(0.96);
  }
  90% {
    opacity: 1;
    transform:
      translate3d(0, 0, 0)
      rotate(var(--final-rotate))
      scaleX(1.012)
      scaleY(0.975);
  }
  96% {
    opacity: 1;
    transform:
      translate3d(0, -5px, 0)
      rotate(var(--final-rotate))
      scale(1);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(var(--final-rotate)) scale(1);
  }
`;

const IngChip = styled.div`
  position: relative;
  max-width: calc(100% - 16px);
  --final-rotate: ${({ $rotate }) => $rotate}deg;
  --drop-x: ${({ $index }) => [-18, 14, -12, 16][$index] ?? 0}px;
  --drop-height: ${({ $index }) => [-210, -265, -225, -280][$index] ?? -220}px;
  transform: rotate(var(--final-rotate));
  transform-origin: center;
  animation: ${ingredientDrop} 900ms cubic-bezier(0.48, 0.04, 0.88, 0.38) both;
  animation-delay: ${({ $index }) => [0, 190, 260, 80][$index] ?? 0}ms;
  backface-visibility: hidden;
  will-change: transform, opacity;

  > button {
    max-width: 100%;
    padding: 8px 14px;
    overflow: hidden;
    font-size: 17px;
    white-space: nowrap;
  }

  > button > img {
    width: 24px;
    height: 24px;
  }

  &:nth-child(1) {
    grid-row: 2;
    grid-column: 1;
    justify-self: end;
  }

  &:nth-child(2) {
    grid-row: 1;
    grid-column: 1;
    justify-self: end;
  }

  &:nth-child(3) {
    grid-row: 1;
    grid-column: 2;
    justify-self: start;
  }

  &:nth-child(4) {
    grid-row: 2;
    grid-column: 2;
    justify-self: start;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StarRow = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const starFill = keyframes`
  0% {
    opacity: 0.25;
    transform: scale(0.55) rotate(-12deg);
  }
  62% {
    opacity: 1;
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
`;

const StarImg = styled.img`
  display: block;
  width: 32px;
  height: 32px;
  animation: ${({ $filled }) => ($filled ? starFill : 'none')} 360ms
    cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: center;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Score = styled.p`
  margin: 8px 0 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: #5a5a5b;
  text-align: center;
`;

const ScoreHint = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.14px;
  color: #adadad;
  text-align: center;
`;

const ChallengeBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 310px;
  height: 48px;
  margin: 12px auto 0;
  border: none;
  border-radius: 14px;
  background: #ffe26c;
  font-size: 16px;
  font-weight: 700;
  color: #444;
  cursor: pointer;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 1000px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  cursor: pointer;

  img {
    display: block;
    width: 24px;
    height: 24px;
  }
`;
