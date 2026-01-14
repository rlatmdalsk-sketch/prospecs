import img01 from "../../assets/images/home/mainvisual1.png";
import img02 from "../../assets/images/home/mainvisual2.png";
import img03 from "../../assets/images/home/mainvisual3.png";
import img04 from "../../assets/images/home/mainvisual4.png";
import img05 from "../../assets/images/home/mainvisual5.png";
import img06 from "../../assets/images/home/mainvisual6.png";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import type { Swiper as SwiperType } from "swiper"; // Swiper 타입 이름 지정
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, EffectFade, Navigation, Pagination } from "swiper/modules";

const SLIDES = [
    { id: 1, image: img01, title: "MARATHON 220", sub: "클래식이 만든 새로운 속도" },
    { id: 2, image: img02, title: "WINTER OUTER", sub: "따뜻한 일상을 위한 겨울 아이템" },
    { id: 3, image: img03, title: "WINTER RUNNING", sub: "겨울 러닝을 위한 퍼포먼스 웨어" },
    {
        id: 4,
        image: img04,
        title: "INFINITE RUSH",
        sub: "강력한 추진력과 에너지 리턴의 레이싱 파트너",
    },
    { id: 5, image: img05, title: "사패 2    ", sub: "한국타이어 기술력을 담은 트레일 러닝화" },
    { id: 6, image: img06, title: "HYPER RUSH 2", sub: "지칠 때 더 가볍게, 탄력적인 카본 러닝화" },
];

function MainVisual() {
    const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
    const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);

    return (
        <section className={twMerge("w-full", "flex", "flex-col", "group")}>
            {/*이미지 슬라이더*/}
            <div
                className={twMerge(
                    "w-full",
                    "h-[500px]",
                    "md:h-[700px]",
                    "relative",
                    "bg-green-500",
                )}>
                <Swiper
                    onSwiper={setFirstSwiper} //swiper에서 함수작용
                    controller={{control: secondSwiper}}
                    loop={true}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    modules={[Autoplay, Pagination, Navigation, Controller]}
                    navigation={true}
                    //swiper 내부에 존재하는 pagination, navigation 등등 요소에는 클래스가 이미 정의되어있음 우리는 그 클래스에 따로 추가해줘야함
                    className={twMerge("w-full", "h-full", [
                        "[&_.swiper-pagination-bullet-active]:!bg-gray-200", //페이지네이션 클래스
                        "[&_.swiper-pagination-bullet]:!w-40",
                        "[&_.swiper-pagination-bullet]:!h-0.5",
                        "[&_.swiper-pagination-bullet]:!rounded-none",
                        "[&_.swiper-pagination-bullet]:!m-0",
                    ])}>
                    {SLIDES.map(slide => (
                        <SwiperSlide key={slide.id}>
                            <div
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                }}
                                className={twMerge("w-full", "h-full", "bg-cover", "bg-center")}
                            />
                            {/* bg-[url('주소')] = background-images: url('주소')
                           단, 주소에 변수가 들어갈경우 테일윈드는 js가 안되므로 따로 style로 작성 */}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/*텍스트 슬라이더*/}
            <div className={twMerge("container", "mx-auto", "py-10")}>
                <Swiper
                    controller={{control: firstSwiper}} //이미지 슬라이더의 내용을 넣음
                    onSwiper={setSecondSwiper}
                    loop={true}
                    effect={"fade"}
                    fadeEffect={{crossFade:true}}
                    modules={[EffectFade, Controller]}

                    className={twMerge("container", "mx-auto", "px-4")}>
                    {SLIDES.map(slide => (
                        <SwiperSlide
                            key={slide.id}
                            className={twMerge(
                                "flex",
                                "flex-col",
                                ["justify-center", "items-center"],
                                "text-center",
                                "gap-3",
                            )}>
                            <h2
                                className={twMerge(
                                    ["text-3xl", "md:text-5xl", "text-bold", "text-black"],
                                    [
                 /*                       "opacity-0",
                                        "translate-y-4"*/,
                                        "transition-all",
                                        "duration-500",
                                    ],
                                )}>
                                {slide.title}
                            </h2>
                            <p className={twMerge(["text-lg","md:text-xl","text-[#555]",["transition-all","duration-500"]])}>{slide.sub}</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default MainVisual;
