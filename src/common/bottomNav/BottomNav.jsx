import { Link, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import navFeed from '../../assets/icons/nav/nav-feed.svg';
import navFeedActive from '../../assets/icons/nav/nav-feed-active.svg';
import navHome from '../../assets/icons/nav/nav-home.svg';
import navHomeActive from '../../assets/icons/nav/nav-home-active.svg';
import navMarket from '../../assets/icons/nav/nav-market.svg';
import navMarketActive from '../../assets/icons/nav/nav-market-active.svg';
import navMypage from '../../assets/icons/nav/nav-mypage.svg';
import navMypageActive from '../../assets/icons/nav/nav-mypage-active.svg';

const LINKS = [
  { to: '/', label: '홈', icon: navHome, activeIcon: navHomeActive },
  { to: '/feed', label: '둘러보기', icon: navFeed, activeIcon: navFeedActive },
  { to: '/mypage', label: '마이', icon: navMypage, activeIcon: navMypageActive },
  { to: '/market', label: '마켓', icon: navMarket, activeIcon: navMarketActive },
];

function BottomNav({ feedSearchActive = false, onExitFeedSearch }) {
  const { pathname } = useLocation();

  return (
    <Nav>
      {LINKS.map((link) => {
        const isFeed = link.to === '/feed';
        const active = pathname === link.to;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            $active={active}
            onClick={(e) => {
              if (isFeed && feedSearchActive && pathname === '/feed') {
                e.preventDefault();
                onExitFeedSearch?.();
              }
            }}
          >
            <IconWrap>
              <img src={active ? link.activeIcon : link.icon} alt="" />
            </IconWrap>
            {link.label}
          </NavLink>
        );
      })}
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  width: 316px;
  height: 72px;
  padding: 4px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 10000px;
  box-shadow:
    0px 0px 10px 0px rgba(3, 3, 3, 0.06),
    0px 0px 40px 0px rgba(3, 3, 3, 0.08);
`;

const NavLink = styled(Link)`
  flex: 1;
  height: 64px;
  border-radius: 46px;
  background: ${({ $active }) => ($active ? '#e9e9e9' : 'transparent')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 11px;
  gap: 7px;
  text-decoration: none;
  color: #030303;
  font-size: 11px;
  font-family: 'Wanted Sans Variable', sans-serif;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  letter-spacing: -0.11px;
  line-height: 1.3;
  white-space: nowrap;
`;

const IconWrap = styled.span`
  width: 29px;
  height: 24px;
  overflow: clip;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
`;

export default BottomNav;
