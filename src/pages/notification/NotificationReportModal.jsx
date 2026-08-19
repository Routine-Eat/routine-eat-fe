import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { getUserStatistics } from '../../api/userApi';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';
import closeX from '../../assets/notification/close-x.svg';
import ingDumpling from '../../assets/notification/ing-dumpling.svg';
import ingEgg from '../../assets/notification/ing-egg.svg';
import ingMeat from '../../assets/notification/ing-meat.svg';
import ingOnion from '../../assets/notification/ing-onion.svg';
import starEmpty from '../../assets/notification/star-empty.svg';
import starFilled from '../../assets/notification/star-filled.svg';

const DUMMY_REPORT = {
  count: 10,
  recipes: ['계란 야채 볶음밥', '매운 오징어덮밥', '진한 양파 짜장면'],
  ingredients: [
    { name: '양파', icon: ingOnion, rotate: 11.8 },
    { name: '달걀', icon: ingEgg, rotate: -11.23 },
    { name: '만두', icon: ingDumpling, rotate: 4.07 },
    { name: '우삼겹', icon: ingMeat, rotate: 0 },
  ],
  difficulty: 3,
};

const INGREDIENT_ICONS = [
  { keys: ['양파'], icon: ingOnion },
  { keys: ['달걀', '계란'], icon: ingEgg },
  { keys: ['만두'], icon: ingDumpling },
  { keys: ['우삼겹', '고기'], icon: ingMeat },
];

const ROTATES = [11.8, -11.23, 4.07, 0];

const iconForName = (name = '') => {
  const found = INGREDIENT_ICONS.find((item) => item.keys.some((key) => name.includes(key)));
  return found?.icon ?? ingOnion;
};

function NotificationReportModal({ contentId, onClose }) {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const [step, setStep] = useState(0);
  const [report, setReport] = useState(DUMMY_REPORT);

  useEffect(() => {
    if (!userId || !contentId) return undefined;

    const fetchReport = async () => {
      try {
        const response = await getUserStatistics(userId, contentId);
        const payload = response.data ?? response;
        const recipes = (payload.recipeReport?.recipeList ?? []).map((item) => item.recipeName);
        const ingredients = (payload.mostUsedFoodIngredientList ?? []).map((item, index) => ({
          name: item.foodIngredientName,
          icon: iconForName(item.foodIngredientName),
          rotate: ROTATES[index % ROTATES.length],
        }));
        const difficulty = Number(String(payload.averageDifficultyLevel ?? '').replace('LEVEL_', ''));

        setReport({
          count: payload.recipeReport?.count ?? DUMMY_REPORT.count,
          recipes: recipes.length ? recipes : DUMMY_REPORT.recipes,
          ingredients: ingredients.length ? ingredients : DUMMY_REPORT.ingredients,
          difficulty: Number.isFinite(difficulty) && difficulty > 0 ? difficulty : DUMMY_REPORT.difficulty,
        });
      } catch (error) {
        console.error('사용자 통계 조회 실패:', error);
        setReport(DUMMY_REPORT);
      }
    };

    fetchReport();
  }, [userId, contentId]);

  return (
    <Overlay onClick={onClose}>
      <Stage onClick={(e) => e.stopPropagation()}>
        {step > 0 && (
          <SideBtn $side="left">
            <BackButton aria-label="이전" onClick={() => setStep((prev) => prev - 1)} />
          </SideBtn>
        )}

        <Card $tall={step === 0}>
          {step === 0 && (
            <>
              <CardTitle>여태까지 루틴잇을 통해</CardTitle>
              <CountRow>
                <CountChip>{report.count}개</CountChip>
                <CountText>의 레시피를 요리했어요</CountText>
              </CountRow>
              <RecipeList>
                {report.recipes.slice(0, 3).map((name, index) => (
                  <RecipeChip key={`${name}-${index}`}>{name}</RecipeChip>
                ))}
              </RecipeList>
            </>
          )}

          {step === 1 && (
            <>
              <CardTitle>최근 가장 많이 요리한 재료는?</CardTitle>
              <IngredientField>
                {report.ingredients.slice(0, 4).map((item) => (
                  <IngChip key={item.name} $rotate={item.rotate}>
                    <IngIcon src={item.icon} alt="" />
                    {item.name}
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
                    key={i}
                    src={i < report.difficulty ? starFilled : starEmpty}
                    alt=""
                  />
                ))}
              </StarRow>
              <Score>{report.difficulty}점</Score>
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
        onClick={onClose}
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

const Card = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 350px;
  height: ${({ $tall }) => ($tall ? '288px' : '286px')};
  padding: 44px 20px 20px;
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(107, 56, 0, 0.06),
    0 0 40px 0 rgba(97, 51, 0, 0.05),
    inset 0 0 5px 0 #fff;
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
  gap: 8px;
  align-items: center;
  margin-top: 20px;
`;

const RecipeChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 268px;
  height: 48px;
  border-radius: 14px;
  background: #fff6b4;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.16px;
  color: #481c00;
`;

const IngredientField = styled.div`
  position: relative;
  height: 160px;
  margin-top: 28px;
`;

const IngChip = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 15px;
  border-radius: 1000px;
  background: #fff;
  box-shadow:
    0 0 8px 0 rgba(3, 3, 3, 0.05),
    0 0 30px 0 rgba(3, 3, 3, 0.05);
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  transform: rotate(${({ $rotate }) => $rotate}deg);

  &:nth-child(1) {
    left: 25px;
    top: 84px;
  }

  &:nth-child(2) {
    left: 92px;
    top: 32px;
  }

  &:nth-child(3) {
    left: 220px;
    top: 32px;
  }

  &:nth-child(4) {
    left: 170px;
    top: 90px;
  }
`;

const IngIcon = styled.img`
  display: block;
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const StarRow = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const StarImg = styled.img`
  display: block;
  width: 32px;
  height: 32px;
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
