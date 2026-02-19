import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type User } from "../types/user";

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            user: null,

            login: (token, user) => {
                set({ isLoggedIn: true, token, user });
            },

            logout: () => {
                set({ isLoggedIn: false, token: null, user: null });
                localStorage.removeItem("auth-storage"); // 깔끔하게 비우기
            },
        }),
        {
            name: "auth-storage", // localStorage Key 이름
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export default useAuthStore;
