import { create } from "zustand";

interface LayoutState {
    isTopBannerVisible: boolean;
    hideTopBanner: () => void;
    showTopBanner: () => void;
    topBannerHeight: number;
}

const useLayoutStore = create<LayoutState>(set => ({
    isTopBannerVisible: true,
    topBannerHeight: 36,
    hideTopBanner: () => set({ isTopBannerVisible: false }),
    showTopBanner: () => set({ isTopBannerVisible: true }),
}));

export default useLayoutStore;
