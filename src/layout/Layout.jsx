import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import BottomNav from '../common/bottomNav/BottomNav';
import Header from './header/Header';

function Layout() {
  const { pathname } = useLocation();
  const [feedSearchMode, setFeedSearchMode] = useState(false);

  // 피드 검색 모드 — 다른 탭으로 나가면 해제
  useEffect(() => {
    if (pathname !== '/feed') setFeedSearchMode(false);
  }, [pathname]);

  // 마이페이지·레시피/유사요리/장보기·알림은 전용 상단바
  const hideHeader =
    pathname.startsWith('/mypage') ||
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/similar-recipes') ||
    pathname.startsWith('/cooking-records') ||
    pathname.startsWith('/shopping-list') ||
    pathname.startsWith('/notifications');
  // 상세·유사·장보기·알림은 하단 CTA만 사용
  const hideBottomNav =
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/similar-recipes') ||
    pathname.startsWith('/cooking-records') ||
    pathname.startsWith('/shopping-list') ||
    pathname.startsWith('/notifications');

  return (
    <AppContainer>
      {!hideHeader && (
        <Header searchActive={feedSearchMode} onExitSearch={() => setFeedSearchMode(false)} />
      )}
      <Main $noNav={hideBottomNav}>
        <Outlet context={{ feedSearchMode, setFeedSearchMode }} />
      </Main>
      {!hideBottomNav && (
        <BottomNav
          feedSearchActive={feedSearchMode}
          onExitFeedSearch={() => setFeedSearchMode(false)}
        />
      )}
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
  padding-bottom: ${({ $noNav }) => ($noNav ? 0 : '56px')};
`;

export default Layout;
