import TopHeader from "../components/layout/TopHeader.tsx";
import Header from "../components/layout/Header.tsx";
import { Outlet } from "react-router";
import Footer from "../components/layout/Footer.tsx";
import useLayoutStore from "../stores/useLayoutStore.ts";
import { twMerge } from "tailwind-merge";

function Layout() {
    const { isTopBannerVisible, topBannerHeight } = useLayoutStore();

    return (
        <div className={twMerge(["min-h-screen", "flex", "flex-col"])}>
            {/*
                TopHeader는 처음에는 fixed로 화면에 출력되기를 원하나
                사용자가 스크롤을 조금이라도 내리게 되면, (스크롤Y의 값이 0보다 크면)
                화면에서 사라지게 하길 바람
            */}
            <div className={twMerge(["fixed", "top-0", "left-0", "right-0", "z-60"])}>
                <TopHeader />
            </div>
            {/*
                1. TopHeader가 나오고 있는 상황
                Sticky해주되, top-9

                2. TopHeader가 나오지 않고 있는 상황
                단순하게 Sticky, top-0

                백그라운드 색상은 사용자의 스크롤Y 값을 감지해서 맨 위에 있을 땐 투명 조금이라도 내리면 백색
            */}
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
