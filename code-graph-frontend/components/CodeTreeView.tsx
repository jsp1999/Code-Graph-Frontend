import React, { useState } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { Checkbox } from "@mui/material";

interface Category {
  id: number;
  name: string;
  subcategories: Record<string, Category>;
}

interface CodeTreeViewProps {
  taxonomyData: Record<string, Category>;
  contextMenuRef: React.RefObject<HTMLDivElement>;
  selectedNodes: number[]; // New prop for selected nodes
  updateSelectedNodes: (newSelectedNodes: number[]) => void;
}

const CodeTreeView: React.FC<CodeTreeViewProps> = ({
  taxonomyData,
  contextMenuRef,
  selectedNodes,
  updateSelectedNodes,
}) => {
  const renderTree = (node: Category): React.ReactNode => (
    <TreeItem
      key={node.id}
      nodeId={node.id?.toString()}
      label={
        <>
          {" "}
          <Checkbox
            checked={selectedNodes.includes(node.id)}
            onClick={(event) => handleNodeSelect(event, node.id)}
            size="small"
          />{" "}
          {node.name}{" "}
        </>
      }
    >
      {Object.keys(node.subcategories).map((subcategoryKey) => renderTree(node.subcategories[subcategoryKey]))}
    </TreeItem>
  );

  const handleNodeSelect = (event: React.ChangeEvent<{}>, node: number) => {
    event.stopPropagation();

    // Check if the node is already selected
    const isSelected = selectedNodes.includes(node);

    // Create a new array with the updated selection
    let newSelectedNodes: number[];

    if (isSelected) {
      // If the node is already selected, remove it from the selectedNodes array
      newSelectedNodes = selectedNodes.filter((selectedNode) => selectedNode !== node);
    } else {
      // If the node is not selected, add it to the selectedNodes array
      newSelectedNodes = [...selectedNodes, node];
    }

    // Update the selectedNodes state using the callback function
    updateSelectedNodes(newSelectedNodes);
  };

  return (
    <div className="w-fit m-12 border p-5">
      <h1 className="text-2xl underline mb-5">Codes</h1>
      <div className="h-[60vh] w-80 overflow-auto">
        <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />} multiSelect>
          {Object.keys(taxonomyData).map((topLevelKey) => renderTree(taxonomyData[topLevelKey]))}
        </TreeView>
      </div>
    </div>
  );
};

export default CodeTreeView;
