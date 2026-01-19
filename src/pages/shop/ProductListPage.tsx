import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type {Category} from "../../types/category.ts";
import {getCategoryById} from "../../api/category.api.ts";

async function ProductListPage() {
    const { id } = useParams<{id: string}>();

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            if (!id) return;
            try {
                const data = await getCategoryById(number(id));
                setCategory(data);
            } catch (e) {
                console.log(e);
            }
            fetchInfo().then(() => {});
        }
    }, [id]);
    
    return <></>
}

export default ProductListPage;