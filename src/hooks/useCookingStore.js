import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCookingStore = create(
  persist(
    (set) => ({
      cookingRecordId: null,
      photoFile: null,
      mealPlanId: null,
      planMenuId: null,
      activeMealPlanId: null,
      missingIngredientsByMenuId: {},
      setCookingRecordId: (id) => set({ cookingRecordId: id }),
      setPhotoFile: (file) => set({ photoFile: file }),
      setMealPlanContext: ({ mealPlanId, planMenuId }) => set({ mealPlanId, planMenuId }),
      setActiveMealPlanId: (id) => set({ activeMealPlanId: id }),
      setMissingIngredientsByMenuId: (map) => set({ missingIngredientsByMenuId: map }),
      clearCookingRecordId: () => set({ cookingRecordId: null }),
      clearCookingSession: () =>
        set({ cookingRecordId: null, photoFile: null, mealPlanId: null, planMenuId: null }),
    }),
    {
      name: 'cooking',
      storage: createJSONStorage(() => sessionStorage),
          partialize: (state) => ({
        cookingRecordId: state.cookingRecordId,
        mealPlanId: state.mealPlanId,
        planMenuId: state.planMenuId,
        activeMealPlanId: state.activeMealPlanId,
         missingIngredientsByMenuId: state.missingIngredientsByMenuId,
      }),
    }
  )
);