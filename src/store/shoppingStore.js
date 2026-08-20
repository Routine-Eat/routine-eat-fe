import { postUserFoodIngredients } from '../api/userApi';
import { OTHER_GROUP_ID } from '../constants/dummyShoppingList';
import { useUserStore } from '../hooks/useUserStore';

const OTHER_GROUP = { id: OTHER_GROUP_ID, title: '기타', items: [] };
const CUSTOM_OWNED_KEY = 'custom-owned-food-ingredients';
const SHOPPING_GROUPS_KEY = 'shopping-groups';

function ensureOtherGroup(list) {
  if (list.some((g) => g.id === OTHER_GROUP_ID)) return list;
  return [...list, { ...OTHER_GROUP, items: [] }];
}

const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

function nextId() {
  idSeq += 1;
  return `i${idSeq}`;
}

const getCustomOwnedKey = (userId) => `${CUSTOM_OWNED_KEY}:${userId}`;

export function getCustomOwnedIngredients(userId) {
  if (!userId) return [];

  try {
    const saved = localStorage.getItem(getCustomOwnedKey(userId));
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomOwnedIngredients(userId, items) {
  if (!userId || items.length === 0) return;

  const saved = getCustomOwnedIngredients(userId);
  const next = [...saved];

  items.forEach((item, index) => {
    const existingIndex = next.findIndex(
      (savedItem) => savedItem.name.trim() === item.name.trim()
    );
    const ownedItem = {
      id: existingIndex >= 0
        ? next[existingIndex].id
        : `custom-${Date.now()}-${index}`,
      name: item.name.trim(),
      amount: item.amount,
      type: 'OTHER',
      category: 'ingredient',
      isCustom: true,
    };

    if (existingIndex >= 0) next[existingIndex] = ownedItem;
    else next.push(ownedItem);
  });

  localStorage.setItem(getCustomOwnedKey(userId), JSON.stringify(next));
}

export function removeCustomOwnedIngredients(userId, ids) {
  if (!userId || ids.length === 0) return;

  const idSet = new Set(ids);
  const next = getCustomOwnedIngredients(userId).filter((item) => !idSet.has(item.id));
  localStorage.setItem(getCustomOwnedKey(userId), JSON.stringify(next));
}

function normalizeGroups(list) {
  const recipeGroups = list.filter((g) => g.id !== OTHER_GROUP_ID);
  const other = list.find((g) => g.id === OTHER_GROUP_ID) ?? {
    ...OTHER_GROUP,
    items: [],
  };
  return [...recipeGroups, { ...other, items: [...other.items] }];
}

function loadShoppingGroups() {
  try {
    const saved = localStorage.getItem(SHOPPING_GROUPS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let groups = ensureOtherGroup(normalizeGroups(loadShoppingGroups()));
let idSeq = Math.max(
  100,
  ...groups
    .flatMap((group) => group.items)
    .map((item) => Number(String(item.id).replace(/^i/, '')))
    .filter(Number.isFinite)
);

export function getShoppingGroups() {
  return groups;
}

export function subscribeShopping(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setShoppingGroups(next) {
  groups = ensureOtherGroup(normalizeGroups(typeof next === 'function' ? next(groups) : next));
  localStorage.setItem(SHOPPING_GROUPS_KEY, JSON.stringify(groups));
  emit();
}

const toFoodIngredientId = (item) => {
  if (typeof item === 'string') return null;
  const id = Number(item.id ?? item.foodIngredientId);
  return Number.isFinite(id) ? id : null;
};

const reserveShoppingIngredients = (items) => {
  const userId = useUserStore.getState().userId;
  const foodIngredientList = items
    .map((item) => Number(item.foodIngredientId))
    .filter((id) => Number.isFinite(id))
    .map((foodIngredientId) => ({ foodIngredientId }));

  if (!userId || foodIngredientList.length === 0) return;

  postUserFoodIngredients(userId, {
    relationType: 'RESERVATION',
    foodIngredientList,
  }).catch((error) => {
    console.error('장보기 예약 식재료 저장 실패:', error);
  });
};

/** 레시피 재료를 장보기 그룹에 추가 (같은 레시피명이면 합침) */
export function addItemsToShopping(title, items) {
  const normalized = items.map((item) => ({
    id: nextId(),
    foodIngredientId: toFoodIngredientId(item),
    name: typeof item === 'string' ? item : item.name,
    amount: typeof item === 'string' ? '1개' : (item.amount ?? '1개'),
  }));

  let added = normalized;

  setShoppingGroups((prev) => {
    const idx = prev.findIndex((g) => g.title === title);
    if (idx === -1) {
      added = normalized;
      return [
        ...prev.filter((g) => g.id !== OTHER_GROUP_ID),
        {
          id: `g-${Date.now()}`,
          title,
          items: normalized,
        },
        prev.find((g) => g.id === OTHER_GROUP_ID) ?? OTHER_GROUP,
      ];
    }

    const group = prev[idx];
    const names = new Set(group.items.map((i) => i.name));
    const normalizedByName = new Map(normalized.map((item) => [item.name, item]));
    const repairedItems = [];
    const existingItems = group.items.map((item) => {
      const normalizedItem = normalizedByName.get(item.name);
      if (item.foodIngredientId != null || normalizedItem?.foodIngredientId == null) {
        return item;
      }

      const repaired = {
        ...item,
        foodIngredientId: normalizedItem.foodIngredientId,
      };
      repairedItems.push(repaired);
      return repaired;
    });
    const toAdd = normalized.filter((i) => !names.has(i.name));
    added = [...repairedItems, ...toAdd];
    if (!added.length) return prev;

    const next = [...prev];
    next[idx] = { ...group, items: [...existingItems, ...toAdd] };
    return next;
  });

  reserveShoppingIngredients(added);
}

/** 기타 그룹에 항목 추가 */
export function addOtherShoppingItem(name, amount, foodIngredientId = null) {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  const trimmedAmount = amount.trim() || '1개';

  setShoppingGroups((prev) => {
    const otherIdx = prev.findIndex((g) => g.id === OTHER_GROUP_ID);
    const item = {
      id: nextId(),
      foodIngredientId,
      name: trimmedName,
      amount: trimmedAmount,
      isCustom: true,
    };

    if (otherIdx === -1) {
      return [...prev, { ...OTHER_GROUP, items: [item] }];
    }

    const next = [...prev];
    const other = prev[otherIdx];
    next[otherIdx] = { ...other, items: [...other.items, item] };
    return next;
  });

  return true;
}

/** 장보기 항목 이름·수량 수정 */
export function updateShoppingItem(id, name, amount) {
  const trimmedName = name.trim();
  if (!id || !trimmedName) return false;

  const trimmedAmount = amount.trim() || '1개';

  setShoppingGroups((prev) =>
    prev.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === id ? { ...item, name: trimmedName, amount: trimmedAmount } : item
      ),
    }))
  );

  return true;
}

/** 선택한 항목 삭제 — 기타 그룹은 비어도 유지 */
export function removeShoppingItems(ids) {
  const idSet = ids instanceof Set ? ids : new Set(ids);
  if (!idSet.size) return;

  setShoppingGroups((prev) =>
    prev
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => !idSet.has(i.id)),
      }))
      .filter((g) => g.id === OTHER_GROUP_ID || g.items.length > 0)
  );
}
