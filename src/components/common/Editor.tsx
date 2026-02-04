import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { twMerge } from "tailwind-merge";
import image from "@tiptap/extension-image";
import EditorToolbar from "./EditorToolbar.tsx";
import { uploadImage } from "../../api/upload.api.ts";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function Editor({ value, onChange, placeholder }: EditorProps) {
    const editor = useEditor({
        extensions: [StarterKit,
        image.configure({
            inline: true,
            allowBase64: false,
        })
        ],
        content: value, // 초기값
        onUpdate: ({ editor }) => {
            // 에디터 안의 내용이 변경이 될 때마다 실행되는 내용을 적어줌
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: twMerge("min-h-[300px]")
            }
        }
    });

    const handleImageUpload = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            
            try {
                const url = await uploadImage(file, "editor");

                if (editor) {
                    editor.chain().focus().setImage({src:url}).run();
                }
            } catch (error) {
                console.log(error);
                alert("이미지 업로드 실패");
            }
            
        }
    }

    return (
        <>
        <div
            className={twMerge(
                ["border", "border-gray-300", "rounded-lg", "overflow-hidden"],
                ["bg-white", "flex", "flex-col", "h-125"],
            )}>
            <div className={twMerge("flex-none","z-10")}>
                <EditorToolbar editor={editor} onImageUpload={handleImageUpload}/>
            </div>
            <div className={twMerge(["grow", "overflow-y-auto", "cursor-text"])}>
                <EditorContent editor={editor} placeholder={placeholder} className={"h-full"} />
            </div>
        </div>
        </>
    );
}

export default Editor;