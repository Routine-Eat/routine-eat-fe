import { Outlet } from 'react-router-dom';

import BottomNav from '../common/bottomNav/BottomNav';
import Header from './header/Header';

function Layout() {
  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

export default Layout;
