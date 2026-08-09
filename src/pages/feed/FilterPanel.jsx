import styled from 'styled-components';

import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';

/* 피그마 423:1087 — 요리 시간 옵션 (디자인상 세 번째도 15분) */
const TIME_OPTIONS = ['10분', '15분', '15분'];
const CATEGORY_OPTIONS = ['전체', '한식', '중식', '일식', '양식', '기타'];

function FilterPanel({ cookTime, difficulty, category, onChange }) {
  return (
    // 필터 패널 — 피그마 270×198
    <Panel role="dialog" aria-label="필터">
      <Group>
        <GroupTitle>요리 시간</GroupTitle>
        <OptionRow>
          {TIME_OPTIONS.map((option, index) => {
            const selected = cookTime?.label === option && cookTime?.index === index;
            return (
              <TextOption
                key={`time-${index}`}
                type="button"
                $active={selected}
                onClick={() =>
                  onChange({
                    cookTime: selected ? null : { label: option, index },
                  })
                }
              >
                {option}
              </TextOption>
            );
          })}
        </OptionRow>
      </Group>

      <Group>
        <GroupTitle>난이도</GroupTitle>
        <StarRow>
          {Array.from({ length: 5 }, (_, i) => {
            const level = i + 1;
            const filled = difficulty !== null && level <= difficulty;
            return (
              <StarBtn
                key={level}
                type="button"
                aria-label={`난이도 ${level}`}
                aria-pressed={difficulty === level}
                onClick={() =>
                  onChange({
                    difficulty: difficulty === level ? null : level,
                  })
                }
              >
                <StarIcon src={filled ? starFilled : starEmpty} alt="" />
              </StarBtn>
            );
          })}
        </StarRow>
      </Group>

      <Group>
        <GroupTitle>카테고리</GroupTitle>
        <OptionRow>
          {CATEGORY_OPTIONS.map((option) => (
            <TextOption
              key={option}
              type="button"
              $active={category === option}
              onClick={() => onChange({ category: option })}
            >
              {option}
            </TextOption>
          ))}
        </OptionRow>
      </Group>
    </Panel>
  );
}

export default FilterPanel;

/* 피그마 필터 패널 프레임 */
const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  box-sizing: border-box;
  width: 270px;
  padding: 17px 20px 19px;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(107, 56, 0, 0.06),
    0 0 40px 0 rgba(97, 51, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupTitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
  color: #000;
`;

const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const TextOption = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#72d472' : '#000')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
`;

const StarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;

const StarBtn = styled.button`
  display: flex;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const StarIcon = styled.img`
  width: 15px;
  height: 15px;
`;
