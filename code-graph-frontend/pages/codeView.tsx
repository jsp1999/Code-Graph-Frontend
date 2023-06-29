import Link from "next/link";
import data from "../src/data.json";
import React, {useEffect, useRef, useState} from "react";
import icon from '../public/code_icon.svg';
import Image from "next/image";
import Header from "@/components/Header";
import {Modal} from "@mui/material";
import {Button} from "@mui/material";
import { getCodes } from "@/src/api";
import { DataGrid } from '@mui/x-data-grid';
import CodeItem from "@/components/CodeItem";
import ContextMenu from "@/components/ContextMenu";

export default function CodeView() {
    const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
    const [itemCount, setItemCount] = useState(0);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [rightClickedItem, setRightClickedItem] = useState("")
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;
        setContextMenuPosition({ x: clientX, y: clientY });
        setShowContextMenu(true);
    };

    const fetchCode = async (datasetName: string) => {
        try {
            return await getCodes(datasetName);
        } catch (error) {
            console.error('Error fetching codes:', error);
        }
    };

    const fetchData = async () => {
        const result = await fetchCode("few_nerd");
        console.log("codes", result);
    };

    console.log("codes")
    console.log(fetchData())

    const handleContextMenuAction = (action: string) => {
        if(action === "unselect") {
            selectedItems.splice(selectedItems.indexOf(rightClickedItem), 1);
            setItemCount(itemCount - 1);
        }
        if(action === "add to category") {
            handleOpen()
        }
        setShowContextMenu(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target as Node)
            ) {
                setShowContextMenu(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const exampleRows = [
        { id: 1, col1: 'Hello' },
        { id: 2, col1: 'DataGridPro' },
        { id: 3, col1: 'MUI' },
    ];

    // it is a little spaghetti but it works
    const jsonString = JSON.stringify(data, null, 2);
    const jsonData = JSON.parse(jsonString);

    // Map over the JSON object and access "daten" property
    const datenList = Object.keys(jsonData)
        .slice(0, 200) // Slice the first ten elements
        .map(key => jsonData[key].daten);

    // Handle item click event
    const handleItemClick = (daten: string) => {
        if (itemCount <= 8){
            if(!selectedItems.includes(daten)) {
                selectedItems.push(daten);
                setItemCount(itemCount + 1);
            } else {
                selectedItems.splice(selectedItems.indexOf(daten), 1);
                setItemCount(itemCount - 1);
            }
        }
    };


    return (
        <div>
            <Header title="Code View"/>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[15rem]">
                    <div>modal Text</div>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                </div>
            </Modal>
            <div className="w-[20%] max-h-[600px] float-left ml-3">
                <DataGrid
                    rows={exampleRows}
                    columns={[{ field: 'col1', headerName: 'Codes', width: 300 }]}
                    rowSelectionModel={selectedItems}
                    onCellClick={(params, event, details) =>
                        handleItemClick(exampleRows[params.id as number - 1].col1)
                }
                />
            </div>
            <div className="grid grid-cols-4 gap-10 w-fit float-left ml-6">
            {selectedItems.length <= 8 && (
                selectedItems.map((value, index) =>
                <div className="w-24" key={index} onContextMenu={(e: React.MouseEvent) => {
                    handleContextMenu(e);
                    setRightClickedItem(value);
                }} ref={contextMenuRef}>
                    <CodeItem value={value} />
                    {showContextMenu && (
                        <ContextMenu
                            contextMenuPosition={contextMenuPosition}
                            handleContextMenuAction={handleContextMenuAction}
                            contextMenuItems={["unselect", "add to category"]} />
                    )}
                </div>
                )
            )}
            </div>
            <div className="max-h-[400px] w-[20%] float-right mr-3 overflow-auto">
            <table className="table-auto border-2">
                <thead className="border-2 bg-gray-100">
                <tr>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                </tr>
                </tbody>
            </table>
            </div>
            <div className="absolute right-5 bottom-5 bg-blue-900 rounded">
                <Button variant="contained" className="">
                    <Link href="/clusterView">Change View</Link>
                </Button>
            </div>
        </div>
    )
}