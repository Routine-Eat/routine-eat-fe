import { Outlet, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import BottomNav from '../common/bottomNav/BottomNav';
import Header from './header/Header';

function Layout() {
  const { pathname } = useLocation();
  // 마이페이지는 전용 상단바를 쓰므로 공통 Header 숨김
  const hideHeader = pathname.startsWith('/mypage');

  return (
    <AppContainer>
      {!hideHeader && <Header />}
      <Main>
        <Outlet />
      </Main>
      <BottomNav />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: 56px; /* 하단 네비 높이 */
`;

export default Layout;
