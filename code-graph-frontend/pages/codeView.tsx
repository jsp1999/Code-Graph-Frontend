import Link from "next/link";
import data from "../src/data.json";
import React, {useEffect, useRef, useState} from "react";
import icon from '../public/code_icon.svg';
import Image from "next/image";
import Header from "@/components/Header";
import {Modal} from "@mui/material";
import {Button} from "@mui/material";
import { getCodes } from "@/src/api";

export default function CodeView() {
    const [selectedItem, setSelectedItem] = useState<Array<string>>([]);
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
            selectedItem.splice(selectedItem.indexOf(rightClickedItem), 1);
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
            if(selectedItem.indexOf(daten) <= -1) {
                selectedItem.push(daten);
                setItemCount(itemCount + 1);
            } else {
                selectedItem.splice(selectedItem.indexOf(daten), 1);
                setItemCount(itemCount - 1);
            }
        }
    };


    return (
        <div>
            <Header />
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[15rem]">
                    <div>modal Text</div>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                </div>
            </Modal>
            <div className="w-[20%] max-h-[600px] overflow-auto float-left ml-3">
            <table className="table-auto border-2">
                <thead className="border-2 bg-gray-100">
                <tr>
                    <th>Code</th>
                </tr>
                </thead>
                <tbody>
                {datenList.map((daten, index) => (
                    <tr className="border" key={index} onClick={() => handleItemClick(daten)}>{daten}</tr>
                ))}
                </tbody>
            </table>
            </div>
            <p className="absolute bottom-3 left-3">You have selected {itemCount} Code points</p>
            <div className="grid grid-cols-4 gap-10 w-fit float-left ml-6">
            {selectedItem.length <= 8 && (
                selectedItem.map((value, index) =>
                <div className="w-24" key={index} onContextMenu={(e: React.MouseEvent) => {
                    handleContextMenu(e);
                    setRightClickedItem(value);
                }} ref={contextMenuRef}>
                    <Image className="mx-auto" src={icon} alt="" width={50} height={50} priority/>
                    {value}
                    {showContextMenu && (
                        <div
                            className="absolute bg-white border"
                            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                        >
                            <div className="border" onClick={() => handleContextMenuAction("unselect")}>
                                Unselect
                            </div>
                            <div className="border" onClick={() => handleContextMenuAction("add to category")}>
                                Add to Category
                            </div>
                        </div>
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
            <div className="absolute right-5 bottom-5">
                <Button variant="contained">
                    <Link href="/clusterView">Change View</Link>
                </Button>
            </div>
        </div>
    )
}