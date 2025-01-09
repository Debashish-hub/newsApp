import newsCategoryList from "@/constants/Categories";
import { useCallback, useState } from "react";

export const useNewsCategories = () => {
    const [newsCategories, setNewsCategories] = useState(newsCategoryList);

    const toggleNewsCategory = useCallback((id: number) => {
        setNewsCategories((prevNewsCategories) => {
            return prevNewsCategories.map((category) => ({
                ...category,
                selected: category.id === id ? !category.selected : false,
            }));
        });
    }, []);

    const resetNewsCategory = useCallback(() => {
        setNewsCategories((prevNewsCategories) => {
            return prevNewsCategories.map((category) => ({
                ...category,
                selected: false,
            }));
        });
    }, []);
    return { newsCategories, toggleNewsCategory, resetNewsCategory };
}