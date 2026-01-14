import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { RegisterFormType } from "../types/user.ts";
import { twMerge } from "tailwind-merge";
import Input from "../components/common/input.tsx";

function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormType>(
        {
            defaultValues:{
                gender: "MALE",
                emailOptIn: false,
                smsOptIn: false
            }
        }
    );

    const onSubmit = (data: RegisterFormType) => {

    }

    return <>
        <div className={twMerge("flex","flex-col","min-h-[80dvh]","px-4","py-40")}>
            <h2 className={twMerge("text-3xl","font-bold","text-center","mb-10")}>
                JOIN MEMBER
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className={twMerge(["w-full","max-w-lg"],["flex","flex-col","gap-5"])}>
                <div>
                    <Input fullWidth={true}
                           placeholder={"이메일을 입력해주세요"}
                           type={"email"}
                           registration={register("email",{
                               required: "이메일은 필수값입니다.",
                               pattern:{
                                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                   message: "올바른 이메일 형식이 아닙니다."
                               }
                           })}
                           error={errors.email}
                    />
                    <div className={twMerge("flex","items-center","gap-2")}>
                        <input type={"checkbox"} id={"emailOptIn"} {...register("emailOptIn")} />
                        <label htmlFor={"emailOptIn"}>이메일 수신 동의</label>
                    </div>
                </div>
            </form>
        </div>
    </>
}

export default Register;