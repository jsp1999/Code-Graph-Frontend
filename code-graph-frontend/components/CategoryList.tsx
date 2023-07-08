import React from 'react';
import {DataGrid} from "@mui/x-data-grid";

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

export function getCategoryPoints (categories: { [key: string]: Category }): DataPoint[] {
    const dataPoints: DataPoint[] = [];

    for (const category of Object.values(categories)) {
        if (Object.keys(category.subcategories).length !== 0) {
            dataPoints.push({ id: category.id, col1: category.name });
        } else {
            dataPoints.push(...getCategoryPoints(category.subcategories));
        }
    }

    return dataPoints;
}


const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {

    const dataPoints = getCategoryPoints(categories);

    return <>
        <DataGrid
            rows={dataPoints}
            columns={[{ field: 'col1', headerName: 'Categories', width: 200}]}
            initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
            }}
        />
    </>;
};

export default CategoryList;
