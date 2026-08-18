// 유사한 재료 요리 페이지 더미
import foodImage from '../assets/mypage/recipe-food.png';

const INGREDIENTS = [
  { name: '밥', amount: '1공기' },
  { name: '달걀', amount: '2개' },
  { name: '당근', amount: '1/3개' },
  { name: '양파', amount: '1/2개' },
  { name: '대파', amount: '1/2개' },
];

const SEASONINGS = [
  { name: '소금', amount: '조금' },
  { name: '후추', amount: '조금' },
  { name: '식용유', amount: '2큰술' },
  { name: '참기름', amount: '1큰술' },
];

export const SIMILAR_RECIPES = [
  {
    id: 's1',
    title: '김치 볶음밥',
    time: '15분 소요',
    cost: '약 3,500원',
    difficulty: 2,
    utilization: '재료 활용률 72%',
    extra: '추가재료 1개',
    isSaved: true,
    image: foodImage,
    extraIngredients: [{ name: '김치', amount: '1팩' }],
    ingredients: INGREDIENTS,
    seasonings: SEASONINGS,
  },
  {
    id: 's2',
    title: '계란 대파 볶음밥',
    time: '15분 소요',
    cost: '약 3,500원',
    difficulty: 2,
    utilization: '재료 활용률 72%',
    extra: '추가재료 2개',
    isSaved: false,
    image: foodImage,
    extraIngredients: [
      { name: '대파', amount: '1대' },
      { name: '계란', amount: '2개' },
    ],
    ingredients: INGREDIENTS,
    seasonings: SEASONINGS,
  },
  {
    id: 's3',
    title: '스팸 볶음밥',
    time: '15분 소요',
    cost: '약 3,500원',
    difficulty: 2,
    utilization: '재료 활용률 72%',
    extra: '추가재료 1개',
    isSaved: false,
    image: foodImage,
    extraIngredients: [{ name: '스팸', amount: '1캔' }],
    ingredients: INGREDIENTS,
    seasonings: SEASONINGS,
  },
];
