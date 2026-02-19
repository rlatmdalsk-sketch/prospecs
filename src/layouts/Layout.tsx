import { Outlet } from "react-router";
import useLayoutStore from "../store/useLayoutStore.ts";
import TopBanner from "../components/layout/TopBanner.tsx";
import Header from "../components/layout/Header.tsx";
import GlobalModal from "../components/modals/GlobalModal.tsx";

const Layout = () => {
    const { isTopBannerVisible, topBannerHeight } = useLayoutStore();

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* 1. TopBanner: 화면 최상단에 고정 (Fixed) */}
            <TopBanner />

            {/* 2. Header: TopBanner 높이만큼 top을 가져야 함 (Sticky) */}
            {/* TopBanner가 fixed이므로, Header는 그 아래에 위치해야 함 */}
            <Header />

            {/* 3. 본문 컨텐츠 (Outlet) */}
            {/* TopBanner가 fixed라서 본문이 가려지지 않게 padding-top 필요 */}
            {/* Header는 sticky라서 공간을 차지하므로 TopBanner 높이만큼만 padding 주면 됨 */}
            <main
                className="flex-1 w-full min-w-0 transition-[padding-top] duration-300"
                style={{ paddingTop: isTopBannerVisible ? `${topBannerHeight}px` : 0 }}>
                <Outlet />
            </main>

            {/* 4. 푸터 */}
            <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">
                <p>&copy; 2026 PROSPECS Clone. All rights reserved.</p>
            </footer>
            <GlobalModal />
        </div>
    );
};

export default Layout;
