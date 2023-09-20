import Link from "next/link";
import data from "../src/NER_Tags.json";
import React, {useEffect, useRef, useState} from "react";
import Header from "@/components/Header";
import {Button} from "@mui/material";
import CategoryModal from "@/components/CategoryModal";
import CodeTreeView from "@/components/CodeTreeView";
import {extractCodes, getCodeTree} from "@/pages/api/api";
import {useRouter} from "next/router";

export default function CodeView() {
    const router = useRouter();
    const {project_id} = router.query;

    const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
    const [itemCount, setItemCount] = useState(0);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [rightClickedItem, setRightClickedItem] = useState("")
    const [open, setOpen] = useState(false);
    const [jsonData, setJsonData] = useState(data);
    const [extractedCodes, setExtractedCodes] = useState(false);
    const [projectId, setProjectId] = useState(typeof project_id === 'string' ? parseInt(project_id, 10) : 1);

    const handleOpen = () => setOpen(true);
    const handleAddModalClose = () => {
        getCodeTree(projectId)
            .then(response => {
                setJsonData(response.data.codes);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        setOpen(false);
    }
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;
        setContextMenuPosition({ x: clientX, y: clientY });
        setShowContextMenu(true);
    };

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

    const handleRightClick = (e: React.MouseEvent, value: string) => {
        handleContextMenu(e);
        setRightClickedItem(value);
    }

    useEffect(() => {
        extractCodes(projectId)
            .then(() => {
                    setExtractedCodes(true);
                }
            )
            .catch((error) => {
                console.error('Error extracting data:', error);
            });
    }, []);

    useEffect(() => {
        getCodeTree(projectId)
            .then(response => {
                setJsonData(response.data.codes);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

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

    // Handle item click event
    const handleItemClick = (data: string) => {
        if (itemCount < 8){
            if(!selectedItems.includes(data)) {
                selectedItems.push(data);
                setItemCount(itemCount + 1);
            } else {
                selectedItems.splice(selectedItems.indexOf(data), 1);
                setItemCount(itemCount - 1);
            }
        }
    };

    return (
        <div>
            <Header title="Code View"/>
            <CategoryModal open={open} handleClose={handleAddModalClose} selectedCode={rightClickedItem} projectId={projectId} />

            <CodeTreeView taxonomyData={jsonData} handleRightClick={handleRightClick} contextMenuRef={contextMenuRef}/>

            <div className="grid grid-cols-4 gap-10 float-left ml-6">
{/*            {selectedItems.length <= 8 && (
                selectedItems.map((value, index) =>
                <div className="w-24" key={index} onContextMenu={(e: React.MouseEvent) => {
                    handleContextMenu(e);
                    setRightClickedItem(value);
                }} ref={contextMenuRef}>
                    <CodeItem value={value} id={index}/>
                    {showContextMenu && (
                        <ContextMenu
                            contextMenuPosition={contextMenuPosition}
                            handleContextMenuAction={handleContextMenuAction}
                            contextMenuItems={["unselect", "add to category"]} />
                    )}
                </div>
                )
            )}*/}
            </div>

            <div className="absolute right-5 bottom-5 ">
                <Button variant="outlined" className="mr-10" onClick={handleOpen}>
                    Add new Code
                </Button>
                <Button variant="contained" className="bg-blue-900 rounded">
                    <Link href="/clusterView">Change View</Link>
                </Button>
            </div>
        </div>
    )
}