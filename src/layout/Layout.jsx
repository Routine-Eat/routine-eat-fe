import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import BottomNav from '../common/bottomNav/BottomNav';
import Header from './header/Header';

function Layout() {
  return (
    <AppContainer>
      <Header />
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
width: 100%;
max-width: 480px;
min-height: 100dvh;
`;

const Main = styled.main`
flex: 1;
`;

export default Layout;
