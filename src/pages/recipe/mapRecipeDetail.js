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
  id: item.id,
  name: item.name,
  amount:
    item.primaryNeedAmountValue != null
      ? `${item.primaryNeedAmountValue}${item.primaryUnit ?? ''}`
      : '',
  type: item.type,
});

export const mapRecipeDetail = (payload = {}) => {
  const level = Number(String(payload.recipeDifficultyLevel ?? '').replace('LEVEL_', ''));
  const foodIngredients = (payload.foodIngredients ?? []).map(mapIngredient);

  return {
    id: payload.recipeId,
    title: payload.recipeName ?? '',
    image: payload.recipeThumbnailUrl ?? '',
    time: payload.recipeTimeRequired != null ? `${payload.recipeTimeRequired}분 소요` : '',
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
    similar: (payload.similarRecipes ?? []).map((item) => ({
      id: item.id,
      title: item.name,
      extra:
        item.additionalFoodIngredientCount != null
          ? `추가재료 ${item.additionalFoodIngredientCount}개`
          : '',
      isSaved: Boolean(item.isFavoriteRecipe),
    })),
  };
};
