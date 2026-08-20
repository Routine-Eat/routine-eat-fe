import styled from 'styled-components';

import plateIcon from '../../assets/mypage/plate.png';

function MarketBrowseButton({ onClick }) {
  return (
    <Btn type="button" onClick={onClick}>
      <Icon src={plateIcon} alt="" />
      마켓에서 재료 둘러보기
    </Btn>
  );
}

export default MarketBrowseButton;

const Btn = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 4px;
  width: 342px;
  max-width: 100%;
  height: 56px;
  padding: 14px 0;
  margin: 0 auto;
  border: 1px solid #bebebf;
  border-radius: 12px;
  background: #fff;
  box-shadow: inset 0 0 4px #fff;
  overflow: hidden;
  font-family: inherit;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: #2e2e2e;
  cursor: pointer;
`;

const Icon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
`;
