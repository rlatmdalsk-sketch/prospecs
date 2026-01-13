import Logo from "../../assets/images/logo_bk.svg";
import { Link, useLocation } from "react-router";
import useLayoutStore from "../../stores/useLayoutStore.ts";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { IoMenu } from "react-icons/io5";

const MENU = [
    {
        name: "RUNNING",
        path: "/running",
        subMenu: [
            { name: "신발", path: "/running/shoes" },
            { name: "의류", path: "/running/clothes" },
            { name: "악세서리", path: "/running/accessories" },
        ],
    },
    {
        name: "SPORTS STYLE",
        path: "/sports-style",
        subMenu: [
            { name: "신발", path: "/sports-style/shoes" },
            { name: "의류", path: "/sports-style/clothes" },
            { name: "악세서리", path: "/sports-style/accessories" },
        ],
    },
    {
        name: "HERITAGE",
        path: "/heritage",
        subMenu: [
            { name: "마라톤 110 파리", path: "/heritage/110-paris" },
            { name: "마라톤 110", path: "/heritage/110" },
            { name: "마라톤 220", path: "/heritage/220" },
            { name: "그랜드 슬램 82", path: "/heritage/grand-slam-82" },
        ],
    },
    {
        name: "SPORTS",
        path: "/sports",
        subMenu: [
            { name: "야구", path: "/sports/baseball" },
            { name: "축구", path: "/sports/football" },
            { name: "농구", path: "/sports/basketball" },
            { name: "기타", path: "/sports/other" },
        ],
    },
    { name: "ONE SPEC", path: "/one-spec" },
    {
        name: "OUR STORY",
        path: "/our-story",
        subMenu: [
            { name: "공식 후원", path: "/our-story/sponsorship" },
            { name: "브랜드 선언", path: "/our-story/manifesto" },
            { name: "시즌 컬렉션", path: "/our-story/collection" },
            { name: "브랜드 가이드", path: "/our-story/guide" },
            { name: "이벤트", path: "/our-story/event" },
        ],
    },
];

function Header() {
    const { pathname } = useLocation();
    const { isTopBannerVisible } = useLayoutStore();

    // 스크롤이 내려갔는지 안 내려갔는지를 체크해서 스타일링을 해줘야 함
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // 사용자가 스크롤을 조금이라도 움직이면 이 handleScroll이라고 하는 함수가 발동되는데
        // 만약 사용자가 Y스크롤의 값을 0보다 크게 가져간다면 (즉, 스크롤을 내렸다면)
        // setIsScrolled의 값을 true로 변환. Y 스크롤의 값이 0이 된다면 false 변환.
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        // addEventListener(동작방식, 함수);
        // addEventListener : 동작방식에 기재한 것을 감지하여 함수를 실행하는 메소드
        // 창 자체에 scroll 이벤트를 감지하는 함수를 만듦
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // isHome : 사용자가 홈에 위치할 때에만 true
    const isHome = pathname === "/";

    // isTransparent : 배경이 투명일 경우엔 사용자가 Home에 위치하고 스크롤이 맨 위에 있을 때만
    const isTransparent = isHome && !isScrolled;

    return (
        <header
            className={twMerge(
                ["fixed", "left-0", "right-0", "z-60"],
                ["transition-all", "duration-300", "border-b"],
                isTransparent
                    ? ["bg-transparent", "border-transparent", "text-white"]
                    : ["bg-white", "border-gray-100"],
                isTopBannerVisible ? ["top-9"] : ["top-0"],
            )}>
            <div
                className={twMerge(
                    ["container", "mx-auto", "px-4", "h-20"],
                    ["flex", "justify-between", "items-center"],
                )}>
                {/* 왼쪽 영역 */}
                <div className={twMerge(["flex", "items-center", "gap-5"])}>
                    <button className={twMerge(["lg:hidden", "text-2xl"])}>
                        <IoMenu />
                    </button>
                    <Link to={"/"}>
                        <img src={Logo} alt={"Logo"} />
                    </Link>
                    {/*메뉴 구성*/}
                    <nav
                        className={twMerge(
                            ["hidden", "flex-1", "lg:flex"],
                            ["justify-center", "gap-10"],
                            ["font-bold"],
                        )}>
                        {MENU.map(menu => (
                            <div
                                key={menu.name}
                                className={twMerge("relative", "group", [
                                    "h-full",
                                    "flex",
                                    "items-center",
                                ])}>
                                <Link
                                    to={menu.path}
                                    className={twMerge(
                                        "group",
                                        "py-7",
                                        "hover:text-black",
                                        "transition-colors",
                                    )}>
                                    {menu.name}
                                    <span
                                        className={twMerge(
                                            "absolute",
                                            "bottom-0",
                                            "left-0",
                                            "h-[2px]",
                                            ["w-0", "h-[2px]"],
                                            ["w-full", "opacity-0", "group-hover:opacity-100"],
                                            ["bg-black", "transition-all", "duration-300"],
                                        )}
                                    />
                                </Link>

                                {/* 서브메뉴 */}
                                {menu.subMenu && menu.subMenu.length > 0 && (
                                    <ul
                                        className={twMerge(
                                            [
                                                "absolute",
                                                "top-full",
                                                "left-1/2",
                                                "-translate-x-1/2",
                                            ],
                                            [
                                                "w-40",
                                                "bg-white",
                                                "border",
                                                "border-gray-100",
                                                "text-black",
                                            ],
                                            ["opacity-0", "group-hover:opacity-100"],
                                            ["invisible", "group-hover:visible"],
                                            ["transition-all", "duration-300"],
                                            ["text-center"],
                                        )}>
                                        {menu.subMenu.map(sub => (
                                            <li key={sub.name}>
                                                <Link
                                                    to={sub.path}
                                                    className={twMerge(
                                                        "block",
                                                        "py-2",
                                                        "text-sm",
                                                        "text-gray-600",
                                                        "hover:text-red-600",
                                                        "hover:bg-ray-500",
                                                        "transition-all",
                                                    )}>
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* 오른쪽 영역 */}
                <div className={twMerge(["flex", "items-center"])}></div>
            </div>
        </header>
    );
}

export default Header;
