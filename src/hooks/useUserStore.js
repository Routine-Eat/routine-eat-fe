import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      userId: 0,
      userLoginNumber: null,
      userSkillLevel: null,

      login: (userData) =>
        set({
          userId: userData.userId,
          userLoginNumber: userData.userLoginNumber,
          userSkillLevel: userData.userSkillLevel,
        }),
      logout: () => set({
          userId: 0,
          userLoginNumber: null,
          userSkillLevel: null,
        }),
      updateSkillLevel: (userSkillLevel) => set({ userSkillLevel }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        userId: state.userId,
        userLoginNumber: state.userLoginNumber,
        userSkillLevel: state.userSkillLevel,
      }),
    }
  )
);
