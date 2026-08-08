import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
position: absolute;
bottom: 0;
left: 0;
right: 0;
display: flex;
justify-content: space-around;    
`;

function BottomNav() {
  return (
    <Nav>
      <Link to="/">홈</Link>
      <Link to="/feed">피드</Link>
      <Link to="/market">마켓</Link>
      <Link to="/mypage">마이</Link>
    </Nav>
  );
}

export default BottomNav;