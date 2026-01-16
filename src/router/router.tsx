import  { createBrowserRouter, redirect } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/Register.tsx";
import Login from "../pages/login.tsx";
import useAuthStore from "../stores/useAuthStore.ts";

//loader: 해당 주소에 사용자가 가려고 할때(요청), 화면에 출력해주기 이전 실행되는 함수를 지정
//조건을 걸고,아무런 문제가 없으면 null을 반환해서 화면이 출력이 되도록함
const questOnlyLoader = () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (isLoggedIn) {
        //navigate와 redirect 차이
        //navigate를 쓰려면 useNavigate -> use. 컴포넌트 안에서 보낼 때
        return redirect("/");
    }
    return null;
}


const router = createBrowserRouter([
    {
        path: "",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login />, loader: questOnlyLoader },
            { path: "register", element: <Register /> loader: questOnlyLoader},
        ],
    },
]);

export default router;
