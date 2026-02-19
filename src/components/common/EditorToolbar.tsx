import { Editor } from "@tiptap/react";
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdImage,
} from "react-icons/md";

interface ToolbarProps {
    editor: Editor | null;
    onImageUpload: () => void; // 이미지 버튼 클릭 시 실행할 함수
}

const EditorToolbar = ({ editor, onImageUpload }: ToolbarProps) => {
    if (!editor) return null;

    return (
        <div className="border-b border-gray-200 p-2 flex gap-2 bg-gray-50 flex-wrap">
            {/* Bold */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive("bold") ? "bg-gray-200 text-black" : "text-gray-500"
                }`}>
                <MdFormatBold size={20} />
            </button>

            {/* Italic */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive("italic") ? "bg-gray-200 text-black" : "text-gray-500"
                }`}>
                <MdFormatItalic size={20} />
            </button>

            {/* Bullet List */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive("bulletList") ? "bg-gray-200 text-black" : "text-gray-500"
                }`}>
                <MdFormatListBulleted size={20} />
            </button>

            {/* Ordered List */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive("orderedList") ? "bg-gray-200 text-black" : "text-gray-500"
                }`}>
                <MdFormatListNumbered size={20} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            {/* Image Upload Button */}
            <button
                type="button"
                onClick={onImageUpload}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-500">
                <MdImage size={20} />
            </button>
        </div>
    );
};

export default EditorToolbar;
