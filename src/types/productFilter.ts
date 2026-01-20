// 1. 종류 (Styles) - 백엔드 ProductStyle Enum과 매핑
export const FILTER_STYLES = [
    { label: "레이싱화", value: "RACING" },
    { label: "경량레이싱화", value: "LIGHTWEIGHT_RACING" },
    { label: "안정화", value: "STABILITY" },
    { label: "쿠션화", value: "CUSHION" },
    { label: "트레일러닝화", value: "TRAIL_RUNNING" },
    { label: "긴바지", value: "LONG_PANTS" },
    { label: "긴팔티셔츠", value: "LONG_SLEEVE" },
    { label: "다운", value: "DOWN" },
    { label: "다운베스트", value: "DOWN_VEST" },
    { label: "레깅스", value: "LEGGINGS" },
    { label: "민소매", value: "SLEEVELESS" },
    { label: "반바지", value: "SHORT_PANTS" },
    { label: "반팔티셔츠", value: "SHORT_SLEEVE" },
    { label: "베스트", value: "VEST" },
    { label: "언더웨어상의", value: "UNDERWEAR_TOP" },
    { label: "자켓", value: "JACKET" },
    { label: "집업긴팔티셔츠", value: "ZIPUP_LONG" },
    { label: "트레이닝상의", value: "TRAINING_TOP" },
    { label: "트레이닝하의", value: "TRAINING_BOTTOM" },
    { label: "후드티셔츠", value: "HOODIE" },
    { label: "경기복", value: "UNIFORM" },
    { label: "야구화", value: "BASEBALL_SHOE" },
    { label: "어센틱모자", value: "AUTHENTIC_CAP" },
];

// 2. 성별 (Genders) - 백엔드 ProductGender Enum과 매핑
export const FILTER_GENDERS = [
    { label: "남성", value: "MALE" },
    { label: "여성", value: "FEMALE" },
    { label: "성인공통", value: "COMMON" },
];

// 3. 사이즈 (Sizes) - 문자열 그대로 사용
export const FILTER_SIZES = [
    // 신발 사이즈
    "230",
    "235",
    "240",
    "245",
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
    "290",
    "85",
    "90",
    "95",
    "100",
    "105",
    "110",
    "115",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
];