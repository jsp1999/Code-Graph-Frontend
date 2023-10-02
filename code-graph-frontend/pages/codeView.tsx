import data from "../src/NER_Tags.json";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@mui/material";
import AddToCodeModal from "@/components/AddToCodeModal";
import CodeTreeView from "@/components/CodeTreeView";
import {getCodeTree, getconfig, refreshEntries} from "@/pages/api/api";
import { useRouter } from "next/router";
import LoadingModal from "@/components/LoadingModal";
import CodeItem from "@/components/CodeItem";
import ContextMenu from "@/components/ContextMenu";
import * as d3 from "d3";
import CodeDotPlotter from "@/components/CodeDotPlotter";

export default function CodeView() {
  const router = useRouter();

  //const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [plot, setPlot] = useState<any>();
  const [config, setConfig] = useState<any>();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [rightClickedItem, setRightClickedItem] = useState(0);
  const [open, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(typeof window !== 'undefined' ? parseInt(localStorage.getItem("projectId") ?? "1"): 1);
  const [selectedNodes, setSelectedNodes] = useState<number[]>(() => {
    if (typeof window === 'undefined') {
        // We're on the server, just return the default value
        return [];
    }

    // When component mounts, fetch the state from localStorage if it exists
    const storedNodes = localStorage.getItem('selectedNodes');
    return storedNodes ? JSON.parse(storedNodes) : [];
});


  useEffect(() => {
    // Any time selectedNodes changes, save it to localStorage
      localStorage.setItem('selectedNodes', JSON.stringify(selectedNodes));
  }, [selectedNodes]);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    if (canvasRef.current) {
      console.log("Initializing dot plotter...");
      const svg_ = d3.select(canvasRef.current);
      const container_ = d3.select("#container");
      const newPlot = new CodeDotPlotter("container", projectId, "http://localhost:8000/", svg_, container_, selectedNodes, handleOpen);
      fetchAndUpdateConfigs();

      setPlot(newPlot);

      newPlot.update().then(() => newPlot.homeView());
    } else {
      console.log("Error: canvas ref is null");
    }

    setProjectId(parseInt(localStorage.getItem("projectId") ?? "1"));

    setLoading(true);
    getCodeTree(projectId)
      .then((response) => {
        localStorage.setItem("selectedNodes", JSON.stringify([]));
        setJsonData(response.data.codes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAddModalClose = () => {
    setOpen(false);
    setLoading(true);
    getCodeTree(projectId)
      .then((response) => {
        setJsonData(response.data.codes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    setContextMenuPosition({ x: clientX, y: clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action: string) => {
    if (action === "unselect") {
      selectedNodes.splice(selectedNodes.indexOf(rightClickedItem), 1);
    }
    if (action === "add to category") {
      handleOpen();
    }
    setShowContextMenu(false);
  };

  {/*const handleRightClick = (e: React.MouseEvent, value: number) => {
    handleContextMenu(e);
    setRightClickedItem(value);
  };*/}

  const handleRightClickDot = (contextMenuPosition: any, rightClickedItem: any) => {
    setContextMenuPosition(contextMenuPosition);
    setRightClickedItem(rightClickedItem);
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleUpdateSelectedNodes = (newSelectedNodes: number[]) => {
    setSelectedNodes(newSelectedNodes);
  };

  useEffect(() => {
    if (plot && selectedNodes) {
      plot.applyCodesFilter(selectedNodes);
      plot.update().then(() => plot.homeView());
    }
  }, [selectedNodes, plot]);

  const fetchAndUpdateConfigs = async () => {
    try {
      const configResponse = (await getconfig(projectId)).data;

      setConfig(configResponse);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshEntries(projectId);
      fetchAndUpdateConfigs();
    } catch (error) {
      console.error("Error refreshing entries:", error);
    }
  };


  return (
    <div>
      <Header title="Code View" />
      <AddToCodeModal open={open} handleClose={handleAddModalClose} projectId={projectId} />
      <LoadingModal open={loading} />

      <div className="float-left">
        <CodeTreeView
          taxonomyData={jsonData}
          contextMenuRef={contextMenuRef}
          selectedNodes={selectedNodes}
          updateSelectedNodes={handleUpdateSelectedNodes}
        />
      </div>

      <div>
        <svg id="canvas" ref={canvasRef} width="800" height="600">
          <g id="container">
          </g>
        </svg>
      </div>

      {/*<div className="grid grid-cols-5 gap-10 w-[50vw] h-[50vh] float-right mt-40 mr-40">
        {selectedNodes.length > 0 &&
          selectedNodes.map((value, index) => (
            <div
              className="w-24"
              key={index}
              onContextMenu={(e: React.MouseEvent) => {
                handleContextMenu(e);
                setRightClickedItem(value);
              }}
              ref={contextMenuRef}
            >
              <CodeItem id={value} projectId={projectId} />
              {showContextMenu && (
                <ContextMenu
                  contextMenuPosition={contextMenuPosition}
                  handleContextMenuAction={handleContextMenuAction}
                  contextMenuItems={["unselect", "add to category"]}
                />
              )}
            </div>
          ))}
      </div>*/}

      <div className="absolute right-5 bottom-5 ">
        <Button variant="outlined" className="mr-10" onClick={handleOpen}>
          Add new Code
        </Button>
        <Button
          variant="contained"
          className="bg-blue-900 rounded"
          onClick={() => router.push(`/plotNeu`)}
        >
          Change View
        </Button>
      </div>
    </div>
  );
}
