import { useEffect, useState } from "react";
import type { Category, CategoryTree } from "../../../types/category.ts";
import { deleteAdminCategory, getAdminCategories } from "../../../api/admin.category.api.ts";
import { AxiosError } from "axios";
import Button from "../../../components/common/Button.tsx";
import useModalStore from "../../../store/useModalStore.tsx";

const AdminCategoryList = () => {
    const [categories, setCategories] = useState<CategoryTree[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 데이터 가져오기 및 트리 구조 변환
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAdminCategories();

            // 1. 부모 카테고리만 필터링 (parentId가 null)
            const parents = data.filter(cat => cat.parentId === null);

            // 2. 부모에 자식들(parentId가 부모 id인 것)을 매핑
            const tree = parents.map(parent => ({
                ...parent,
                children: data.filter(cat => cat.parentId === parent.id),
            }));

            setCategories(tree);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "목록을 불러오지 못했습니다.");
            } else {
                setError("알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 모달 상태 관리
    const { openModal } = useModalStore();

    // [핸들러] 등록 모달 열기
    const handleOpenCreate = (parentId: number | null, parentName: string = "") => {
        openModal("CATEGORY_FORM", {
            parentId,
            parentName,
            isEdit: false,
            onSuccess: fetchCategories, // 등록 성공 시 실행할 함수 전달
        });
    };

    // [핸들러] 수정 모달 열기
    const handleOpenEdit = (category: Category) => {
        openModal("CATEGORY_FORM", {
            category,
            isEdit: true,
            onSuccess: fetchCategories,
        });
    };

    // [핸들러] 삭제 확인 모달 열기
    const handleDelete = (id: number, name: string) => {
        openModal("CONFIRM", {
            title: "카테고리 삭제",
            message: `'${name}' 카테고리를 삭제하시겠습니까?\n하위 카테고리가 있다면 함께 삭제되거나 에러가 발생할 수 있습니다.`,
            isDanger: true,
            onConfirm: async () => {
                try {
                    await deleteAdminCategory(id); // API 호출
                    alert("삭제되었습니다.");
                    fetchCategories(); // 새로고침
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    alert("삭제 실패: 하위 항목이 있거나 상품이 연결되어 있을 수 있습니다.");
                }
            },
        });
    };

    if (loading) return <div className="p-8">로딩 중...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">카테고리 관리</h2>
                <Button variant={"primary"} size={"sm"} onClick={() => handleOpenCreate(null)}>
                    + 1차 카테고리 추가
                </Button>
            </div>

            {/* 카테고리 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(parent => (
                    <div
                        key={parent.id}
                        className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col gap-4 relative group">
                        {/* 1차 카테고리 이름 + Path */}
                        <div className="flex justify-between items-start border-b pb-3 border-gray-100">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">{parent.name}</h3>
                                <span className="text-xs text-gray-400 font-mono">
                                    /{parent.path}
                                </span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenEdit(parent)}
                                    className="text-xs text-gray-400 hover:text-black font-bold">
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(parent.id, parent.name)}
                                    className="text-xs text-gray-400 hover:text-red-600 font-bold">
                                    삭제
                                </button>{" "}
                            </div>
                        </div>

                        {/* 2차 카테고리 목록 (Table) */}
                        <div className="flex-1 p-0">
                            {parent.children.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                                            <tr>
                                                <th className="px-5 py-3 font-medium w-1/3">
                                                    이름
                                                </th>
                                                <th className="px-5 py-3 font-medium w-1/3">
                                                    Path
                                                </th>
                                                <th className="px-5 py-3 font-medium text-right">
                                                    관리
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {parent.children.map(child => (
                                                <tr
                                                    key={child.id}
                                                    className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-5 py-3 font-medium text-gray-900">
                                                        {child.name}
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                                                        {child.path}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <div className="flex justify-end gap-2 text-xs">
                                                            <button
                                                                onClick={() =>
                                                                    handleOpenEdit(child)
                                                                }
                                                                className="text-gray-400 hover:text-black">
                                                                수정
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        child.id,
                                                                        child.name,
                                                                    )
                                                                }
                                                                className="text-gray-400 hover:text-red-600">
                                                                삭제
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    하위 카테고리가 없습니다.
                                </div>
                            )}
                        </div>

                        {/* 2차 카테고리 추가 버튼 */}
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            onClick={() => handleOpenCreate(parent.id, parent.name)}>
                            + 하위 카테고리 추가
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCategoryList;
