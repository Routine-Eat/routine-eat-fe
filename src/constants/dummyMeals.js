// 나중에 API로 교체할 더미 식단 데이터
import mealImage from '../assets/mypage/meal-herb.png';

export const DUMMY_MEALS = [
  {
    id: 'm1',
    title: '채소 식단',
    description: '지난주 영양 밸런스를 반영한 채소 위주의 식단',
    image: mealImage,
    isSaved: true,
    isRecord: false,
  },
  {
    id: 'm2',
    title: '채소 식단',
    description: '지난주 영양 밸런스를 반영한 채소 위주의 식단',
    image: mealImage,
    isSaved: true,
    isRecord: false,
  },
  {
    id: 'm3',
    title: '채소 식단',
    description: '지난주 영양 밸런스를 반영한 채소 위주의 식단',
    image: mealImage,
    isSaved: true,
    isRecord: true,
    date: '7월 28일',
    progress: '5/5끼',
  },
  {
    id: 'm4',
    title: '단백질 식단',
    description: '고단백 위주로 구성한 한 끼 식단',
    image: mealImage,
    isSaved: false,
    isRecord: true,
    date: '7월 29일',
    progress: '4/5끼',
  },
  {
    id: 'm5',
    title: '단백질 식단',
    description: '고단백 위주로 구성한 한 끼 식단',
    image: mealImage,
    isSaved: true,
    isRecord: true,
    date: '7월 30일',
    progress: '3/5끼',
  },
];
