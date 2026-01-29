import { twMerge } from "tailwind-merge"
import { Link, Outlet } from "react-router";

function MyLayout() {
    return <>
    <div className={twMerge("w-full","max-w-7xl","mx-auto","py-40","flex","gap-10")}>
        <aside className={twMerge("w-60","space-y-15")}>
            <div className={twMerge("text-2xl","font-bold")}>
                마이페이지
            </div>
            <div className={twMerge("text-lg","font-bold")}>
                쇼핑내역
                <Link to={"/my/orders"}>주문/배송 조회</Link>
            </div>
        </aside>
        <Outlet />
    </div>
    </>
}

export default MyLayout;