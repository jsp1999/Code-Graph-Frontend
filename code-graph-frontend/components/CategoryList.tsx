import React from 'react';
import {DataGrid} from "@mui/x-data-grid";
import {Code, DataPoint} from "@/components/CodeList";

interface CategoryListProps {
    dataPoints: DataPoint[]
}

export function getCategoryPoints (categories: { [key: string]: Code }): DataPoint[] {
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


const CategoryList: React.FC<CategoryListProps> = (props: CategoryListProps) => {

    return <>
        <DataGrid
            rows={props.dataPoints}
            columns={[{ field: 'col1', headerName: 'Categories', width: 200}]}
            initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
            }}
        />
    </>;
};

export default CategoryList;
