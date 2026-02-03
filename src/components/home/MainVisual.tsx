import img01 from "../../assets/images/home/mainVisual01.png";
import img02 from "../../assets/images/home/mainVisual02.png";
import img03 from "../../assets/images/home/mainVisual03.png";
import img04 from "../../assets/images/home/mainVisual04.png";
import img05 from "../../assets/images/home/mainVisual05.png";
import img06 from "../../assets/images/home/mainVisual06.jfif";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Controller, EffectFade, Navigation, Pagination } from "swiper/modules";

const SLIDES = [
    { id: 1, image: img01, title: "WINTER RUNNING", sub: "겨울 러닝을 위한 퍼포먼스 웨어" },
    { id: 2, image: img02, title: "WINTER OUTER", sub: "따뜻한 일상을 위한 겨울 아이템" },
    {
        id: 3,
        image: img03,
        title: "INFINITE RUSH",
        sub: "강력한 추진력과 에너지 리턴의 레이싱 파트너",
    },
    { id: 4, image: img04, title: "사패2", sub: "한국타이어 기술력을 담은 트레일 러닝화" },
    { id: 5, image: img05, title: "HYPER RUSH 2", sub: "지칠 때 더 가볍게, 탄력적인 카본 러닝화" },
    { id: 6, image: img06, title: "MARATHON 220", sub: "클래식이 만든 새로운 속도" },
];

function MainVisual() {
    const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
    const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);

    return (
        <section className={twMerge(["w-full", "flex", "flex-col", "group"])}>
            <div
                className={twMerge([
                    "w-full",
                    "h-[500px]",
                    "md:h-[700px]",
                    "relative",
                    "bg-green-400",
                ])}>
                {/* 첫번째 이미지 슬라이더 */}
                <Swiper
                    onSwiper={setFirstSwiper}
                    controller={{ control: secondSwiper }}
                    loop={true}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation, Controller]}
                    className={twMerge(
                        ["w-full", "h-full"],
                        /*
                         swiper 내부에 존재하는 pagination이라거나, navigation 이라고 하는 요소에는
                         클래스가 이미 정의되어 있음. 우리는 그 클래스"에" 추가 해줘야 함
                     */
                        // ["w-[500px]"]
                        [
                            "[&_.swiper-pagination-bullet-active]:!bg-red-600",
                            "[&_.swiper-pagination-bullet]:!w-30",
                            "[&_.swiper-pagination-bullet]:!rounded-none",
                        ],
                    )}>
                    {SLIDES.map(slide => (
                        <SwiperSlide key={slide.id}>
                            <div
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                }}
                                className={twMerge([
                                    "w-full",
                                    "h-full",
                                    "bg-cover",
                                    "bg-center",
                                    // bg-[url('주소')]
                                    // css로는 background-images: url('주소')
                                    // bg-[url('${slide.image}')
                                    //          -> tailwindcss는 전처리기 : 그냥 이 String을 클래스로 만들어버림
                                ])}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className={twMerge(["w-full", "py-10", "border-b", "border-gray-100"])}>
                {/* 두번째 텍스트 슬라이더 */}
                <div className={twMerge(["container", "mx-auto", "px-4"])}>
                    <Swiper
                        onSwiper={setSecondSwiper}
                        controller={{ control: firstSwiper }}
                        loop={true}
                        effect={"fade"}
                        fadeEffect={{ crossFade: true }}
                        modules={[EffectFade, Controller]}
                        className={twMerge(["w-full", "max-w-4xl", "mx-auto"])}>
                        {SLIDES.map(slide => (
                            <SwiperSlide
                                key={slide.id}
                                className={twMerge(
                                    ["flex", "flex-col", "justify-center", "items-center", "gap-3"],
                                    ["text-center"],
                                )}>
                                <h2
                                    className={twMerge(
                                        ["text-3xl", "md:text-5xl", "italic", "text-black"],
                                        // ["opacity-0", "translate-y-4"],
                                        ["transition-all", "duration-500"],
                                    )}>
                                    {slide.title}
                                </h2>
                                <p
                                    className={twMerge(
                                        ["text-lg", "md:text-xl", "text-gray-600"],
                                        ["transition-all", "duration-500"],
                                    )}>
                                    {slide.sub}
                                </p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default MainVisual;
