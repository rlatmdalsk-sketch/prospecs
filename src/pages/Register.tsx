import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/auth.api";
import { AxiosError } from "axios";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import type { RegisterProps } from "../types/user.ts";

const Signup = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterProps>({
        mode: "onBlur",
        defaultValues: {
            gender: "MALE",
            emailOptIn: false,
            smsOptIn: false,
        },
    });

    const password = watch("password");

    const onSubmit = async (data: RegisterProps) => {
        setServerError("");
        try {
            await registerUser(data);
            alert("회원가입이 완료되었습니다. 로그인해주세요.");
            navigate("/login");
        } catch (error) {
            if (error instanceof AxiosError) {
                setServerError(error.response?.data?.message || "회원가입에 실패했습니다.");
            } else {
                setServerError("오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-40 px-4">
            <h2 className="text-3xl font-bold mb-10">JOIN MEMBER</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg flex flex-col gap-5">
                <div>
                    <Input
                        type="email"
                        placeholder="이메일 (아이디)"
                        error={errors.email}
                        registration={register("email", {
                            required: "이메일을 입력해주세요.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "올바른 이메일 형식이 아닙니다.",
                            },
                        })}
                    />
                    <div className="flex items-center gap-2 mt-2 px-1">
                        <input
                            type="checkbox"
                            id="emailOptIn"
                            className="accent-black w-4 h-4"
                            {...register("emailOptIn")}
                        />
                        <label
                            htmlFor="emailOptIn"
                            className="text-sm text-gray-600 cursor-pointer">
                            이메일 수신 동의
                        </label>
                    </div>
                </div>

                <Input
                    type="password"
                    placeholder="비밀번호 (6자 이상)"
                    error={errors.password}
                    registration={register("password", {
                        required: "비밀번호를 입력해주세요.",
                        minLength: {
                            value: 6,
                            message: "비밀번호는 최소 6자 이상이어야 합니다.",
                        },
                    })}
                />

                <Input
                    type="password"
                    placeholder="비밀번호 확인"
                    error={errors.passwordConfirm}
                    registration={register("passwordConfirm", {
                        required: "비밀번호 확인을 입력해주세요.",
                        validate: value => value === password || "비밀번호가 일치하지 않습니다.",
                    })}
                />

                <Input
                    type="text"
                    placeholder="이름"
                    error={errors.name}
                    registration={register("name", {
                        required: "이름을 입력해주세요.",
                        minLength: { value: 2, message: "이름은 2글자 이상 입력해주세요." },
                    })}
                />

                <div>
                    <Input
                        type="text"
                        placeholder="휴대폰 번호 (-없이 입력)"
                        error={errors.phone}
                        registration={register("phone", {
                            required: "휴대폰 번호를 입력해주세요.",
                            pattern: {
                                value: /^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/,
                                message: "올바른 휴대폰 번호 형식이 아닙니다. (- 제외)",
                            },
                        })}
                    />
                    <div className="flex items-center gap-2 mt-2 px-1">
                        <input
                            type="checkbox"
                            id="smsOptIn"
                            className="accent-black w-4 h-4"
                            {...register("smsOptIn")}
                        />
                        <label htmlFor="smsOptIn" className="text-sm text-gray-600 cursor-pointer">
                            SMS 수신 동의
                        </label>
                    </div>
                </div>

                <div className="flex gap-2 items-start">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="생년월일 (YYYYMMDD)"
                            maxLength={8}
                            error={errors.birthdate}
                            registration={register("birthdate", {
                                required: "생년월일을 입력해주세요.",
                                minLength: { value: 8, message: "8자리로 입력해주세요." },
                                maxLength: { value: 8, message: "8자리로 입력해주세요." },
                                pattern: { value: /^[0-9]+$/, message: "숫자만 입력해주세요." },
                            })}
                        />
                    </div>

                    <div className="w-32">
                        <Select
                            options={[
                                { value: "MALE", label: "남성" },
                                { value: "FEMALE", label: "여성" },
                            ]}
                            error={errors.gender}
                            registration={register("gender")}
                        />
                    </div>
                </div>

                {serverError && <p className="text-red-600 text-sm text-center">{serverError}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors mt-4 disabled:bg-gray-400">
                    회원가입
                </button>
            </form>
        </div>
    );
};

export default Signup;
