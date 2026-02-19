import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { IoClose } from "react-icons/io5";
import "swiper/css";
import useLayoutStore from "../../store/useLayoutStore.ts";

const NOTICES = [
    "[공지] 네이버페이 일시 이용 중단 안내",
    "APP 다운로드 시 3,000포인트 증정",
    "카카오톡 채널 친구 추가 시 5,000원 쿠폰 증정",
];

const TopBanner = () => {
    const { isTopBannerVisible, hideTopBanner, topBannerHeight } = useLayoutStore();
    if (!isTopBannerVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60]">
            <div
                className="relative bg-black text-white flex items-center justify-center overflow-hidden transition-all duration-300"
                style={{ height: `${topBannerHeight}px` }}>
                <Swiper
                    direction={"vertical"}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    modules={[Autoplay]}
                    className="h-full w-full max-w-lg">
                    {NOTICES.map((notice, index) => (
                        <SwiperSlide
                            key={index}
                            className="h-full !flex !items-center !justify-center text-xs">
                            <div className="cursor-pointer hover:underline">{notice}</div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    onClick={hideTopBanner}
                    className="absolute right-4 text-white text-lg p-1"
                    aria-label="Close Top Banner">
                    <IoClose />
                </button>
            </div>
        </div>
    );
};

export default TopBanner;
