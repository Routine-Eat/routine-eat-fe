// 유사한 재료 요리 페이지 더미
import foodImage from '../assets/mypage/recipe-food.png';

export const SIMILAR_RECIPES = [
  {
    id: 's1',
    title: '김치 볶음밥',
    time: '15분 소요',
    cost: '1,800원',
    difficulty: 1,
    extra: '추가재료 1개',
    isSaved: true,
    image: foodImage,
    extraIngredients: [{ name: '김치', amount: '1팩' }],
    ingredients: [{ name: '밥', amount: '1공기' }],
    seasonings: [
      { name: '소금', amount: '1꼬집' },
      { name: '후추', amount: '1공기' },
      { name: '식용유', amount: '2큰술' },
      { name: '참기름', amount: '1큰술' },
    ],
  },
  {
    id: 's2',
    title: '스팸 볶음밥',
    time: '15분 소요',
    cost: '1,800원',
    difficulty: 1,
    extra: '추가재료 1개',
    isSaved: false,
    image: foodImage,
    extraIngredients: [{ name: '스팸', amount: '1캔' }],
    ingredients: [{ name: '밥', amount: '1공기' }],
    seasonings: [
      { name: '소금', amount: '1꼬집' },
      { name: '후추', amount: '1공기' },
      { name: '식용유', amount: '2큰술' },
      { name: '참기름', amount: '1큰술' },
    ],
  },
  {
    id: 's3',
    title: '계란 대파 볶음밥',
    time: '15분 소요',
    cost: '1,800원',
    difficulty: 1,
    extra: '추가재료 1개',
    isSaved: false,
    image: foodImage,
    extraIngredients: [{ name: '대파', amount: '1대' }],
    ingredients: [{ name: '밥', amount: '1공기' }],
    seasonings: [
      { name: '소금', amount: '1꼬집' },
      { name: '후추', amount: '1공기' },
      { name: '식용유', amount: '2큰술' },
      { name: '참기름', amount: '1큰술' },
    ],
  },
];
