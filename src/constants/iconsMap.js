import avocadoIcon from '@/assets/pillButtonIcons/avocado.svg';
import baconIcon from '@/assets/pillButtonIcons/bacon.svg';
import bagelIcon from '@/assets/pillButtonIcons/bagel.svg';
import baguetteBreadIcon from '@/assets/pillButtonIcons/baguette_bread.svg';
import bananaIcon from '@/assets/pillButtonIcons/banana.svg';
import beansIcon from '@/assets/pillButtonIcons/beans.svg';
import bellPepperIcon from '@/assets/pillButtonIcons/bell_pepper.svg';
import blueberriesIcon from '@/assets/pillButtonIcons/blueberries.svg';
import bowlWithSpoonIcon from '@/assets/pillButtonIcons/bowl_with_spoon.svg';
import breadIcon from '@/assets/pillButtonIcons/bread.svg';
import broccoliIcon from '@/assets/pillButtonIcons/broccoli.svg';
import butterIcon from '@/assets/pillButtonIcons/butter.svg';
import cannedFoodIcon from '@/assets/pillButtonIcons/canned_food.svg';
import carrotIcon from '@/assets/pillButtonIcons/carrot.svg';
import cheeseWedgeIcon from '@/assets/pillButtonIcons/cheese_wedge.svg';
import cherriesIcon from '@/assets/pillButtonIcons/cherries.svg';
import chestnutIcon from '@/assets/pillButtonIcons/chestnut.svg';
import chocolateBarIcon from '@/assets/pillButtonIcons/chocolate_bar.svg';
import chopsticksIcon from '@/assets/pillButtonIcons/chopsticks.svg';
import coconutIcon from '@/assets/pillButtonIcons/coconut.svg';
import cookedRiceIcon from '@/assets/pillButtonIcons/cooked_rice.svg';
import cookingIcon from '@/assets/pillButtonIcons/cooking.svg';
import crabIcon from '@/assets/pillButtonIcons/crab.svg';
import cucumberIcon from '@/assets/pillButtonIcons/cucumber.svg';
import curryRiceIcon from '@/assets/pillButtonIcons/curry_rice.svg';
import cutOfMeatIcon from '@/assets/pillButtonIcons/cut_of_meat.svg';
import dumplingIcon from '@/assets/pillButtonIcons/dumpling.svg';
import earOfCornIcon from '@/assets/pillButtonIcons/ear_of_corn.svg';
import eggIcon from '@/assets/pillButtonIcons/egg.svg';
import eggplantIcon from '@/assets/pillButtonIcons/eggplant.svg';
import fishCakeIcon from '@/assets/pillButtonIcons/fish_cake.svg';
import flatbreadIcon from '@/assets/pillButtonIcons/flatbread.svg';
import forkAndKnifeIcon from '@/assets/pillButtonIcons/fork_and_knife.svg';
import garlicIcon from '@/assets/pillButtonIcons/garlic.svg';
import gingerRootIcon from '@/assets/pillButtonIcons/ginger_root.svg';
import glassOfMilkIcon from '@/assets/pillButtonIcons/glass_of_milk.svg';
import grapesIcon from '@/assets/pillButtonIcons/grapes.svg';
import honeyPotIcon from '@/assets/pillButtonIcons/honey_pot.svg';
import jarIcon from '@/assets/pillButtonIcons/jar.svg';
import kitchenKnifeIcon from '@/assets/pillButtonIcons/kitchen_knife.svg';
import kiwiFruitIcon from '@/assets/pillButtonIcons/kiwi_fruit.svg';
import leafyGreenIcon from '@/assets/pillButtonIcons/leafy_green.svg';
import lemonIcon from '@/assets/pillButtonIcons/lemon.svg';
import lobsterIcon from '@/assets/pillButtonIcons/lobster.svg';
import mangoIcon from '@/assets/pillButtonIcons/mango.svg';
import meatOnBoneIcon from '@/assets/pillButtonIcons/meat_on_bone.svg';
import melonIcon from '@/assets/pillButtonIcons/melon.svg';
import noodlesIcon from '@/assets/pillButtonIcons/noodles.svg';
import olivesIcon from '@/assets/pillButtonIcons/olives.svg';
import onionIcon from '@/assets/pillButtonIcons/onion.svg';
import oysterIcon from '@/assets/pillButtonIcons/oyster.svg';
import peaPodIcon from '@/assets/pillButtonIcons/pea_pod.svg';
import peachIcon from '@/assets/pillButtonIcons/peach.svg';
import peanutsIcon from '@/assets/pillButtonIcons/peanuts.svg';
import pearIcon from '@/assets/pillButtonIcons/pear.svg';
import pineappleIcon from '@/assets/pillButtonIcons/pineapple.svg';
import plateWithCutleryIcon from '@/assets/pillButtonIcons/plate_with_cutlery.svg';
import potOfFoodIcon from '@/assets/pillButtonIcons/pot_of_food.svg';
import potatoIcon from '@/assets/pillButtonIcons/potato.svg';
import poultryLegIcon from '@/assets/pillButtonIcons/poultry_leg.svg';
import redAppleIcon from '@/assets/pillButtonIcons/red_apple.svg';
import redChiliPepperIcon from '@/assets/pillButtonIcons/red_chili_pepper.svg';
import riceBallIcon from '@/assets/pillButtonIcons/rice_ball.svg';
import roastedSweetPotatoIcon from '@/assets/pillButtonIcons/roasted_sweet_potato.svg';
import saltIcon from '@/assets/pillButtonIcons/salt.svg';
import shallowPanOfFoodIcon from '@/assets/pillButtonIcons/shallow_pan_of_food.svg';
import shrimpIcon from '@/assets/pillButtonIcons/shrimp.svg';
import spoonIcon from '@/assets/pillButtonIcons/spoon.svg';
import squidIcon from '@/assets/pillButtonIcons/squid.svg';
import strawberryIcon from '@/assets/pillButtonIcons/strawberry.svg';
import tangerineIcon from '@/assets/pillButtonIcons/tangerine.svg';
import tomatoIcon from '@/assets/pillButtonIcons/tomato.svg';
import watermelonIcon from '@/assets/pillButtonIcons/watermelon.svg';
import plusIcon from '@/assets/pillButtonIcons/plus.svg';

// ==========================================
// 1. [식재료] 아이콘 매핑
// ==========================================

const TYPE = {
  POTATO_AND_STARCH: 'POTATO_AND_STARCH',
  NUT_AND_SEED: 'NUT_AND_SEED',
  GRAIN: 'GRAIN',
  FRUIT: 'FRUIT',
  SUGAR: 'SUGAR',
  LEGUME: 'LEGUME',
  PROCESSED_LEGUME: 'PROCESSED_LEGUME',
  MUSHROOM: 'MUSHROOM',
  MILK: 'MILK',
  FAT_AND_OIL: 'FAT_AND_OIL',
  MEAT: 'MEAT',
  VEGETABLE: 'VEGETABLE',
  SEAWEED: 'SEAWEED',
  FISH_AND_OTHER_SEAFOOD: 'FISH_AND_OTHER_SEAFOOD',
  SHELLFISH: 'SHELLFISH',
  CRAB: 'CRAB',
  CEPHALOPOD: 'CEPHALOPOD',
  EGG: 'EGG',
  SEASONING: 'SEASONING',
  OTHER: 'OTHER',
};

const contains = (icon, type, ...keywords) => ({
  icon,
  matches: (name, ingredientType) =>
    ingredientType === type && keywords.some((keyword) => name.includes(keyword)),
});

const exact = (icon, type, ...names) => ({
  icon,
  matches: (name, ingredientType) => ingredientType === type && names.includes(name),
});

const ICON_RULES = [
  // 감자 및 전분류 / 견과류
  contains(roastedSweetPotatoIcon, TYPE.POTATO_AND_STARCH, '고구마'),
  exact(chestnutIcon, TYPE.POTATO_AND_STARCH, '밤'),
  contains(peanutsIcon, TYPE.NUT_AND_SEED, '땅콩'),
  contains(coconutIcon, TYPE.NUT_AND_SEED, '코코넛'),
  contains(chestnutIcon, TYPE.NUT_AND_SEED, '도토리', '은행', '잣'),

  // 곡류
  contains(earOfCornIcon, TYPE.GRAIN, '옥수수'),
  exact(riceBallIcon, TYPE.GRAIN, '밥'),
  contains(riceBallIcon, TYPE.GRAIN, '백미', '현미', '흑미', '찹쌀', '쌀떡', '찹쌀떡'),
  contains(
    noodlesIcon,
    TYPE.GRAIN,
    '면',
    '국수',
    '당면',
    '라면',
    '파스타',
    '마카로니',
    '수제비',
    '뇨키'
  ),
  exact(bagelIcon, TYPE.GRAIN, '베이글'),
  contains(baguetteBreadIcon, TYPE.GRAIN, '바게트'),
  contains(flatbreadIcon, TYPE.GRAIN, '또띠아', '타코쉘', '라이스페이퍼', '춘권피', '파이피'),
  contains(breadIcon, TYPE.GRAIN, '식빵', '빵'),

  // 과일류
  exact(avocadoIcon, TYPE.FRUIT, '아보카도'),
  exact(bananaIcon, TYPE.FRUIT, '바나나'),
  exact(blueberriesIcon, TYPE.FRUIT, '블루베리'),
  contains(cherriesIcon, TYPE.FRUIT, '체리', '버찌', '앵두'),
  contains(grapesIcon, TYPE.FRUIT, '포도', '거봉', '머루', '청포도'),
  exact(kiwiFruitIcon, TYPE.FRUIT, '다래'),
  contains(lemonIcon, TYPE.FRUIT, '레몬', '라임', '유자', '탱자'),
  exact(mangoIcon, TYPE.FRUIT, '망고'),
  contains(melonIcon, TYPE.FRUIT, '멜론', '참외'),
  exact(peachIcon, TYPE.FRUIT, '복숭아(백도)', '복숭아(천도)', '복숭아(황도)', '살구'),
  exact(pearIcon, TYPE.FRUIT, '배'),
  exact(pineappleIcon, TYPE.FRUIT, '파인애플'),
  contains(redAppleIcon, TYPE.FRUIT, '사과'),
  contains(strawberryIcon, TYPE.FRUIT, '딸기', '라즈베리', '산딸기', '크랜베리'),
  contains(tangerineIcon, TYPE.FRUIT, '귤', '오렌지', '자몽'),
  contains(watermelonIcon, TYPE.FRUIT, '수박'),

  // 당류 / 콩류
  contains(chocolateBarIcon, TYPE.SUGAR, '초콜릿', '초코'),
  contains(
    honeyPotIcon,
    TYPE.SUGAR,
    '꿀',
    '시럽',
    '잼',
    '스프레드',
    '당밀',
    '설탕',
    '알룰로스',
    '스테비아'
  ),
  exact(peaPodIcon, TYPE.LEGUME, '완두'),
  contains(beansIcon, TYPE.LEGUME, '콩', '렌틸', '병아리'),
  contains(beansIcon, TYPE.PROCESSED_LEGUME, '콩', '두부', '메주', '나또', '청국장'),

  // 유제품 / 유지류
  exact(butterIcon, TYPE.MILK, '버터', '무염버터', '기 버터'),
  contains(cheeseWedgeIcon, TYPE.MILK, '치즈'),
  contains(butterIcon, TYPE.FAT_AND_OIL, '기 버터'),
  contains(avocadoIcon, TYPE.FAT_AND_OIL, '아보카도유'),
  contains(olivesIcon, TYPE.FAT_AND_OIL, '올리브유'),
  contains(coconutIcon, TYPE.FAT_AND_OIL, '코코넛유'),

  // 육류
  contains(poultryLegIcon, TYPE.MEAT, '닭'),
  contains(baconIcon, TYPE.MEAT, '베이컨', '햄', '살라미', '페퍼로니', '초리조', '판체타'),
  exact(dumplingIcon, TYPE.MEAT, '만두'),
  contains(meatOnBoneIcon, TYPE.MEAT, '돼지', '소고기', '양고기', '오리', '고래'),

  // 채소류
  contains(garlicIcon, TYPE.VEGETABLE, '마늘'),
  contains(gingerRootIcon, TYPE.VEGETABLE, '생강'),
  contains(carrotIcon, TYPE.VEGETABLE, '당근'),
  contains(broccoliIcon, TYPE.VEGETABLE, '브로콜리', '콜리플라워'),
  contains(cucumberIcon, TYPE.VEGETABLE, '오이'),
  contains(eggplantIcon, TYPE.VEGETABLE, '가지'),
  contains(bellPepperIcon, TYPE.VEGETABLE, '피망', '파프리카'),
  contains(onionIcon, TYPE.VEGETABLE, '양파', '대파', '쪽파', '파', '샬롯', '리크'),
  contains(redChiliPepperIcon, TYPE.VEGETABLE, '고추'),
  contains(tomatoIcon, TYPE.VEGETABLE, '토마토'),
  exact(earOfCornIcon, TYPE.VEGETABLE, '옥수수통조림'),

  // 수산물류
  contains(cannedFoodIcon, TYPE.FISH_AND_OTHER_SEAFOOD, '통조림', '캔'),
  exact(fishCakeIcon, TYPE.FISH_AND_OTHER_SEAFOOD, '어묵'),
  contains(shrimpIcon, TYPE.FISH_AND_OTHER_SEAFOOD, '멸치', '새우'),
  contains(fishCakeIcon, TYPE.FISH_AND_OTHER_SEAFOOD, '맛살', '명란', '날치알', '알'),
  contains(oysterIcon, TYPE.SHELLFISH, '굴', '조개', '가리비', '꼬막', '전복', '홍합'),
  contains(shrimpIcon, TYPE.CRAB, '새우'),
  exact(lobsterIcon, TYPE.CRAB, '랍스터'),
  contains(crabIcon, TYPE.CRAB, '게'),
  contains(squidIcon, TYPE.CEPHALOPOD, '오징어', '낙지', '문어', '주꾸미', '한치'),

  // 조미료류
  contains(saltIcon, TYPE.SEASONING, '소금', '천일염'),
  contains(
    redChiliPepperIcon,
    TYPE.SEASONING,
    '고춧가루',
    '고추기름',
    '건고추',
    '페페론치노',
    '파프리카 가루'
  ),
  contains(lemonIcon, TYPE.SEASONING, '레몬즙'),
  contains(curryRiceIcon, TYPE.SEASONING, '카레'),
  contains(cheeseWedgeIcon, TYPE.SEASONING, '치즈 소스'),
  contains(garlicIcon, TYPE.SEASONING, '갈릭'),
  contains(
    jarIcon,
    TYPE.SEASONING,
    '간장',
    '된장',
    '장',
    '소스',
    '드레싱',
    '페스토',
    '액젓',
    '식초'
  ),
];

const DEFAULT_ICON_BY_TYPE = {
  [TYPE.POTATO_AND_STARCH]: potatoIcon,
  [TYPE.NUT_AND_SEED]: peanutsIcon,
  [TYPE.GRAIN]: breadIcon,
  [TYPE.FRUIT]: melonIcon,
  [TYPE.SUGAR]: honeyPotIcon,
  [TYPE.LEGUME]: beansIcon,
  [TYPE.PROCESSED_LEGUME]: beansIcon,
  [TYPE.MUSHROOM]: leafyGreenIcon,
  [TYPE.MILK]: glassOfMilkIcon,
  [TYPE.FAT_AND_OIL]: jarIcon,
  [TYPE.MEAT]: cutOfMeatIcon,
  [TYPE.VEGETABLE]: leafyGreenIcon,
  [TYPE.SEAWEED]: leafyGreenIcon,
  [TYPE.FISH_AND_OTHER_SEAFOOD]: fishCakeIcon,
  [TYPE.SHELLFISH]: oysterIcon,
  [TYPE.CRAB]: crabIcon,
  [TYPE.CEPHALOPOD]: squidIcon,
  [TYPE.EGG]: eggIcon,
  [TYPE.SEASONING]: jarIcon,
  [TYPE.OTHER]: bowlWithSpoonIcon,
};

export const getIngredientIcon = (name, type) => {
  if (!name || !type) return DEFAULT_ICON_BY_TYPE.OTHER;

  const trimmedName = name.trim();
  const trimmedType = type.trim();

  return (
    ICON_RULES.find((rule) => rule.matches(trimmedName, trimmedType))?.icon ??
    DEFAULT_ICON_BY_TYPE[trimmedType] ??
    DEFAULT_ICON_BY_TYPE.OTHER
  );
};

// ==========================================
// 2. [조리도구] 아이콘 매핑
// ==========================================

const DEFAULT_EQUIPMENT_ICON_BY_TYPE = {
  APPLIANCE: cookingIcon,
  UTENSIL: spoonIcon,
  PREP_TOOL: kitchenKnifeIcon,
  ETC: cannedFoodIcon,
};

const EQUIPMENT_ICON_RULES = [
  // 가전류 (APPLIANCE)
  exact(cookedRiceIcon, 'APPLIANCE', '전기밥솥'),
  contains(shallowPanOfFoodIcon, 'APPLIANCE', '프라이팬', '웍', '팬'),
  contains(potOfFoodIcon, 'APPLIANCE', '냄비', '뚝배기'),

  // 도구류 (UTENSIL)
  contains(chopsticksIcon, 'UTENSIL', '집게'),
  contains(forkAndKnifeIcon, 'UTENSIL', '거품기'),
  contains(kitchenKnifeIcon, 'UTENSIL', '망치'),
  contains(glassOfMilkIcon, 'UTENSIL', '계량컵'),
  contains(cookingIcon, 'UTENSIL', '저울', '온도계'),
  contains(bowlWithSpoonIcon, 'UTENSIL', '믹싱볼', '볼'),
  contains(plateWithCutleryIcon, 'UTENSIL', '채반', '체'),

  // 손질 도구류 (PREP_TOOL)
  contains(plateWithCutleryIcon, 'PREP_TOOL', '도마'),
  contains(cheeseWedgeIcon, 'PREP_TOOL', '강판'),
  contains(kitchenKnifeIcon, 'PREP_TOOL', '칼', '가위'),

  // 기타 (ETC)
  contains(cannedFoodIcon, 'ETC', '캔 따개', '오프너'),
];

export const getEquipmentIcon = (name, type) => {
  if (!name) return cookingIcon;

  const trimmedName = name.trim();
  const trimmedType = type?.trim();

  return (
    EQUIPMENT_ICON_RULES.find((rule) => rule.matches(trimmedName, trimmedType))?.icon ??
    DEFAULT_EQUIPMENT_ICON_BY_TYPE[trimmedType] ??
    cookingIcon
  );
};

// ==========================================
// 3. [기타/버튼] 아이콘 매핑
// ==========================================

export const getEtcIcon = (name) => {
  if (!name) return plusIcon;

  const trimmedName = name.trim();

  if (trimmedName === '추가' || trimmedName.includes('추가')) {
    return plusIcon;
  }

  return plusIcon;
};