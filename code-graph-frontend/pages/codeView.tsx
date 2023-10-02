import data from "../src/NER_Tags.json";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@mui/material";
import AddCodeModal from "@/components/AddCodeModal";
import CodeTreeView from "@/components/CodeTreeView";
import { getCodeTree, getconfig, refreshEntries } from "@/pages/api/api";
import { useRouter } from "next/router";
import LoadingModal from "@/components/LoadingModal";
import * as d3 from "d3";
import CodeDotPlotter from "@/components/CodeDotPlotter";
import AddToCodeModal from "@/components/AddToCodeModal";
import MergeModal from "@/components/MergeModal";

export default function CodeView() {
  const router = useRouter();

  //const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [plot, setPlot] = useState<any>();
  const [config, setConfig] = useState<any>();
  const [rightClickedItemId, setRightClickedItemId] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openMergeModal, setOpenMergeModal] = useState(false);
  const [openAddToCodeModal, setOpenAddToCodeModal] = useState(false);
  const [jsonData, setJsonData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("projectId") ?? "1") : 1,
  );
  const [selectedNodes, setSelectedNodes] = useState<number[]>(() => {
    if (typeof window === "undefined") {
      // We're on the server, just return the default value
      return [];
    }

    // When component mounts, fetch the state from localStorage if it exists
    const storedNodes = localStorage.getItem("selectedNodes");
    return storedNodes ? JSON.parse(storedNodes) : [];
  });

  useEffect(() => {
    // Any time selectedNodes changes, save it to localStorage
    localStorage.setItem("selectedNodes", JSON.stringify(selectedNodes));
  }, [selectedNodes]);
  const handleOpen = () => setOpenAddToCodeModal(true);

  useEffect(() => {
    if (canvasRef.current) {
      console.log("Initializing dot plotter...");
      const svg_ = d3.select(canvasRef.current);
      const container_ = d3.select("#container");
      const newPlot = new CodeDotPlotter(
        "container",
        projectId,
        "http://localhost:8000/",
        svg_,
        container_,
        selectedNodes,
        handleOpen,
      );
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
    setOpenAddModal(false);
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

  const handleAddToCodeModalClose = () => {
    setOpenAddToCodeModal(false);
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

  const handleMergeModalClose = () => {
    setOpenMergeModal(false);
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
      <AddCodeModal open={openAddModal} handleClose={handleAddModalClose} projectId={projectId} />
      <AddToCodeModal
        open={openAddToCodeModal}
        handleClose={handleAddToCodeModalClose}
        projectId={projectId}
        codeId={rightClickedItemId}
      />
      <LoadingModal open={loading} />
      <MergeModal
        open={openMergeModal}
        handleClose={handleMergeModalClose}
        projectId={projectId}
        setLoading={() => setLoading(!loading)}
      />

      <div className="float-left">
        <CodeTreeView
          taxonomyData={jsonData}
          selectedNodes={selectedNodes}
          updateSelectedNodes={handleUpdateSelectedNodes}
        />
      </div>

      <div>
        <svg id="canvas" ref={canvasRef} width="800" height="600">
          <g id="container"></g>
        </svg>
      </div>

      <div className="absolute right-5 bottom-5 ">
        <Button variant="outlined" className="mr-10" onClick={() => setOpenMergeModal(true)}>
          Merge Codes
        </Button>
        <Button variant="outlined" className="mr-10" onClick={() => setOpenAddModal(true)}>
          Add new Code
        </Button>
        <Button variant="contained" className="bg-blue-900 rounded" onClick={() => router.push(`/plotNeu_Comp`)}>
          Change View
        </Button>
      </div>
    </div>
  );
}
