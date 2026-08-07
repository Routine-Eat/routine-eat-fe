import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

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