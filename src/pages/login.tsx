import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { LoginFormType } from "../types/user.ts";
import { twMerge } from "tailwind-merge";
import Input from "../components/common/input.tsx";
import Select from "../components/common/select.tsx";
import Button from "../components/common/Button.tsx";
import { loginUser } from "../api/auth.api.ts";
import { AxiosError } from "axios";
import useAuthStore from "../stores/useAuthStore.ts";

function Login() {
    const navigate = useNavigate();
    const {login} = useAuthStore();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } =useForm<LoginFormType>();

    const onSubmit = async (data: LoginFormType) => {
        setError("root", { message: "" });

        try {
            const response = await loginUser(data);
            login(response.token, response.user);
            alert("로그인 되었습니다.");
            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    error.response?.data?.message ?? "로그인이 실패했습니다.";

                setError("root", { message });
            } else {
                setError("root", {
                    message: "알 수 없는 오류가 발생했습니다.",
                });
            }
        }
    };

    return <>
        <div
            className={twMerge(
                "flex",
                "flex-col",
                "min-h-[80dvh]",
                "px-4",
                "py-40",
                "justify-center",
                "items-center"
            )}
        >
            <h2 className={twMerge("text-3xl", "font-bold", "text-center", "mb-10")}>
                LOGIN
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge("w-full", "max-w-lg", "flex", "flex-col", "gap-5")}
            >
                <Input
                    fullWidth
                    placeholder="이메일을 입력해주세요"
                    type="email"
                    registration={register("email", {
                        required: "이메일은 필수값입니다.",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "올바른 이메일 형식이 아닙니다.",
                        },
                    })}
                    error={errors.email}
                />

                <Input
                    type="password"
                    placeholder="비밀번호 6자 이상"
                    registration={register("password", {
                        required: "비밀번호는 필수입니다",
                        minLength: {
                            value: 6,
                            message: "비밀번호는 최소 6자 이상이어야합니다.",
                        },
                    })}
                    error={errors.password}
                />

                {errors.root && (
                    <p className="text-red-600 text-sm text-center">
                        {errors.root.message}
                    </p>
                )}

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    fullWidth
                    size="lg"
                >
                    로그인
                </Button>

                <div className="mt-6 flex justify-end w-full">
                    <Link
                        to="/register"
                        className="text-gray-500 hover:text-black"
                    >
                        회원가입
                    </Link>
                </div>
            </form>
        </div>
    </>
}

export default Login;