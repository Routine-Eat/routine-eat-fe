// 장보기 목록 더미 — 피그마 1854:2899
export const OTHER_GROUP_ID = 'g-other';

export const SHOPPING_GROUPS = [
  {
    id: 'g1',
    title: '김치 볶음밥',
    items: [{ id: 'i1', name: '배추김치 150g', amount: '1팩' }],
  },
  {
    id: 'g2',
    title: '토마토 달걀 볶음',
    items: [
      { id: 'i2', name: '토마토', amount: '1팩' },
      { id: 'i3', name: '굴소스', amount: '1병' },
    ],
  },
  {
    id: OTHER_GROUP_ID,
    title: '기타',
    items: [],
  },
];

export const MARKET_PRODUCTS = [
  { id: 'p1', name: '만능 굴소스', price: '8,500원', liked: true },
  { id: 'p2', name: '종갓집 배추 김치', price: '15,500원', liked: false },
  { id: 'p3', name: '탄탄한 스테비아 토마토', price: '9,500원', liked: false },
];
