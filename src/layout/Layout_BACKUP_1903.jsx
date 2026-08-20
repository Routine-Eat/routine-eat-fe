import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import styled from 'styled-components';

import BottomNav from '../common/bottomNav/BottomNav';
import Header from './header/Header';
import { getUserMealPlans } from '../api/mealPlanApi';
import { useUserStore } from '../hooks/useUserStore';
import { useCookingStore } from '../hooks/useCookingStore';

function Layout() {
  const { pathname } = useLocation();
  const [feedSearchMode, setFeedSearchMode] = useState(false);
  const userId = useUserStore((state) => state.userId);
  const setActiveMealPlanId = useCookingStore((state) => state.setActiveMealPlanId);


  // 피드 검색 모드 — 다른 탭으로 나가면 해제
  useEffect(() => {
    if (pathname !== '/feed') setFeedSearchMode(false);
  }, [pathname]);

<<<<<<< HEAD
  // 진행 중인 식단이 있으면 홈 대체 페이지로 쓰기 위해 조회
  useEffect(() => {
    if (!userId) return;
    getUserMealPlans(userId, 'PROGRESS')
      .then((res) => {
        const list = res.data ?? res;
        const last = list[list.length - 1];
        setActiveMealPlanId(last?.mealPlanId ?? null);
      })
      .catch((err) => console.error('진행 중인 식단 조회 실패:', err));
  }, [userId, setActiveMealPlanId]);

  // 마이페이지·마켓·레시피/유사요리·장보기·알림은 전용 상단바
=======
  // 피드는 페이지 헤더(검색·기본순)와 한 덩어리로 움직임
>>>>>>> a645c17a2c5a6c190b236a83a10c4399d84e953d
  const hideHeader =
    pathname.startsWith('/feed') ||
    pathname.startsWith('/mypage') ||
    pathname.startsWith('/market') ||
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/similar-recipes') ||
    pathname.startsWith('/cooking-records') ||
    pathname.startsWith('/shopping-list') ||
    pathname.startsWith('/notifications');
  // 상세·유사·장보기·알림은 하단 CTA만 사용
  const hideBottomNav =
    pathname.startsWith('/mypage') ||
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/similar-recipes') ||
    pathname.startsWith('/cooking-records') ||
    pathname.startsWith('/shopping-list') ||
    pathname.startsWith('/notifications');

  return (
    <AppContainer>
      {!hideHeader && (
        <Header />
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
  padding-bottom: ${({ $noNav }) => ($noNav ? 0 : '128px')};
`;

export default Layout;
