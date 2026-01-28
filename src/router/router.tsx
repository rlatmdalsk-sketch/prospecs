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
import OrderFailPage from "../pages/shop/OrderFailPage.tsx";
import OrderSuccessPage from "../pages/shop/OrderSuccessPage.tsx";

const guestOnlyLoader = () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (isLoggedIn) {
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
            {
                path: "order",
                children: [
                    { index: true, element: <OrderPage /> },
                    { path: "success", element: <OrderSuccessPage /> },
                    { path: "fail", element: <OrderFailPage /> }
                ]
            }
        ]
    }
]);

export default router;