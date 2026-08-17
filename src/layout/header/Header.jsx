import { Link } from 'react-router-dom';

import styled from 'styled-components';

import notificationIcon from '../../assets/header/notification.svg';
import shoppingBagIcon from '../../assets/header/shopping-bag.svg';

function Header({ searchActive = false, onExitSearch }) {
  /* 피드 검색 중이면 공통 헤더 클릭 = 검색 닫기 */
  const exitIfSearching = (e) => {
    if (!searchActive) return;
    e.preventDefault();
    e.stopPropagation();
    onExitSearch?.();
  };

  return (
    // 공통 상단 헤더 — 피그마 1739:5501
    <Bar
      $searchActive={searchActive}
      onClick={exitIfSearching}
      role={searchActive ? 'button' : undefined}
      aria-label={searchActive ? '검색 닫기' : undefined}
    >
      <Actions>
        {/* Frame 293 — 30×30, 에셋이 프레임을 채움 */}
        <IconLink to="/notifications" aria-label="알림" onClick={exitIfSearching}>
          <FullIcon src={notificationIcon} alt="" />
        </IconLink>

        {/* tabler:shopping-bag — 30×30, Group inset + stroke overflow */}
        <IconLink to="/shopping-list" aria-label="장바구니" onClick={exitIfSearching}>
          <BagGroup>
            <BagOverflow>
              <FullIcon src={shoppingBagIcon} alt="" />
            </BagOverflow>
          </BagGroup>
        </IconLink>
      </Actions>
    </Bar>
  );
}

/* 피그마 아이콘 top 24 / right 20 / gap 8 — 하단 여백만 축소 */
const Bar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-shrink: 0;
  height: 62px;
  padding: 24px 20px 0;
  background: #fffefd;
  cursor: ${({ $searchActive }) => ($searchActive ? 'pointer' : 'default')};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* 피그마 아이콘 프레임 공통 30×30 */
const IconLink = styled(Link)`
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  overflow: visible;
`;

const FullIcon = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
`;

/* 피그마 Group: inset 13.33% 17.51% 13.33% 20% */
const BagGroup = styled.div`
  position: absolute;
  top: 13.33%;
  right: 17.51%;
  bottom: 13.33%;
  left: 20%;
`;

/* 피그마 stroke overflow: inset -4.55% -5.33% */
const BagOverflow = styled.div`
  position: absolute;
  inset: -4.55% -5.33%;
`;

export default Header;
