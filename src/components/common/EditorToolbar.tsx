import type { Editor } from "@tiptap/react";
import { twMerge } from "tailwind-merge";
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdImage,
} from "react-icons/md";

interface EditorToolbarProps {
    editor: Editor | null;
    onImageUpload: () => void;
}

function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
    if (!editor) return null;

    return (
        <div
            className={twMerge(
                "border-b",
                "border-gray-200",
                "p-2",
                "flex",
                "gap-2",
                "by-gray-50",
                "flex-wrap",
            )}>
            <button
                type={"button"}
                className={twMerge(
                    "p-2",
                    "rounded",
                    "hover:bg-gray-200",
                    "transition-all",
                    editor.isActive("bold") ? ["bg-gray-800", "text-white"] : "text-gray-500",
                )}
                onClick={() => editor.chain().focus().toggleBold().run()}>
                <MdFormatBold size={20} />
            </button>{" "}
            <button
                type={"button"}
                className={twMerge(
                    "p-2",
                    "rounded",
                    "hover:bg-gray-200",
                    "transition-all",
                    editor.isActive("Italic") ? ["bg-gray-800", "text-white"] : "text-gray-500",
                )}
                onClick={() => editor.chain().focus().toggleItalic().run()}>
                <MdFormatItalic size={20} />
            </button>
            <button
                type={"button"}
                className={twMerge(
                    "p-2",
                    "rounded",
                    "hover:bg-gray-200",
                    "transition-all",
                    editor.isActive("OrderedList")?["bg-gray-800","text-white"]:"text-gray-500")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <MdFormatListNumbered size={20} />
            </button>
            <button
                type={"button"}
                className={twMerge(
                    "p-2",
                    "rounded",
                    "hover:bg-gray-200",
                    "transition-all",
                    editor.isActive("BulletList")?["bg-gray-800","text-white"]:"text-gray-500")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <MdFormatListBulleted size={20} />
            </button>
            <button
                type={"button"}
                onClick={onImageUpload}
                className={twMerge(
                    ["p-2", "rounded", "hover:bg-gray-200", "transition-all"]
                )}>
                <MdImage size={20} />
            </button>
        </div>
    );
}

export default EditorToolbar;
