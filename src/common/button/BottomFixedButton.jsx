import styled from "styled-components";

const StyledButton = styled.button`
  ${({ $variant }) =>
    $variant === "inline"
      ? `
    display: block;
    width: 100%;
    margin: 80px auto 0;
  `
      : `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 48px);
    z-index: 1;
  `}
  max-width: 342px;
  height: 52px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-family: Wanted Sans Variable;
  font-weight: 600;
  letter-spacing: -0.18px;
  box-shadow: 0px 0px 10px 0px rgba(3, 3, 3, 0.06), 0px 0px 40px 0px rgba(3, 3, 3, 0.08);
  background: ${({ $disabled }) => ($disabled ? "#e0e0e0" : "#96D960")};
  color: ${({ $disabled }) => ($disabled ? "#a0a0a0" : "white")};
  transition:
    transform 100ms ease,
    background-color 100ms ease,
    color 100ms ease,
    font-size 100ms ease;
  transform-origin: center;

  &:disabled {
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background: #36a73c;
    color: #c6f5a6;
    font-size: 17px;
    transform: ${({ $variant }) =>
      $variant === "inline" ? "scale(0.97)" : "translateX(-50%) scale(0.97)"};
  }
`;

export default function BottomFixedButton({
  children,
  onClick,
  disabled = false,
  variant = "fixed",
}) {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $disabled={disabled}
      $variant={variant}
    >
      {children}
    </StyledButton>
  );
}