import React from 'react';
import {DataGrid} from "@mui/x-data-grid";

interface Code {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Code;
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

interface CodeListProps {
    categories: {
        [key: string]: Code;
    };
    handleItemClick : (daten: string) => void;
    selectedItems: string[];
}

const CodeList: React.FC<CodeListProps> = (props: CodeListProps) => {
    const getDataPoints = (categories: { [key: string]: Category }): DataPoint[] => {
        const dataPoints: DataPoint[] = [];

        for (const category of Object.values(categories)) {
            if (Object.keys(category.subcategories).length === 0) {
                dataPoints.push({ id: category.id, col1: category.name });
            } else {
                dataPoints.push(...getDataPoints(category.subcategories));
            }
        }

        return dataPoints;
    };

    const dataPoints = getDataPoints(props.categories);
    const getItemById = (id: number): string => {
        return dataPoints.find((dataPoint) => dataPoint.id === id)?.col1!;
    };

    return <>
        <DataGrid
            rows={dataPoints}
            columns={[{ field: 'col1', headerName: 'Codes', width: 200}]}
            initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
            }}
            rowSelectionModel={props.selectedItems}
            onCellClick={(params, event, details) =>
                props.handleItemClick(getItemById(params.id as number))
            }
        />
    </>;
};

export default CodeList;
