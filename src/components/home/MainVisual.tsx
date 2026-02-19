import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Controller, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import img01 from "../../assets/home/mainVisual01.png";
import img02 from "../../assets/home/mainVisual02.png";
import img03 from "../../assets/home/mainVisual03.png";
import img04 from "../../assets/home/mainVisual04.png";
import img05 from "../../assets/home/mainVisual05.png";
import img06 from "../../assets/home/mainVisual06.jpeg";

// 실제 사이트 데이터 기반 더미
const SLIDES = [
    {
        id: 1,
        image: img01,
        title: "WINTER RUNNING",
        sub: "겨울 러닝을 위한 퍼포먼스 웨어",
    },
    {
        id: 2,
        image: img02,
        title: "WINTER OUTER",
        sub: "따뜻한 일상을 위한 겨울 아이템",
    },
    {
        id: 3,
        image: img03,
        title: "INFINITE RUSH",
        sub: "강력한 추진력과 에너지 리턴의 레이싱 파트너",
    },
    {
        id: 4,
        image: img04,
        title: "사패 2",
        sub: "한국타이어 기술력을 담은 트레일 러닝화",
    },
    {
        id: 5,
        image: img05,
        title: "HYPER RUSH 2",
        sub: "지칠 때 더 가볍게, 탄력적인 카본 러닝화",
    },
    {
        id: 6,
        image: img06,
        title: "MARATHON 220",
        sub: "클래식이 만든 새로운 속도",
    },
];

const MainVisual = () => {
    const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
    const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);

    return (
        // [수정 1] flex-col로 변경하여 위아래 배치
        <section className="w-full flex flex-col bg-white group">
            {/* 1. 상단: 이미지 슬라이더 */}
            <div className="w-full h-[500px] md:h-[700px] relative">
                <Swiper
                    onSwiper={setFirstSwiper}
                    controller={{ control: secondSwiper }}
                    loop={true}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation, Controller]}
                    // 이미지 슬라이더 스타일
                    className="h-full w-full [&_.swiper-pagination-bullet-active]:bg-red-600 [&_.swiper-pagination-bullet]:w-3 [&_.swiper-pagination-bullet]:h-3">
                    {SLIDES.map(slide => (
                        <SwiperSlide key={slide.id}>
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}>
                                {/* 이미지만 깔끔하게 보여줌 */}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 2. 하단: 텍스트 슬라이더 (absolute 제거하고 블록 요소로 배치) */}
            <div className="w-full bg-white py-10 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <Swiper
                        onSwiper={setSecondSwiper}
                        controller={{ control: firstSwiper }}
                        loop={true}
                        effect={"fade"}
                        fadeEffect={{ crossFade: true }}
                        modules={[Controller, EffectFade]}
                        allowTouchMove={true} // 이제 따로 터치해서 넘길 수도 있게 함
                        className="w-full max-w-4xl mx-auto">
                        {SLIDES.map(slide => (
                            <SwiperSlide
                                key={slide.id}
                                className="flex flex-col items-center justify-center text-center space-y-3">
                                {/* [수정 2] 글자색을 검정(text-black)으로 변경 */}
                                <h2
                                    className="text-3xl md:text-5xl font-black italic tracking-tighter text-black
                               opacity-0 translate-y-4 transition-all duration-500
                               [.swiper-slide-active_&]:opacity-100 [.swiper-slide-active_&]:translate-y-0">
                                    {slide.title}
                                </h2>

                                <p
                                    className="text-gray-600 text-lg md:text-xl font-medium
                              opacity-0 translate-y-4 transition-all duration-500 delay-100
                              [.swiper-slide-active_&]:opacity-100 [.swiper-slide-active_&]:translate-y-0">
                                    {slide.sub}
                                </p>

                                {/* 버튼 삭제 혹은 스타일 변경 (하단 텍스트 영역에는 보통 버튼이 작게 들어가거나 생략됨) */}
                                {/* 필요하다면 여기에 버튼 추가 */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default MainVisual;