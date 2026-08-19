import styled from 'styled-components';

import iconBeginner from '../../../assets/onboarding/level-beginner.png';
import iconExpert from '../../../assets/onboarding/level-expert.png';
import iconIntermediate from '../../../assets/onboarding/level-intermediate.png';

const LEVELS = [
  {
    id: 'beginner',
    icon: iconBeginner,
    title: '거의 해본 적 없어요',
    desc: '처음부터 차근차근 알려드려요',
  },
  {
    id: 'intermediate',
    icon: iconIntermediate,
    title: '레시피를 따라 할 순 있어요',
    desc: '필요한 부분만 자세히 알려드려요',
  },
  {
    id: 'expert',
    icon: iconExpert,
    title: '먹고 싶은 요리는 직접 만들어요',
    desc: '핵심 단계만 간단히 알려드려요',
  },
];

function FirstStep({ selected, onSelect }) {
  return (
    <Wrap>
      <Header>
        <Title>요리를 얼마나 해봤나요?</Title>
        <Subtitle>조리 설명을 얼마나 자세히 보여줄지 맞출게요.</Subtitle>
      </Header>

      <List>
        {LEVELS.map((level) => {
          const active = selected === level.id;
          return (
            <LevelBtn
              key={level.id}
              type="button"
              $active={active}
              onClick={() => onSelect(level.id)}
            >
              <IconTitle>
                <IconImg src={level.icon} alt="" />
                <LevelTitle $active={active}>{level.title}</LevelTitle>
              </IconTitle>
              <Desc $active={active}>{level.desc}</Desc>
            </LevelBtn>
          );
        })}
      </List>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 40px 20px 16px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.48px;
  color: #030303;
  white-space: nowrap;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.16px;
  color: #adadad;
  white-space: nowrap;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
`;

const LevelBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  max-width: 350px;
  height: 102px;
  margin: 0 auto;
  padding: 15px 0;
  box-sizing: border-box;
  border: ${({ $active }) => ($active ? '3px solid #c2ee73' : '1px solid #d9d9da')};
  border-radius: 20px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#fff')};
  box-shadow: ${({ $active }) =>
    $active ? '0 0 8px rgba(3, 3, 3, 0.05), 0 0 30px rgba(3, 3, 3, 0.05)' : 'none'};
  cursor: pointer;
`;

const IconTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const IconImg = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const LevelTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#2e2e2e' : '#030303')};
  white-space: nowrap;
`;

const Desc = styled.span`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#444' : '#adadad')};
  white-space: nowrap;
`;

export default FirstStep;
