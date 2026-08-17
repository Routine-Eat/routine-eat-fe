import styled from 'styled-components';

import backChevron from '../../assets/common/back-chevron.svg';

/** 뒤로가기 — 피그마 1863:3788, 48×48 원형 */
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
      <Icon src={backChevron} alt="" />
    </Btn>
  );
}

/* —— 원형 버튼: 48×48 흰 원 + 그림자 —— */
const Btn = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  padding: 0;
  border: none;
  border-radius: 1000px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

/* —— 화살표 아이콘: 24×24 정사각 —— */
const Icon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  pointer-events: none;
`;

export default BackButton;
