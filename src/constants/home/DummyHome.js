import eggFoodImg from "../../assets/images/EggFood.svg";
import vegetableImg from "../../assets/images/Vegetable.svg";
import meatImg from "../../assets/images/Meat.svg";
import cheeseImg from "../../assets/images/cheese.svg";
import milkImg from "../../assets/images/milk.svg";
import onionImg from "../../assets/images/onion.svg";
import dumplingImg from "../../assets/images/dumpling.svg";
import icecreamImg from "../../assets/images/ice cream.svg";
import eggImg from "../../assets/images/egg.svg";
import alarmIcon from "../../assets/icons/alarm.svg";
import liftingIcon from "../../assets/icons/lifting.svg";
import graphIcon from "../../assets/icons/graph.svg";
import sparkleIcon from "../../assets/icons/sparkle.svg";

export const DUMMY_DISHES = [
  { id: 1, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 1, image: eggFoodImg, matchRate: null },
  { id: 2, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 4, image: eggFoodImg, matchRate: 88 },
  { id: 3, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 2, image: eggFoodImg, matchRate: null },
  { id: 4, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 3, image: eggFoodImg, matchRate: 65 },
  { id: 5, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 1, image: eggFoodImg, matchRate: null },
];

export const DUMMY_ENERGY_LEVELS = ["의욕 넘침", "보통", "귀찮음"];

export const DUMMY_MEALS = [
  { id: 1, name: "채소 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: true, image: vegetableImg },
  { id: 2, name: "단백질 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: true, image: meatImg },
  { id: 3, name: "채소 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: false, image: vegetableImg },
  { id: 4, name: "채소 식단", desc: "지난주 영양 밸런스를 반영한 채소 위주의 식단", liked: true, image: vegetableImg },
];

export const DUMMY_INGREDIENT_CATEGORIES = [
  {
    title: "신선식품",
    items: [
      { id: "milk", name: "우유", qty: "1팩", icon: milkImg },
      { id: "beef", name: "우삼겹", qty: "1팩", icon: meatImg },
      { id: "onion", name: "양파", qty: "1팩", icon: onionImg },
      { id: "cheese", name: "치즈", qty: "1팩", icon: cheeseImg },
      { id: "egg", name: "계란", qty: "1팩", icon: eggImg },
    ],
  },
  {
    title: "가공식품",
    items: [
      { id: "dumpling1", name: "만두", qty: "1팩", icon: dumplingImg },
      { id: "tuna1", name: "참치캔", qty: "1팩", icon: null },
      { id: "dumpling2", name: "만두", qty: "1팩", icon: dumplingImg },
      { id: "icecream", name: "아이스크림", qty: "1팩", icon: icecreamImg },
      { id: "tuna2", name: "참치캔", qty: "1팩", icon: null },
      { id: "dumpling3", name: "만두", qty: "1팩", icon: dumplingImg },
      { id: "dumpling4", name: "만두", qty: "1팩", icon: dumplingImg },
    ],
  },
];

export const DUMMY_DIET_PROGRESS = [
  { id: 1, name: "시금치 계란볶음", status: "8월 1일", completed: true, image: eggFoodImg },
  { id: 2, name: "계란 야채 볶음밥", status: "예정", completed: false, image: eggFoodImg },
  { id: 3, name: "계란 샌드위치", status: "예정", completed: false, image: eggFoodImg },
  { id: 4, name: "해물 야채 볶음밥", status: "예정", completed: false, image: eggFoodImg },
  { id: 5, name: "토마토 달걀 볶음", status: "예정", completed: false, image: eggFoodImg },
];

export const DUMMY_COOKING_STEPS = [
  {
    title: "재료 준비하기1",
    body: ["손질한 오징어를 링기에 넣고 2분간 쪄준", "뒤, 건져서 식혀주세요."],
    link1: "쪄주는 팁을 알려주는 링크 있으면 넣기",
    body2: "",
    link2: "",
    ingredients: ["양파 반 개", "양배추 1/4개", "대파 반 개"],
  },
  {
    title: "재료 준비하기2",
      bodySegments: [
      { text: "손질한 오징어를 찜기에 넣고 ", bold: false },
      { text: "2분간 쪄준 뒤, 건져서 식혀주세요.", bold: true },
    ],
    tip: "쪄주면 볶을 때 물이 생기는 것을 방지할 수 있어요.",
    ingredients: ["양파 반 개", "양배추 1/4개", "대파 반 개"],
  },
  {
    title: "오징어 양념하기",
    body: ["식힌 오징어를 먹기 좋게 썰어 다른 볼에", "담아주세요."],
    link1: "오징어 써는 법",
    body2: "오징어를 담은 볼에 고추장, 고춧가루, 설탕, 잔간장, 굴소스, 참기름, 후추를 넣어주세요.",
    link2: "",
    ingredients: ["고추장 1큰술", "고춧가루", "설탕", "간장", "굴소스", "참기름"],
        squidDetail: {
     sections: [
        {
          title: "몸통 썰기",
          segments: [{ text: "몸통을 1cm 폭으로 썰어주세요.", bold: true }],
          note: "크기가 조금씩 달라도 괜찮아요.",
        },
        {
          title: "다리 썰기",
          segments: [
            { text: "다리를 2~3가닥씩 나눈 뒤 ", bold: false },
            { text: "약 4cm 길이로 잘라주세요.", bold: true },
          ],
        },
      ],
    },
  },
  {
    title: "재료 준비하기2", // 4단계 예시 (실제 데이터에 맞게 채워주세요)
    body: ["손질한 오징어를 링기에 넣고 2분간 쪄준", "뒤, 건져서 식힙니다."],
    link1: "",
    body2: "",
    link2: "",
    ingredients: ["양파 반 개", "양배추 1/4개", "대파 반 개"],
  },
];

export const MISSING_INGREDIENTS = ["굴소스", "다진 마늘", "토마토"];

export const THEME_CARDS = [
  {
    id: "quick",
    icon: alarmIcon,
    title: "간편 요리 식단",
    desc: ["빠른 시간 안에 만드는, ", "설거지가 적은 간단한 요리"],
  },
  {
    id: "one-ingredient",
    icon: liftingIcon,
    title: "한 가지 재료 털기",
    desc: ["아직 문장 작성 미완료..."],
  },
  {
    id: "skill-up",
    icon: graphIcon,
    title: "요리 스킬 스텝업",
    desc: ["좀 더 난이도 높은 ", "3끼 메뉴에 도전하기"],
  },
  {
    id: "max-ingredient",
    icon: sparkleIcon,
    title: "재료 최대치 활용",
    desc: ["가지고 있는 재료를 활용해 최소 비용으로 만드는 요리"],
  },
];

export const VOICE_HISTORY = [
  {
    question: "굴소스가 한 스푼밖에 없는데 어떡해?",
    answerLines: [
      [{ text: "괜찮아요." }],
      [{ text: "남은 굴소스 1스푼을 넣고," }],
      [{ text: "간장 1/2스푼 + 설탕 1/3스푼", bold: true }, { text: "을 추가해 주세요." }],
      [],
      [{ text: "굴소스 특유의 감칠맛은 조금 줄어들 수 있지만," }],
      [{ text: "지금 만드는 오징어 양념에는 충분히 비슷한 맛을 낼 수 있어요." }],
      [{ text: "간장은 한 번에 많이 넣으면 짜질 수 있으니 조금씩 넣어주세요.", bold: true }],
    ],
  },
  {
    question: "냄비 바닥이 타는 것 같아",
    answerLines: [
      [{ text: "우선 불을 약불로 줄이고, 냄비 바닥은 긁지 마세요.", bold: true }],
      [{ text: "탄 부분을 건드리면 쓴맛이 음식 전체에 섞일 수 있어요." }],
      [{ text: "위쪽에 있는 음식만", bold: true }, { text: " 새 냄비나 그릇으로 조심히 옮긴 뒤," }],
      [{ text: "필요하면 물을 조금 추가해서 다시 조리해 주세요." }],
      [],
      [{ text: "탄 냄새가 심하게 난다면 " }, { text: "바닥에 붙은 음식은", bold: true }],
      [{ text: "그대로 남겨두는 게 좋아요.", bold: true }],
    ],
  },
];

export const INITIAL_INGREDIENTS = [
  { id: "squid", name: "오징어", amount: "1", unit: "마리" },
  { id: "greenOnion", name: "대파", amount: "1/2", unit: "개" },
  { id: "onion", name: "양파", amount: "반", unit: "개" },
  { id: "cabbage", name: "양배추", amount: "1/3", unit: "개" },
  { id: "garlic", name: "다진마늘", amount: "2", unit: "스푼" },
  { id: "pepper", name: "청양고추", amount: "2", unit: "개" },
  { id: "perilla", name: "깻잎", amount: "10", unit: "장" },
];