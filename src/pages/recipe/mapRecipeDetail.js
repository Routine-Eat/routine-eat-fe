export const EMPTY_RECIPE = {
  id: null,
  title: '',
  image: '',
  time: '',
  difficulty: 1,
  cost: '',
  utilization: '',
  ingredients: [],
  seasonings: [],
  additionalIngredients: [],
};

const mapIngredient = (item) => ({
  id: item.id ?? item.foodIngredientId,
  foodIngredientId: item.foodIngredientId ?? item.id,
  name: item.name ?? item.foodIngredientName ?? '',
  amount:
    item.primaryNeedAmountValue != null
      ? `${item.primaryNeedAmountValue}${
          item.primaryUnit ?? item.foodIngredientPrimaryUnit ?? ''
        }`
      : '',
  type: item.type ?? item.foodIngredientType,
});

export const removeOwnedAdditionalIngredients = (recipe, ownedItems = []) => {
  const ownedIds = new Set(
    ownedItems
      .map((item) => Number(item.foodIngredientId ?? item.id))
      .filter(Number.isFinite)
  );
  const ownedNames = new Set(
    ownedItems
      .map((item) => item.foodIngredientName ?? item.name ?? '')
      .filter(Boolean)
      .map((name) => name.trim())
  );

  return {
    ...recipe,
    additionalIngredients: recipe.additionalIngredients.filter((item) => {
      const id = Number(item.foodIngredientId ?? item.id);
      return !ownedIds.has(id) && !ownedNames.has(item.name.trim());
    }),
  };
};

const formatTimeRequired = (minutes) => {
  if (minutes == null || minutes === '') return '';
  const value = Number(minutes);
  if (!Number.isFinite(value)) return '';
  if (value >= 60) return `${Math.floor(value / 60)}시간 소요`;
  return `${value}분 소요`;
};

export const mapRecipeDetail = (payload = {}) => {
  const level = Number(String(payload.recipeDifficultyLevel ?? '').replace('LEVEL_', ''));
  const foodIngredients = (payload.foodIngredients ?? []).map(mapIngredient);
  const similarRaw =
    payload.similarRecipes ?? payload.similarRecipeList ?? payload.similarRecipe ?? [];
  const similarList = Array.isArray(similarRaw) ? similarRaw : [];

  return {
    id: payload.recipeId,
    title: payload.recipeName ?? '',
    image: payload.recipeThumbnailUrl ?? '',
    time: formatTimeRequired(payload.recipeTimeRequired),
    difficulty: Number.isFinite(level) && level > 0 ? level : 1,
    cost:
      payload.foodIngredientCost != null
        ? `약 ${Number(payload.foodIngredientCost).toLocaleString('ko-KR')}원`
        : '',
    utilization:
      payload.foodIngredientUsingPercent != null
        ? `재료 활용률 ${payload.foodIngredientUsingPercent}%`
        : '',
    ingredients: foodIngredients.filter((item) => item.type !== 'SEASONING'),
    seasonings: foodIngredients.filter((item) => item.type === 'SEASONING'),
    additionalIngredients: (payload.additionalFoodIngredients ?? []).map(mapIngredient),
    similar: similarList.map((item) => ({
      id: item.id ?? item.recipeId,
      title: item.name ?? item.recipeName ?? item.menuName ?? '',
      image: item.recipeThumbnailUrl ?? item.thumbnailUrl ?? item.image ?? '',
      extra:
        item.additionalFoodIngredientCount != null
          ? `추가재료 ${item.additionalFoodIngredientCount}개`
          : '',
      isSaved: Boolean(item.isFavoriteRecipe),
    })),
  };
};
