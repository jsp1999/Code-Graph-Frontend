import data from "../src/NER_Tags.json";
import React, {useEffect, useRef, useState} from "react";
import Header from "@/components/Header";
import {Button} from "@mui/material";
import AddToCodeModal from "@/components/AddToCodeModal";
import CodeTreeView from "@/components/CodeTreeView";
import {extractCodes, getCodeTree} from "@/pages/api/api";
import {useRouter} from "next/router";
import LoadingModal from "@/components/LoadingModal";
import CodeItem from "@/components/CodeItem";
import ContextMenu from "@/components/ContextMenu";

export default function CodeView() {
    const router = useRouter();
    const {project_id} = router.query;

    const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [rightClickedItem, setRightClickedItem] = useState(0)
    const [open, setOpen] = useState(false);
    const [jsonData, setJsonData] = useState(data);
    const [extractedCodes, setExtractedCodes] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projectId, setProjectId] = useState(typeof project_id === 'string' ? parseInt(project_id, 10) : 1);

    const handleOpen = () => setOpen(true);
    const handleAddModalClose = () => {
        setOpen(false);
        setLoading(true);
        getCodeTree(projectId)
            .then(response => {
                setJsonData(response.data.codes);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const {clientX, clientY} = e;
        setContextMenuPosition({x: clientX, y: clientY});
        setShowContextMenu(true);
    };

    const handleContextMenuAction = (action: string) => {
        if (action === "unselect") {
            selectedNodes.splice(selectedNodes.indexOf(rightClickedItem), 1);
        }
        if (action === "add to category") {
            handleOpen()
        }
        setShowContextMenu(false);
    };

    const handleRightClick = (e: React.MouseEvent, value: number) => {
        handleContextMenu(e);
        setRightClickedItem(value);
    }

    useEffect(() => {
        setLoading(true);
        extractCodes(projectId)
            .then(() => {
                    setExtractedCodes(true);
                    setLoading(false);
                }
            )
            .catch((error) => {
                console.error('Error extracting data:', error);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        getCodeTree(projectId)
            .then(response => {
                setJsonData(response.data.codes);
                setLoading(false);
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

    const handleUpdateSelectedNodes = (newSelectedNodes: number[]) => {
        setSelectedNodes(newSelectedNodes);
    };

    return (
        <div>
            <Header title="Code View"/>
            <AddToCodeModal open={open} handleClose={handleAddModalClose} projectId={projectId}/>
            <LoadingModal open={loading}/>

            <div className="float-left">
                <CodeTreeView taxonomyData={jsonData} contextMenuRef={contextMenuRef} selectedNodes={selectedNodes}
                              updateSelectedNodes={handleUpdateSelectedNodes}/>
            </div>

            <div className="grid grid-cols-5 gap-10 w-[50vw] h-[50vh] float-right mt-40 mr-40">
                {selectedNodes.length > 0 && (
                    selectedNodes.map((value, index) =>
                        <div className="w-24" key={index} onContextMenu={(e: React.MouseEvent) => {
                            handleContextMenu(e);
                            setRightClickedItem(value);
                        }} ref={contextMenuRef}>
                            <CodeItem id={value} projectId={projectId}/>
                            {showContextMenu && (
                                <ContextMenu
                                    contextMenuPosition={contextMenuPosition}
                                    handleContextMenuAction={handleContextMenuAction}
                                    contextMenuItems={["unselect", "add to category"]}/>
                            )}
                        </div>
                    )
                )}
            </div>

            <div className="absolute right-5 bottom-5 ">
                <Button variant="outlined" className="mr-10" onClick={handleOpen}>
                    Add new Code
                </Button>
                <Button variant="contained" className="bg-blue-900 rounded"
                        onClick={() => router.push(`/clusterView?project_id=${projectId}`)}>
                    Change View
                </Button>
            </div>
        </div>
    )
}