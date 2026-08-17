import { OTHER_GROUP_ID, SHOPPING_GROUPS } from '../constants/dummyShoppingList';

const OTHER_GROUP = { id: OTHER_GROUP_ID, title: '기타', items: [] };

function cloneGroups(list) {
  return list.map((g) => ({
    ...g,
    items: g.items.map((i) => ({ ...i })),
  }));
}

function ensureOtherGroup(list) {
  if (list.some((g) => g.id === OTHER_GROUP_ID)) return list;
  return [...list, { ...OTHER_GROUP, items: [] }];
}

let groups = ensureOtherGroup(cloneGroups(SHOPPING_GROUPS));
const listeners = new Set();
let idSeq = 100;

function emit() {
  listeners.forEach((fn) => fn());
}

function nextId() {
  idSeq += 1;
  return `i${idSeq}`;
}

function normalizeGroups(list) {
  const recipeGroups = list.filter((g) => g.id !== OTHER_GROUP_ID);
  const other = list.find((g) => g.id === OTHER_GROUP_ID) ?? {
    ...OTHER_GROUP,
    items: [],
  };
  return [...recipeGroups, { ...other, items: [...other.items] }];
}

export function getShoppingGroups() {
  return groups;
}

export function subscribeShopping(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setShoppingGroups(next) {
  groups = ensureOtherGroup(normalizeGroups(typeof next === 'function' ? next(groups) : next));
  emit();
}

/** 레시피 재료를 장보기 그룹에 추가 (같은 레시피명이면 합침) */
export function addItemsToShopping(title, items) {
  const normalized = items.map((item) => ({
    id: nextId(),
    name: typeof item === 'string' ? item : item.name,
    amount: typeof item === 'string' ? '1개' : (item.amount ?? '1개'),
  }));

  setShoppingGroups((prev) => {
    const idx = prev.findIndex((g) => g.title === title);
    if (idx === -1) {
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
    const toAdd = normalized.filter((i) => !names.has(i.name));
    if (!toAdd.length) return prev;

    const next = [...prev];
    next[idx] = { ...group, items: [...group.items, ...toAdd] };
    return next;
  });
}

/** 기타 그룹에 항목 추가 */
export function addOtherShoppingItem(name, amount) {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  const trimmedAmount = amount.trim() || '1개';

  setShoppingGroups((prev) => {
    const otherIdx = prev.findIndex((g) => g.id === OTHER_GROUP_ID);
    const item = { id: nextId(), name: trimmedName, amount: trimmedAmount };

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
