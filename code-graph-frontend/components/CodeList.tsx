import React from 'react';
import {DataGrid} from "@mui/x-data-grid";

export interface Code {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Code;
    };
}

export interface DataPoint {
    id: number;
    col1: string;
}

interface CodeListProps {
    categories: {
        [key: string]: Code;
    };
    handleItemClick : (daten: string) => void;
    selectedItems: string[];
}

export function getCodePoints(categories: { [key: string]: Code }): DataPoint[] {
    const dataPoints: DataPoint[] = [];

    for (const category of Object.values(categories)) {
        dataPoints.push({ id: category.id, col1: category.name });

        if (Object.keys(category.subcategories).length !== 0) {
            dataPoints.push(...getCodePoints(category.subcategories));
        }
    }

    return dataPoints;
}

const CodeList: React.FC<CodeListProps> = (props: CodeListProps) => {
    const dataPoints = getCodePoints(props.categories);
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
