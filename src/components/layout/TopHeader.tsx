import useLayoutStore from "../../stores/useLayoutStore.ts";
import { twMerge } from "tailwind-merge";
import { IoClose } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const NOTICES = [
    "[공지] 네이버페이 일시 이용 중단",
    "APP 다운로드 시 3,000포인트 증정",
    "카카오톡 채널 친구 추가 시 5,000원 쿠폰 증정",
];

function TopHeader() {
    const { isTopBannerVisible, hideTopBanner } = useLayoutStore();
    if (!isTopBannerVisible) return null;

    return (
        <div
            className={twMerge(
                ["relative", "h-9", "bg-black", "text-white"],
                ["flex", "justify-center", "items-center"],
            )}>
            {/* 슬라이드 */}
            <Swiper
                direction={"vertical"}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay]}
                className={twMerge(["w-full", "h-full", "max-w-lg"])}>
                {NOTICES.map((notice, index) => (
                    <SwiperSlide
                        key={index}
                        className={twMerge([
                            "w-full",
                            "h-full",
                            "!flex",    // CSS에서 !important로 우선순위를 준 것 처럼 동작
                            "justify-center",
                            "items-center",
                        ])}>
                        <div className={twMerge(["text-xs", "cursor-pointer", "hover:underline"])}>
                            {notice}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 버튼 */}
            <button
                onClick={hideTopBanner}
                className={twMerge(["absolute", "right-4", "text-white", "cursor-pointer"])}>
                <IoClose />
            </button>
        </div>
    );
}

export default TopHeader;
