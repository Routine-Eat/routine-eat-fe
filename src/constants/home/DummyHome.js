import eggFoodImg from "../../assets/images/EggFood.svg";
import vegetableImg from "../../assets/images/Vegetable.svg";
import meatImg from "../../assets/images/Meat.svg";
import cheeseImg from "../../assets/images/cheese.svg";
import milkImg from "../../assets/images/milk.svg";
import onionImg from "../../assets/images/onion.svg";
import dumplingImg from "../../assets/images/dumpling.svg";
import icecreamImg from "../../assets/images/ice cream.svg";
import eggImg from "../../assets/images/egg.svg";


export const DUMMY_DISHES = [
  { id: 1, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 1, image: eggFoodImg },
  { id: 2, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 4, image: eggFoodImg },
  { id: 3, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 2, image: eggFoodImg },
  { id: 4, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 3, image: eggFoodImg },
  { id: 5, name: "계란 야채 볶음밥", time: "15분 소요", cost: "예상 재료비 1,800원", difficulty: 1, image: eggFoodImg },
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
  { id: 2, name: "계란 야채 볶음밥", status: "3일전", completed: true, image: eggFoodImg },
  { id: 3, name: "계란 샌드위치", status: "예정", completed: false, image: eggFoodImg },
  { id: 4, name: "해물 야채 볶음밥", status: "예정", completed: false, image: eggFoodImg },
  { id: 5, name: "토마토 달걀 볶음", status: "예정", completed: false, image: eggFoodImg },
];

export const DUMMY_COOKING_STEPS = [
  {
    title: "재료 준비하기1",
    body: ["오징어 다리 사이를 눌러 입을", "제거하고 깨끗하게 씻어주세요."],
    link1: "오징어 입 제거 방법을 모르겠어요",
    body2: "양파, 양배추, 대파를 먹기 좋은 크기로 썰어 볼에 담아주세요.",
    link2: "채소 3인방 써는 법",
    ingredients: ["양파 반 개", "양배추 1/4개", "대파 반 개"],
  },
  {
    title: "재료 준비하기2",
    body: ["손질한 오징어를 링기에 넣고 2분간 쪄준", "뒤, 건져서 식혀주세요."],
    link1: "쪄주는 팁을 알려주는 링크 있으면 넣기",
    body2: "",
    link2: "",
    ingredients: [],
  },
  {
    title: "오징어 양념하기",
    body: ["식힌 오징어를 먹기 좋게 썰어 다른 볼에", "담아주세요."],
    link1: "오징어 써는 법",
    body2: "오징어를 담은 볼에 고추장, 고춧가루, 설탕, 잔간장, 굴소스, 참기름, 후추를 넣어주세요.",
    link2: "",
    ingredients: ["고추장 1큰술", "고춧가루", "설탕", "간장", "굴소스", "참기름"],
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