import Link from "next/link";
import data from "../src/data.json";
import React, {useEffect, useRef, useState} from "react";
import icon from '../public/code_icon.svg';
import Image from "next/image";
import Header from "@/components/Header";

export default function CodeView() {
    const [selectedItem, setSelectedItem] = useState<Array<string>>([]);
    const [itemCount, setItemCount] = useState(0);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;
        setContextMenuPosition({ x: clientX, y: clientY });
        setShowContextMenu(true);
    };

    const handleContextMenuAction = (action: string) => {
        console.log(`Selected action: ${action}`);
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
                selectedItem.map((value, index, array) =>
                <div className="w-24" key={index} onContextMenu={handleContextMenu} ref={contextMenuRef}>
                    <Image className="mx-auto" src={icon} alt="" width={50} height={50} priority/>
                    {value}
                    {showContextMenu && (
                        <div
                            className="context-menu"
                            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                        >
                            <div onClick={() => handleContextMenuAction('unselect')}>
                                Unselect
                            </div>
                            <div onClick={() => handleContextMenuAction('add to category')}>
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
                <tr>
                    <td>Witchy Woman</td>
                </tr>
                <tr>
                    <td>Shining Star</td>
                </tr>
                <tr>
                    <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                </tr>

                </tbody>
            </table>
            </div>
            <Link className="absolute right-5 bottom-5 button" href="/clusterView">Change View</Link>
        </div>
    )
}