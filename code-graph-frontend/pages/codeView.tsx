import data from "../src/NER_Tags.json";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@mui/material";
import AddCodeModal from "@/components/AddCodeModal";
import CodeTreeView from "@/components/CodeTreeView";
import {getCodeRoute, getCodeTree} from "@/pages/api/api";
import { useRouter } from "next/router";
import LoadingModal from "@/components/LoadingModal";
import * as d3 from "d3";
import CodeDotPlotter from "@/components/CodeDotPlotter";
import AddToCodeModal from "@/components/AddToCodeModal";
import MergeModal from "@/components/MergeModal";
import ConfirmModal from "@/components/ConfirmModal";
import RenameModal from "@/components/RenameModal";
import DeleteCodeModal from "@/components/DeleteCodeModal";

export default function CodeView() {
  const router = useRouter();

  //const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [plot, setPlot] = useState<any>();
  const [rightClickedItemId, setRightClickedItemId] = useState(0);
  const [rightClickedItemName, setRightClickedItemName] = useState("");
  const [rightClickedItemParentId, setRightClickedItemParentId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openMergeModal, setOpenMergeModal] = useState(false);
  const [openAddToCodeModal, setOpenAddToCodeModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openDeleteCodeModal, setOpenDeleteCodeModal] = useState(false);
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
  const handleRightClick = (id: number) => {
      setRightClickedItemId(id);
      getCodeRoute(id, projectId).then((result) => {
          setRightClickedItemName(result.data.text);
          setRightClickedItemParentId(result.data.parent_code_id);
      })
  }
  const handleOpenRename = () => {
      setOpenRenameModal(true);
  }
    const handleOpenDelete = () => setOpenConfirmModal(true);

  useEffect(() => {
    setLoading(true);

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
          handleRightClick,
          handleOpenDelete,
          handleOpenRename,
      );

      setPlot(newPlot);

      newPlot.generateColors().then(()=>newPlot.update()).then(() => newPlot.homeView()).then(() => setLoading(false));
    } else {
      console.log("Error: canvas ref is null");
    }

    setProjectId(parseInt(localStorage.getItem("projectId") ?? "1"));

    getCodeTree(projectId)
      .then((response) => {
        setJsonData(response.data.codes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAddModalClose = () => {
    setOpenAddModal(false);
    window.location.reload(); // Reload the page
  };

  const handleAddToCodeModalClose = () => {
    setOpenAddToCodeModal(false);
    window.location.reload(); // Reload the page
  };

  const handleMergeModalClose = () => {
    setOpenMergeModal(false);
    window.location.reload(); // Reload the page
  };

    const handleConfirmModalClose = () => {
        setOpenConfirmModal(false);
        window.location.reload(); // Reload the page
    };

    const handleRenameModalClose = () => {
        setOpenRenameModal(false);
        window.location.reload(); // Reload the page
    };

    const handleDeleteCodeModalClose = () => {
        setOpenDeleteCodeModal(false);
        window.location.reload(); // Reload the page
    };

    const handleUpdateSelectedNodes = (newSelectedNodes: number[]) => {
    setSelectedNodes(newSelectedNodes);
  };

  useEffect(() => {
    if (plot && selectedNodes) {
      console.log("Applying codes filter")
      plot.applyCodesFilter(selectedNodes);
      plot.generateColors().then(()=>plot.update()).then(() => plot.homeView());
    }
  }, [selectedNodes, plot]);

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
        <ConfirmModal open={openConfirmModal} handleClose={handleConfirmModalClose} projectId={projectId} codeId={rightClickedItemId} codeName={rightClickedItemName} />
        <RenameModal open={openRenameModal} handleClose={handleRenameModalClose} projectId={projectId} codeId={rightClickedItemId} codeName={rightClickedItemName} codeParentId={rightClickedItemParentId} />
        <DeleteCodeModal open={openDeleteCodeModal} handleClose={handleDeleteCodeModalClose} projectId={projectId} />
        <div className="flex">

      <div className="float-left">
        <CodeTreeView
          taxonomyData={jsonData}
          selectedNodes={selectedNodes}
          updateSelectedNodes={handleUpdateSelectedNodes}
        />
      </div>

      <div className="dynamicSvgContainer">
        {/* Use the fetched plotItems instead of dummy items */}
        <svg id="canvas" ref={canvasRef} width="100%" height="100%">
          <g id="container"></g>
        </svg>
      </div>
        </div>

      <div className="absolute right-5 bottom-5 ">
        <Button variant="outlined" className="mr-10" onClick={() => setOpenMergeModal(true)}>
          Merge Codes
        </Button>
          <Button variant="outlined" className="mr-10" onClick={() => setOpenDeleteCodeModal(true)}>
              Delete Code
          </Button>
        <Button variant="outlined" className="mr-10" onClick={() => setOpenAddModal(true)}>
          Add new Code
        </Button>
        <Button variant="contained" className="bg-blue-900 rounded" onClick={() => router.push(`/graphView`)}>
          Change View
        </Button>
      </div>
    </div>
  );
}
