import React from "react";
import { Simulate } from "react-dom/test-utils";

interface ContextMenuProps {
  contextMenuPosition: { x: number; y: number };
  handleContextMenuAction: (item: string) => void;
  contextMenuItems: string[];
}

export default function ContextMenu(props: ContextMenuProps) {
  return (
    <div
      className="absolute bg-white border"
      style={{ top: props.contextMenuPosition.y, left: props.contextMenuPosition.x }}
    >
      {props.contextMenuItems.map((value, index, array) => (
        <div className="border" key={index} onClick={() => props.handleContextMenuAction(value)}>
          {value}
        </div>
      ))}
    </div>
  );
}
