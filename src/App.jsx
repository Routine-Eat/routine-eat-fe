import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './layout/Layout';
import Feed from './pages/feed/Feed';
import Home from './pages/home/Home';
import Market from './pages/market/Market';
import Mypage from './pages/mypage/Mypage';
import Onboarding from './pages/onboarding/Onboarding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/market" element={<Market />} />
          <Route path="/mypage" element={<Mypage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
