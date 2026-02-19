import { create } from "zustand";

interface LayoutState {
    isTopBannerVisible: boolean;
    hideTopBanner: () => void;
    showTopBanner: () => void;
    topBannerHeight: number; // 높이값도 관리하면 더 정교하게 제어 가능 (기본 36px)
}

const useLayoutStore = create<LayoutState>(set => ({
    isTopBannerVisible: true,
    topBannerHeight: 36, // TopBanner의 실제 높이(px)
    hideTopBanner: () => set({ isTopBannerVisible: false }),
    showTopBanner: () => set({ isTopBannerVisible: true }),
}));

export default useLayoutStore;
