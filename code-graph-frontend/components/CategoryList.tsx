import React from 'react';
import {DataGrid} from "@mui/x-data-grid";

interface Category {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Category;
    };
}

interface CategoryListProps {
    categories: {
        [key: string]: Category;
    };
}

interface Category {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Category;
    };
}

interface DataPoint {
    id: number;
    col1: string;
}

interface CategoryListProps {
    categories: {
        [key: string]: Category;
    };
}


const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
    const getDataPoints = (categories: { [key: string]: Category }): DataPoint[] => {
        const dataPoints: DataPoint[] = [];

        for (const category of Object.values(categories)) {
            if (Object.keys(category.subcategories).length !== 0) {
                dataPoints.push({ id: category.id, col1: category.name });
            } else {
                dataPoints.push(...getDataPoints(category.subcategories));
            }
        }

        return dataPoints;
    };

    const dataPoints = getDataPoints(categories);

    return <>
        <DataGrid
            rows={dataPoints}
            columns={[{ field: 'col1', headerName: 'Categories', width: 200}]}
            hideFooterPagination
        />
    </>;
};

export default CategoryList;
