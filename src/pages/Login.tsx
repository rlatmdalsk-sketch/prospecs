import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { LoginFormType } from "../types/user.ts";
import { twMerge } from "tailwind-merge";
import Input from "../components/common/Input.tsx";
import Button from "../components/common/Button.tsx";
import { loginUser } from "../api/auth.api.ts";
import { AxiosError } from "axios";
import useAuthStore from "../stores/useAuthStore.ts";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormType>();

    const onSubmit = async (data: LoginFormType) => {
        setError("root", { message: "" });
        try {
            const response = await loginUser(data);
            // 사용자 정보를 저장
            login(response.token, response.user);
            alert("로그인 되었습니다.");
            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError("root", {
                    message: error.response?.data.message || "로그인이 실패했습니다. ",
                });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "justify-center", "items-center"],
                ["min-h-[80dvh]", "py-40", "px-4"],
            )}>
            <h2 className={twMerge(["text-3xl", "font-bold", "text-center", "mb-10"])}>LOGIN</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["w-full", "max-w-lg"], ["flex", "flex-col", "gap-5"])}>
                <Input
                    fullWidth={true}
                    placeholder={"이메일을 입력해주세요."}
                    type={"email"}
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
                    type={"password"}
                    placeholder={"비밀번호 (6자 이상)"}
                    error={errors.password}
                    registration={register("password", {
                        required: "비밀번호는 필수값입니다.",
                        minLength: {
                            value: 6,
                            message: "비밀번호는 최소 6자 이상이어야 합니다.",
                        },
                    })}
                />

                {errors.root && (
                    <p className={twMerge(["text-red-600", "text-sm", "text-center"])}>
                        {errors.root.message}
                    </p>
                )}

                <Button type={"submit"} isLoading={isSubmitting} fullWidth={true} size={"lg"}>
                    로그인
                </Button>

                <div className={twMerge(["w-full", "mt-6", "flex", "justify-end"])}>
                    <Link
                        to={"/register"}
                        className={twMerge(["text-gray-500", "hover:text-black"])}>
                        회원가입
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
