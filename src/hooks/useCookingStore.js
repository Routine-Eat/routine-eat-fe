import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCookingStore = create(
  persist(
    (set) => ({
      cookingRecordId: null,
      photoFile: null,
      setCookingRecordId: (id) => set({ cookingRecordId: id }),
      setPhotoFile: (file) => set({ photoFile: file }),
      clearCookingRecordId: () => set({ cookingRecordId: null }),
      clearCookingSession: () => set({ cookingRecordId: null, photoFile: null }),
    }),
    {
      name: 'cooking',
      storage: createJSONStorage(() => sessionStorage),
          partialize: (state) => ({ cookingRecordId: state.cookingRecordId }),
    }
  )
);