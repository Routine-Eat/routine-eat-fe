import styled from 'styled-components';

import backButtonImg from '../../assets/common/back-button.png';

/* 피그마 1034:2764 — 뒤로가기 버튼 48×48 */
const BTN_SIZE = 48;
/* PNG(88px) 안 원형이 ~65% → Figma 48px 원형에 맞춘 표시 크기 */
const IMG_SIZE = 74;

function BackButton({ className, disabled, onClick, ...props }) {
  return (
    <Btn
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
      aria-label="뒤로가기"
      {...props}
    >
      <BtnImg src={backButtonImg} alt="" />
    </Btn>
  );
}

/* 클릭 영역 — 가로·세로 48 (피그마 1049:2943) */
const Btn = styled.button`
  position: relative;
  box-sizing: border-box;
  width: ${BTN_SIZE}px;
  height: ${BTN_SIZE}px;
  min-width: ${BTN_SIZE}px;
  min-height: ${BTN_SIZE}px;
  border: none;
  background: transparent;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

/* PNG 여백 제거 후 원형 버튼이 48px로 보이도록 확대·중앙 정렬 */
const BtnImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${IMG_SIZE}px;
  height: ${IMG_SIZE}px;
  transform: translate(-50%, -50%);
  object-fit: cover;
  pointer-events: none;
`;

export default BackButton;
