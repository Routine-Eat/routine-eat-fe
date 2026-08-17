import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Layout from './layout/Layout';
import Feed from './pages/feed/Feed';
import CookingComplete from './pages/home/CookingComplete';
import CookingIngredientCheck from './pages/home/CookingIngredientCheck.jsx';
import CookingReview from './pages/home/CookingReview';
import Home from './pages/home/Home';
import HomeCooking from './pages/home/HomeCooking';
import HomeCookingStep from './pages/home/HomeCookingStep';
import HomeDietStart from './pages/home/HomeDietStart';
import HomeMenu from './pages/home/HomeMenu';
import Market from './pages/market/Market';
import Mypage from './pages/mypage/Mypage';
import Notification from './pages/notification/Notification';
import Onboarding from './pages/onboarding/Onboarding';
import RecipeDetail from './pages/recipe/RecipeDetail';
import SimilarRecipe from './pages/recipe/SimilarRecipe';
import ShoppingList from './pages/shopping/ShoppingList';
import { isOnboardingComplete } from './utils/onboarding';

/** 온보딩은 앱 최초 1회만 — 미완료면 온보딩, 완료 후 /onboarding 재진입은 홈으로 */
function OnboardingGate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const done = isOnboardingComplete();

    if (!done && pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
      return;
    }

    if (done && pathname === '/onboarding') {
      navigate('/', { replace: true });
    }
  }, [navigate, pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <OnboardingGate />

      <Routes>
        {/* 온보딩 */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Layout이 적용되는 페이지 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/similar-recipes/:id" element={<SimilarRecipe />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/market" element={<Market />} />
          <Route path="/mypage" element={<Mypage />} />
        </Route>

        {/* 홈 → 요리 진행 관련 페이지 */}
        <Route path="/menu/:mealId" element={<HomeMenu />} />
        <Route path="/diet-start/:mealId" element={<HomeDietStart />} />
        <Route path="/cooking/:mealId" element={<HomeCooking />} />
        <Route path="/cooking/:mealId/step" element={<HomeCookingStep />} />
        <Route path="/cooking/:mealId/complete" element={<CookingComplete />} />
        <Route path="/cooking/:mealId/review" element={<CookingReview />} />
        <Route path="/cooking/:mealId/review/ingredients" element={<CookingIngredientCheck />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
