import React from "react";

/**
 * This component represents a context menu. It contains a list of context menu items,
 * and users can select them, triggering a corresponding action.
 */

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
