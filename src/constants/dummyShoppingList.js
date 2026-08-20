import cabbageKimchiImg from '../assets/shopping/cabbage-kimchi.png';
import oysterSauceImg from '../assets/shopping/oyster-sauce.png';
import steviaTomatoesImg from '../assets/shopping/stevia-tomatoes.png';

// 장보기 목록 더미 — 피그마 1854:2899
export const OTHER_GROUP_ID = 'g-other';

export const SHOPPING_GROUPS = [
  {
    id: OTHER_GROUP_ID,
    title: '기타',
    items: [],
  },
];

export const MARKET_PRODUCTS = [
  { id: 'p1', name: '만능 굴소스', price: '8,500원', liked: false, image: oysterSauceImg },
  {
    id: 'p2',
    name: '종갓집 배추 김치',
    price: '15,500원',
    liked: false,
    image: cabbageKimchiImg,
  },
  {
    id: 'p3',
    name: '탄탄한 스테비아 토마토',
    price: '9,500원',
    liked: false,
    image: steviaTomatoesImg,
  },
];
