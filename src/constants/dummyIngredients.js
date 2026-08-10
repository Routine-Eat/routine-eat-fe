// 나중에 API로 교체할 더미 재료 데이터
import cheese from '../assets/mypage/cheese.svg';
import dumpling from '../assets/mypage/dumpling.svg';
import egg from '../assets/mypage/egg.svg';
import iceCream from '../assets/mypage/ice-cream.svg';
import meat from '../assets/mypage/meat.svg';
import milk from '../assets/mypage/milk.png';
import onion from '../assets/mypage/onion.svg';
import seasoning from '../assets/mypage/seasoning.svg';
import tuna from '../assets/mypage/tuna.svg';

export const CATEGORY_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'fresh', label: '신선식품' },
  { id: 'processed', label: '가공식품' },
  { id: 'seasoning', label: '조미료/양념' },
];

export const DUMMY_INGREDIENTS = [
  { id: 'milk', name: '우유', amount: '1팩', category: 'fresh', icon: milk },
  { id: 'beef', name: '우삼겹', amount: '1팩', category: 'fresh', icon: meat },
  { id: 'onion', name: '양파', amount: '1팩', category: 'fresh', icon: onion },
  { id: 'cheese', name: '치즈', amount: '1팩', category: 'fresh', icon: cheese },
  { id: 'egg', name: '계란', amount: '1팩', category: 'fresh', icon: egg },
  { id: 'dumpling', name: '만두', amount: '1팩', category: 'processed', icon: dumpling },
  { id: 'tuna', name: '참치캔', amount: '1팩', category: 'processed', icon: tuna },
  { id: 'ice-cream', name: '아이스크림', amount: '1팩', category: 'processed', icon: iceCream },
  { id: 'gochujang', name: '고추장', amount: '1팩', category: 'seasoning', icon: seasoning },
  { id: 'soy', name: '간장', amount: '1팩', category: 'seasoning', icon: seasoning },
  { id: 'oyster', name: '굴소스', amount: '1팩', category: 'seasoning', icon: seasoning },
  { id: 'stock', name: '치킨스톡', amount: '1팩', category: 'seasoning', icon: seasoning },
];

export const SECTION_META = [
  { id: 'fresh', label: '신선식품' },
  { id: 'processed', label: '가공식품' },
  { id: 'seasoning', label: '조미료&양념' },
];
