import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { hasUnreadNotifications, pollNotifications } from '../../api/notificationApi';
import notificationIcon from '../../assets/header/notification.svg';
import shoppingBagIcon from '../../assets/header/shopping-bag.svg';
import BackButton from '../../common/button/BackButton';
import { useUserStore } from '../../hooks/useUserStore';

const POLL_INTERVAL_MS = 5000;

function Header({ searchActive = false, onExitSearch }) {
  const userLoginNumber = useUserStore((state) => state.userLoginNumber);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!userLoginNumber) return undefined;

    let cancelled = false;

    const tick = async () => {
      try {
        const response = await pollNotifications(userLoginNumber);
        if (!cancelled) setHasUnread(hasUnreadNotifications(response));
      } catch (error) {
        console.error('알림 폴링 실패:', error);
      }
    };

    tick();
    const timerId = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timerId);
    };
  }, [userLoginNumber]);

  return (
    // 공통 상단 헤더 — 피그마 1739:5501
    <Bar $searchActive={searchActive}>
      <BackWrap $visible={searchActive} inert={searchActive ? undefined : true}>
        <BackButton onClick={() => onExitSearch?.()} />
      </BackWrap>
      <Actions>
        <IconLink to="/notifications" aria-label="알림">
          <FullIcon src={notificationIcon} alt="" />
          {hasUnread && <UnreadDot aria-hidden />}
        </IconLink>

        <IconLink to="/shopping-list" aria-label="장바구니">
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

const SEARCH_TRANSITION = '280ms cubic-bezier(0.22, 1, 0.36, 1)';

/* 피그마 아이콘 top 24 / right 20 / gap 8 — 검색 시 뒤로가기 상단 28px */
const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  flex-shrink: 0;
  height: ${({ $searchActive }) => ($searchActive ? '76px' : '62px')};
  padding: ${({ $searchActive }) => ($searchActive ? '28px 20px 0' : '24px 20px 0')};
  background: #fffefd;
  transition:
    height ${SEARCH_TRANSITION},
    padding ${SEARCH_TRANSITION};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const BackWrap = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-start;
  width: ${({ $visible }) => ($visible ? '48px' : '0')};
  height: ${({ $visible }) => ($visible ? '48px' : '0')};
  overflow: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'none' : 'scale(0.86)')};
  transform-origin: left center;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition:
    opacity ${SEARCH_TRANSITION},
    transform ${SEARCH_TRANSITION};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
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

const UnreadDot = styled.span`
  position: absolute;
  top: 0;
  left: 22px;
  width: 6px;
  height: 6px;
  border-radius: 10000px;
  background: #96d960;
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
