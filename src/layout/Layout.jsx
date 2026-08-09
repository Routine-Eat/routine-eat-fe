import { Outlet, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import BottomNav from '../common/bottomNav/BottomNav';
import Header from './header/Header';

function Layout() {
  const { pathname } = useLocation();
  // 마이페이지는 전용 상단바를 쓰므로 공통 Header 숨김
  // 마이페이지·레시피/유사요리/장보기 상세는 전용 상단바
  const hideHeader =
    pathname.startsWith('/mypage') ||
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/similar-recipes') ||
    pathname.startsWith('/shopping-list');
  // 상세·유사·장보기는 하단 CTA만 사용
  const hideBottomNav =
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/similar-recipes') ||
    pathname.startsWith('/shopping-list');

  return (
    <AppContainer>
      {!hideHeader && <Header />}
      <Main $noNav={hideBottomNav}>
        <Outlet />
      </Main>
      {!hideBottomNav && <BottomNav />}
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
