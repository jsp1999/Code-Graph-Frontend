import React, {useState} from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import {Checkbox} from "@mui/material";

interface Category {
    id: number;
    name: string;
    subcategories: Record<string, Category>;
}

interface CodeTreeViewProps {
    taxonomyData: Record<string, Category>;
    handleRightClick : (e: React.MouseEvent, value: string) => void;
    contextMenuRef: React.RefObject<HTMLDivElement>;
}

const CodeTreeView: React.FC<CodeTreeViewProps> = ({ taxonomyData, handleRightClick, contextMenuRef }) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const renderTree = (node: Category): React.ReactNode => (
            <TreeItem key={node.id} nodeId={node.id?.toString()} label={<> <Checkbox size="small" /> {node.name} </>} >
                {Object.keys(node.subcategories).map((subcategoryKey) =>
                    renderTree(node.subcategories[subcategoryKey])
                )}
            </TreeItem>
    );


    const handleNodeSelect = (event: React.ChangeEvent<{}>, node: string) => {
        // Update the selectedNode state when a node is selected
        setSelectedNode(node);
        console.log(selectedNode);
    };

    return (
        <div className="w-fit m-12 border p-5">
            <h1 className="text-2xl underline mb-5">Codes</h1>
            <div className="h-[60vh] w-80 overflow-auto">
        <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            onNodeSelect={handleNodeSelect}
        >
            {Object.keys(taxonomyData).map((topLevelKey) =>
                renderTree(taxonomyData[topLevelKey])
            )}
        </TreeView>
            </div>
            <p>Selected Node Label: {selectedNode}</p>
        </div>
    );
};

export default CodeTreeView;
