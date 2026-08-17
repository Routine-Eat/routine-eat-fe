import styled from 'styled-components';

import iconBeginner from '../../../assets/onboarding/level-beginner.svg';
import iconExpert from '../../../assets/onboarding/level-expert.svg';
import iconIntermediate from '../../../assets/onboarding/level-intermediate.svg';

const LEVELS = [
  { id: 'beginner', icon: iconBeginner, title: '초보', desc: '많이 안 해봤어요' },
  { id: 'intermediate', icon: iconIntermediate, title: '중수', desc: '레시피 보면 할 수 있어요' },
  { id: 'expert', icon: iconExpert, title: '고수', desc: '먹고 싶은 요리 해먹어요' },
];

function FirstStep({ selected, onSelect }) {
  return (
    /* 1단계 본문 세로 스크롤 영역 */
    <Wrap>
      {/* 제목·부제 텍스트 세로 스택 */}
      <Header>
        {/* 메인 제목 텍스트 */}
        <Title>현재 요리 수준을 선택해주세요</Title>
        {/* 부제 텍스트(한 줄) */}
        <Subtitle>내 수준에 맞는 레시피를 추천해드릴게요.</Subtitle>
      </Header>

      {/* 초보/중수/고수 선택 카드 세로 목록 */}
      <List>
        {LEVELS.map((level) => {
          const active = selected === level.id;
          return (
            /* 수준 선택 라운드 사각형 카드(선택 시 연두) */
            <LevelBtn
              key={level.id}
              type="button"
              $active={active}
              onClick={() => onSelect(level.id)}
            >
              {/* 아이콘 + 수준명 가로 행 */}
              <LabelRow>
                {/* 수준 아이콘 정사각(24×24) */}
                <IconImg src={level.icon} alt="" />
                {/* 수준 이름 텍스트 */}
                <LevelTitle $active={active}>{level.title}</LevelTitle>
              </LabelRow>
              {/* 수준 설명 텍스트 */}
              <Desc $active={active}>{level.desc}</Desc>
            </LevelBtn>
          );
        })}
      </List>
    </Wrap>
  );
}

/* ——— 레이아웃 ——— */

/* 1단계 본문 세로 영역(패딩 포함 직사각) */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 40px 20px 140px;
`;

/* 제목·부제 세로 스택 */
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
`;

/* 메인 제목 텍스트 */
const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.48px;
  color: #030303;
`;

/* 부제 텍스트(한 줄 유지) */
const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.16px;
  color: #bebebf;
  white-space: nowrap;
`;

/* 수준 카드 세로 목록(부제↔첫 카드 간격 76px) */
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 76px;
`;

/* 수준 선택 라운드 사각형 카드(높이 72, radius 20 — 선택 시 연두 채움+테두리) */
const LevelBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  max-width: 350px;
  height: 72px;
  margin: 0 auto;
  border: ${({ $active }) => ($active ? '3px solid #c2ee73' : '1px solid #d9d9da')};
  border-radius: 20px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#fff')};
  box-shadow: ${({ $active }) =>
    $active ? '0 0 8px rgba(3, 3, 3, 0.05), 0 0 30px rgba(3, 3, 3, 0.05)' : 'none'};
  cursor: pointer;
`;

/* 아이콘+제목 가로 한 줄 */
const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

/* 수준 아이콘 정사각 이미지(24×24) */
const IconImg = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

/* 수준 이름 텍스트 */
const LevelTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#2e2e2e' : '#030303')};
`;

/* 수준 설명 텍스트 */
const Desc = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#444' : '#bebebf')};
`;

export default FirstStep;
