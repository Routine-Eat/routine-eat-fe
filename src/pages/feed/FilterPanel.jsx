import { useEffect, useState } from 'react';

import styled, { keyframes } from 'styled-components';

import checkBoxIcon from '../../assets/feed/check-box.svg';
import starEmpty from '../../assets/feed/star-empty.svg';
import starFilled from '../../assets/feed/star-filled.svg';

const TIME_OPTIONS = ['15분 이하', '15분~30분', '30분 이상', '시간 상관없어요'];
const CATEGORY_OPTIONS = ['전체', '한식', '중식', '양식', '일식', '기타'];

/* 별 개수별 멘트 — Frame 323 */
const DIFF_HINTS = {
  1: '아주 간단해요',
  2: '간단한 편이에요',
  3: '과정이 조금 있어요',
  4: '과정이 많은 편이에요',
  5: '과정이 꽤 복잡해요',
};

export const DEFAULT_FILTER = {
  cookTime: '시간 상관없어요',
  difficulty: 3,
  difficultyAny: true,
  category: '전체',
};

const SHEET_MS = 360;
const SHEET_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function FilterPanel({ open, value, onApply, onClose }) {
  const [draft, setDraft] = useState(value);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    if (open) {
      setClosing(false);
      setVisible(true);
      return undefined;
    }

    setClosing(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, SHEET_MS);
    return () => clearTimeout(timer);
  }, [open]);

  if (!visible) return null;

  const patch = (next) => setDraft((prev) => ({ ...prev, ...next }));

  return (
    // 필터 오버레이 — 딤 + 바텀시트
    <Overlay $closing={closing} onClick={onClose}>
      {/* 필터 모달 — 사방 둥근 흰 사각 */}
      <Modal
        role="dialog"
        aria-label="필터"
        $closing={closing}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 바 — 가로 둥근 막대 */}
        <Handle />

        <Body>
          {/* 요리 시간 섹션 */}
          <Section>
            <SectionTitle>요리 시간</SectionTitle>
            <ChipWrap>
              {TIME_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  type="button"
                  $active={draft.cookTime === option}
                  $pad="12px"
                  onClick={() => patch({ cookTime: option })}
                >
                  {option}
                </Chip>
              ))}
            </ChipWrap>
          </Section>

          {/* 난이도 섹션 */}
          <Section>
            <SectionTitle>난이도</SectionTitle>
            <DiffBlock>
              <StarLine>
                <Stars>
                  {Array.from({ length: 5 }, (_, i) => {
                    const level = i + 1;
                    const filled = !draft.difficultyAny && draft.difficulty >= level;
                    return (
                      <StarBtn
                        key={level}
                        type="button"
                        aria-label={`난이도 ${level}`}
                        onClick={() => patch({ difficulty: level, difficultyAny: false })}
                      >
                        <StarImg src={filled ? starFilled : starEmpty} alt="" />
                      </StarBtn>
                    );
                  })}
                </Stars>
                {!draft.difficultyAny && draft.difficulty > 0 && (
                  <Hint>{DIFF_HINTS[draft.difficulty]}</Hint>
                )}
              </StarLine>

              <AnyRow type="button" onClick={() => patch({ difficultyAny: !draft.difficultyAny })}>
                {draft.difficultyAny ? <CheckImg src={checkBoxIcon} alt="" /> : <CheckEmpty />}
                <AnyLabel>난이도 상관없어요</AnyLabel>
              </AnyRow>
            </DiffBlock>
          </Section>

          {/* 카테고리 섹션 */}
          <Section>
            <SectionTitle>카테고리</SectionTitle>
            <ChipWrap>
              {CATEGORY_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  type="button"
                  $active={draft.category === option}
                  $pad="16px"
                  onClick={() => patch({ category: option })}
                >
                  {option}
                </Chip>
              ))}
            </ChipWrap>
          </Section>
        </Body>

        <Footer>
          <ResetBtn
            type="button"
            onClick={() => {
              setDraft(DEFAULT_FILTER);
            }}
          >
            선택 초기화
          </ResetBtn>
          <ApplyBtn
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            선택한 조건으로 검색
          </ApplyBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
}

export default FilterPanel;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

/* —— 딤 오버레이: 화면 full 반투명 사각 —— */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 15px 32px;
  overflow: hidden;
  background: rgba(3, 3, 3, 0.15);
  pointer-events: ${({ $closing }) => ($closing ? 'none' : 'auto')};
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} ${SHEET_MS}ms ease both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* —— 필터 모달: 사방 둥근 흰 사각 360 —— */
const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 29px;
  width: 100%;
  max-width: 360px;
  max-height: calc(100dvh - 64px);
  overflow-y: auto;
  padding: 48px 24px 32px;
  border-radius: 30px;
  background: #fff;
  box-shadow:
    0 0 10px 0 rgba(3, 3, 3, 0.12),
    0 0 40px 0 rgba(3, 3, 3, 0.25);
  animation: ${({ $closing }) => ($closing ? slideDown : slideUp)} ${SHEET_MS}ms ${SHEET_EASE} both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* —— 핸들: 가로 둥근 막대 —— */
const Handle = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  width: 48px;
  height: 4px;
  border-radius: 34px;
  background: #d9d9da;
  transform: translateX(-50%);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const SectionTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #2e2e2e;
`;

const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

/* —— 칩: 둥근 사각 선택 버튼 —— */
const Chip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 8px ${({ $pad }) => $pad};
  border: ${({ $active }) => ($active ? '2px solid #c2ee73' : '2px solid transparent')};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#d6f3a1' : '#f5f5f6')};
  box-shadow: ${({ $active }) => ($active ? 'inset 0 0 4.8px 0 #fff' : 'none')};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: ${({ $active }) => ($active ? '#444' : '#727272')};
  cursor: pointer;
`;

const DiffBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const StarLine = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarBtn = styled.button`
  display: flex;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const StarImg = styled.img`
  display: block;
  width: 28px;
  height: 28px;
`;

const Hint = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  color: #8b8b8b;
  white-space: nowrap;
`;

const AnyRow = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* —— 체크 빈칸: 20×20 둥근 사각 —— */
const CheckEmpty = styled.span`
  display: block;
  width: 20px;
  height: 20px;
  border: 0.5px solid #bebebf;
  border-radius: 5px;
  background: #f5f5f6;
  box-sizing: border-box;
`;

const CheckImg = styled.img`
  display: block;
  width: 20px;
  height: 20px;
`;

const AnyLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: #8b8b8b;
`;

const Footer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const ResetBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 48px;
  flex-shrink: 0;
  border: none;
  border-radius: 10px;
  background: #f5f5f6;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: #8b8b8b;
  cursor: pointer;
`;

const ApplyBtn = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #96D960;
  font-family: 'Wanted Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-variation-settings: 'wght' 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
`;
