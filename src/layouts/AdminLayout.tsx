import { Outlet, Link, useNavigate } from "react-router";
import useAuthStore from "../store/useAuthStore";
import GlobalModal from "../components/modals/GlobalModal";

const AdminLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* 사이드바 */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-gray-700">
                    <h1 className="text-xl font-bold italic">ADMIN</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-800 rounded">
                        대시보드
                    </Link>
                    <div className="pt-4 pb-2 text-xs text-gray-500 font-bold px-4">상품 관리</div>
                    <Link
                        to="/admin/categories"
                        className="block px-4 py-2 hover:bg-gray-800 rounded">
                        카테고리 관리
                    </Link>
                    <Link
                        to="/admin/products"
                        className="block px-4 py-2 hover:bg-gray-800 rounded">
                        상품 목록
                    </Link>
                    <Link
                        to="/admin/products/new"
                        className="block px-4 py-2 hover:bg-gray-800 rounded">
                        상품 등록
                    </Link>

                    <div className="pt-4 pb-2 text-xs text-gray-500 font-bold px-4">주문/회원</div>
                    <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-800 rounded">
                        주문 관리
                    </Link>
                    <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-800 rounded">
                        회원 관리
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 text-sm text-gray-400 hover:text-white">
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white shadow-sm flex items-center justify-end px-8">
                    <span className="text-sm font-bold">관리자님 환영합니다.</span>
                </header>
                <main className="p-8 overflow-auto">
                    {/* 자식 라우트 렌더링 */}
                    <Outlet />
                </main>
            </div>

            <GlobalModal />
        </div>
    );
};

export default AdminLayout;
