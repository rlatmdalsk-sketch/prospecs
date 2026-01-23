import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/Register.tsx";
import useAuthStore from "../stores/useAuthStore.ts";
import Login from "../pages/login.tsx";
import ProductListPage from "../pages/shop/ProductListPage.tsx";
import ProductDetailPage from "../pages/shop/ProductDetail.tsx";
import CartPage from "../pages/shop/CartPage.tsx";
import OrderPage from "../pages/shop/OrderPage.tsx";

// loader : 해당 주소에 사용자가 가려고 할 때 (요청), 화면에 출력해주기 이전 실행되는 함수를 지정
//           조건을 걸고, 아무런 문제가 없으면 null을 반환해서 화면이 출력이 되도록 해야함
const guestOnlyLoader = () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (isLoggedIn) {
        // navigate와 redirect 차이
        // navigate를 쓸려면 마찬가지로 useNavigate -> use. 컴포넌트에 안에서 보낼 때
        return redirect("/");
    }
    return null;
};

const router = createBrowserRouter([
    {
        path: "",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login />, loader: guestOnlyLoader },
            { path: "register", element: <Register />, loader: guestOnlyLoader },
            { path: "category/:id", element: <ProductListPage /> },
            { path: "product/:id", element: <ProductDetailPage /> },
            { path: "cart", element: <CartPage /> },
            { path: "/order", element: <OrderPage /> },
        ],
    },
]);

export default router;
