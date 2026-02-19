import { FILTER_GENDERS, FILTER_SIZES, FILTER_STYLES } from "../../constants/filter.const";

interface FilterSidebarProps {
    selectedStyles: string[];
    selectedGenders: string[];
    selectedSizes: string[];
    onFilterChange: (type: "styles" | "genders" | "sizes", value: string) => void;
    onReset: () => void;
}

const FilterSidebar = ({
    selectedStyles,
    selectedGenders,
    selectedSizes,
    onFilterChange,
    onReset,
}: FilterSidebarProps) => {
    return (
        <aside className="w-64 pr-8 space-y-10 h-fit">
            {/* 초기화 버튼 영역 */}
            <div className="flex justify-between items-center pb-4 border-b border-black">
                <h2 className="font-bold text-lg">FILTER</h2>
                <button
                    onClick={onReset}
                    className="text-xs text-gray-500 underline hover:text-black">
                    초기화
                </button>
            </div>

            {/* 종류 (Styles) - 체크박스 */}
            <FilterCheckboxSection
                title="종류"
                data={FILTER_STYLES}
                selectedValues={selectedStyles}
                onChange={value => onFilterChange("styles", value)}
            />

            {/* 성별 (Genders) - 체크박스 */}
            <FilterCheckboxSection
                title="성별"
                data={FILTER_GENDERS}
                selectedValues={selectedGenders}
                onChange={value => onFilterChange("genders", value)}
            />

            {/* 사이즈 (Sizes) - 버튼 */}
            <FilterButtonSection
                title="사이즈"
                data={FILTER_SIZES}
                selectedValues={selectedSizes}
                onChange={value => onFilterChange("sizes", value)}
            />
        </aside>
    );
};

export default FilterSidebar;

interface CheckboxSectionProps {
    title: string;
    data: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (value: string) => void;
}

const FilterCheckboxSection = ({ title, data, selectedValues, onChange }: CheckboxSectionProps) => (
    <div className="space-y-4">
        <h3 className="font-bold text-sm">{title}</h3>
        <div className="space-y-2 pr-2">
            {data.map(item => (
                <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={selectedValues.includes(item.value)}
                        onChange={() => onChange(item.value)}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-black accent-black"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                        {item.label}
                    </span>
                </label>
            ))}
        </div>
    </div>
);

interface ButtonSectionProps {
    title: string;
    data: string[];
    selectedValues: string[];
    onChange: (value: string) => void;
}

const FilterButtonSection = ({ title, data, selectedValues, onChange }: ButtonSectionProps) => (
    <div className="space-y-4">
        <h3 className="font-bold text-sm">{title}</h3>
        <div className="flex flex-wrap gap-2">
            {data.map(item => {
                const isSelected = selectedValues.includes(item);
                return (
                    <button
                        key={item}
                        onClick={() => onChange(item)}
                        className={`text-xs py-2 px-3 border transition-all rounded-sm ${
                            isSelected
                                ? "bg-black text-white border-black font-bold"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}>
                        {item}
                    </button>
                );
            })}
        </div>
    </div>
);
