import { twMerge } from "tailwind-merge";
import men from "../../assets/images/home/main_men.png";
import women from "../../assets/images/home/main_women.png";

function MainSecondSection() {
    return (
        <section className={twMerge(["w-full", "flex", "h-150"])}>
            <Card image={men} title={"Men"} />
            <Card image={women} title={"Women"} />
        </section>
    );
}

export default MainSecondSection;

type CardProps = {
    image: string;
    title: string;
};

function Card({ image, title }: CardProps) {
    return (
        <div
            className={twMerge(
                ["w-full", "flex", "justify-center", "items-center"],
                ["relative", "group", "overflow-hidden"],
            )}>
            <div
                className={twMerge(
                    ["absolute", "top-0", "left-0", "w-full", "h-full"],
                    ["-z-1", "group", "group-hover:scale-105"],
                    ["transition-all", "duration-300"],
                )}
                style={{ backgroundImage: `url(${image})` }}
            />
            <span
                className={twMerge(
                    ["text-5xl", "italic", "font-bold", "text-white"],
                    ["border-b-2", "border-transparent"],
                    ["transition-all", "duration-300"],
                    ["group", "group-hover:border-white"],
                )}>
                {title}
            </span>
        </div>
    );
}
