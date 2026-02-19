import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import EditorToolbar from "./EditorToolbar";
import { uploadImage } from "../../api/upload.api.ts";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const Editor = ({ value, onChange, placeholder }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: false, // Base64 대신 URL 사용 강제
            }),
        ],
        content: value, // 초기값 설정
        editorProps: {
            attributes: {
                // Tailwind 스타일 적용 (기본 min-height, focus outline 제거 등)
                class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4",
            },
        },
        onUpdate: ({ editor }) => {
            // 내용이 변경될 때마다 HTML을 부모에게 전달
            onChange(editor.getHTML());
        },
    });

    // 외부에서 value가 바뀌었을 때 (예: 수정 페이지 진입 시 초기 데이터 로드) 에디터 내용 업데이트
    // 단, 타이핑 중에는 커서 튐 방지를 위해 업데이트 하지 않음
    useEffect(() => {
        if (editor && value && editor.getHTML() !== value) {
            // 내용이 비어있거나 완전히 다를 때만 setContent (초기 로딩용)
            if (editor.getText() === "" && !value.includes("<img")) {
                // 텍스트만 비교했을 때 비어있으면 넣는다 등 조건 조절 가능
                // 가장 간단하게는:
                editor.commands.setContent(value);
            } else if (value !== editor.getHTML()) {
                // 수정 페이지 로드 시점 등을 위해 필요
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    // 이미지 핸들러
    const handleImageUpload = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                // 관리자 업로드 API 호출
                const url = await uploadImage(file, "editor");

                // 에디터에 이미지 삽입
                if (editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            } catch (error) {
                console.error("Image upload failed", error);
                alert("이미지 업로드 실패");
            }
        };
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-black transition-colors flex flex-col h-[500px]">
            {/* 툴바는 고정 (flex-none) */}
            <div className="flex-none z-10">
                <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
            </div>

            {/* [수정] 에디터 본문 영역: 남은 공간 차지(flex-grow) + 스크롤(overflow-y-auto) */}
            <div
                className="grow overflow-y-auto cursor-text"
                onClick={() => editor?.chain().focus().run()} // 빈 공간 클릭 시 에디터 포커스
            >
                <EditorContent editor={editor} className="h-full" placeholder={placeholder} />
            </div>
        </div>
    );
};

export default Editor;
