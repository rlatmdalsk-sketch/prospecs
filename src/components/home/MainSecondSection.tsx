import { twMerge } from "tailwind-merge";
import men from "../../assets/images/home/man.png";
import girl from "../../assets/images/home/girl.png";

function MainSecondSection() {
    return (
        <section className={twMerge("w-full", "flex", "h-150", "mt-20")}>
            <Card image={men} title={"Men"} />
            <Card image={girl} title={"Women"} />
        </section>
    );
}

export default MainSecondSection;

type CardProps = {
    image: string;
    title: string;
}

function Card({image, title}:CardProps) {
    return <>
        <div
            className={twMerge(
                "w-full",
                "flex",
                "justify-center",
                "items-center",
                ["group"],
                "relative",
                "overflow-hidden",
            )}>
            <div
                className={twMerge(
                    "absolute",
                    "top-0",
                    "left-0",
                    "w-full",
                    "h-full",
                    "-z-1",
                    ["group", "group-hover:scale-105","group-hover:blur-md"],
                    ["transition-all", "duration-300"],
                )}
                style={{ backgroundImage: `url(${image}` }}
            />
            <span
                className={twMerge(
                    "text-5xl",
                    "italic",
                    "font-bold",
                    "text-white",
                    ["transition-all", "duration-300"],
                    ["group", "group-hover:border-white"],
                    ["border-transparent", "border-b-2"],
                )}>
                    {title}
                </span>
        </div>
    </>
}