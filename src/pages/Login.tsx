import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/auth.api";
import useAuthStore from "../store/useAuthStore";
import { AxiosError } from "axios";
import Input from "../components/common/Input";
import type { LoginProps } from "../types/user.ts";
import Button from "../components/common/Button.tsx";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginProps>();

    const onSubmit = async (data: LoginProps) => {
        setServerError("");
        try {
            const response = await loginUser(data);
            login(response.token, response.user);
            alert("로그인 되었습니다.");
            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                setServerError(error.response?.data?.message || "로그인에 실패했습니다.");
            } else {
                setServerError("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-40 px-4">
            <h2 className="text-3xl font-bold mb-10">LOGIN</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-4">
                <Input
                    type="email"
                    placeholder="이메일 아이디"
                    error={errors.email}
                    registration={register("email", {
                        required: "이메일을 입력해주세요.",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "올바른 이메일 형식이 아닙니다.",
                        },
                    })}
                />

                <Input
                    type="password"
                    placeholder="비밀번호"
                    error={errors.password}
                    registration={register("password", {
                        required: "비밀번호를 입력해주세요.",
                    })}
                />

                {serverError && <p className="text-red-600 text-sm text-center">{serverError}</p>}

                <Button type="submit" fullWidth size="md" isLoading={isSubmitting}>
                    로그인
                </Button>
            </form>

            <div className="mt-6 flex gap-4 text-sm text-gray-500">
                <Link to="/register" className="hover:text-black hover:underline">
                    회원가입
                </Link>
                <span>|</span>
                <Link to="#" className="hover:text-black hover:underline">
                    아이디/비밀번호 찾기
                </Link>
            </div>
        </div>
    );
};

export default Login;
