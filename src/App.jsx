import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomeMenu from "./pages/home/HomeMenu";
import Layout from './layout/Layout';
import Feed from './pages/feed/Feed';
import Home from './pages/home/Home';
import Market from './pages/market/Market';
import Mypage from './pages/mypage/Mypage';
import RecipeDetail from './pages/recipe/RecipeDetail';
import SimilarRecipe from './pages/recipe/SimilarRecipe';
import ShoppingList from './pages/shopping/ShoppingList';
import HomeDietStart from './pages/home/HomeDietStart';
import HomeCooking from "./pages/home/HomeCooking";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/onboarding" element={<Onboarding />} /> */}

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/similar-recipes/:id" element={<SimilarRecipe />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/market" element={<Market />} />
          <Route path="/mypage" element={<Mypage />} />
        </Route>
        <Route path="/menu/:mealId" element={<HomeMenu />} />
        <Route path="/diet-start/:mealId" element={<HomeDietStart />} />
        <Route path="/cooking/:mealId" element={<HomeCooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
