import { Link } from 'react-router-dom';

import styled from 'styled-components';

import notificationIcon from '../../assets/header/notification.svg';
import shoppingBagIcon from '../../assets/header/shopping-bag.svg';

function Header() {
  return (
    // 공통 상단 헤더
    <Bar>
      {/* 오른쪽 아이콘 묶음 */}
      <Actions>
        {/* 알림 아이콘 */}
        <IconBtn type="button" aria-label="알림">
          <IconImg src={notificationIcon} alt="" />
        </IconBtn>
        {/* 장바구니 아이콘 */}
        <IconLink to="/shopping-list" aria-label="장바구니">
          <IconImg src={shoppingBagIcon} alt="" />
        </IconLink>
      </Actions>
    </Bar>
  );
}

/* 헤더 바 — 피그마 115px, 아이콘 top 72px */
const Bar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  height: 115px;
  padding: 72px 20px 0;
  background: #fff;
`;

/* 오른쪽 아이콘 가로 줄 */
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/* 아이콘 버튼 */
const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* 장바구니 링크 */
const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
`;

/* 아이콘 이미지 */
const IconImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export default Header;
