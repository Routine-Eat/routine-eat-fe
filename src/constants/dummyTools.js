import fireIcon from '../assets/onboarding/tools/fire.svg';
import knifeIcon from '../assets/onboarding/tools/knife.svg';
import panIcon from '../assets/onboarding/tools/pan.svg';

/* 마이페이지 도구 — 등록완료한 항목만 표시 (초기 목록 없음) */
export const TOOL_SECTIONS = [
  {
    id: 'appliance',
    label: '조리기기',
    icon: fireIcon,
    catalog: [
      { id: 'gas', name: '가스레인지' },
      { id: 'microwave', name: '전자레인지' },
      { id: 'oven', name: '오븐' },
      { id: 'ricecooker', name: '밥솥' },
      { id: 'airfryer', name: '에어프라이어' },
    ],
  },
  {
    id: 'basic',
    label: '기본 조리도구',
    icon: panIcon,
    catalog: [
      { id: 'pan', name: '프라이팬' },
      { id: 'pot', name: '냄비' },
      { id: 'blender', name: '믹서기' },
    ],
  },
  {
    id: 'prep',
    label: '준비·손질 도구',
    icon: knifeIcon,
    catalog: [
      { id: 'board', name: '도마' },
      { id: 'knife', name: '칼/가위' },
      { id: 'sieve', name: '채망' },
    ],
  },
];

export const TOOL_MODAL = {
  appliance: {
    title: '조리기기 등록',
    placeholder: '조리기기명으로 검색',
    empty: '조리기기',
  },
  basic: {
    title: '기본 조리도구 등록',
    placeholder: '조리도구명으로 검색',
    empty: '기본 조리도구',
  },
  prep: {
    title: '준비·손질 도구 등록',
    placeholder: '손질도구명으로 검색',
    empty: '준비·손질 도구',
  },
};
