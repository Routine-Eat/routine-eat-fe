import { Link, useLocation } from 'react-router-dom';

import styled from 'styled-components';

const LINKS = [
  { to: '/', label: '홈' },
  { to: '/feed', label: '피드' },
  { to: '/market', label: '마켓' },
  { to: '/mypage', label: '마이' },
];

function BottomNav() {
  const { pathname } = useLocation();

  return (
    <Nav>
      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} $active={pathname === link.to}>
          {link.label}
        </NavLink>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 56px;
  background: #ffffff;
  border-top: 1px solid #eee;
`;

const NavLink = styled(Link)`
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#72d472' : '#777')};
`;

export default BottomNav;
