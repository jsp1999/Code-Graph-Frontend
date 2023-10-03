import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import data from "../src/NER_Tags.json";
import { getCodeTree } from "@/pages/api/api";
import { Button, ButtonGroup } from "@mui/material";
import Header from "@/components/Header";
import CodeTreeView from "@/components/CodeTreeView";
import AddToCodeModal from "@/components/AddToCodeModal";
import LoadingModal from "@/components/LoadingModal";
import CodeItem from "@/components/CodeItem";
import ContextMenu from "@/components/ContextMenu";
import { useRouter } from "next/router";
import { getconfig, updateConfig, recalculateEntries } from "@/pages/api/api";
import EditModal from "@/components/config/EditConfigModal";
import DotPlotComp from "@/components/DotPlotComp";
import { CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { BsListColumnsReverse } from "react-icons/bs";




const DotPlotComponent: React.FC<IDotPlotComponentProps> = () => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const dotPlotRef = useRef<DotPlotCompHandles | null>(null);
  const [plot, setPlot] = useState<any>();
  const [train, setTrain] = useState<any>();
  // From CodeView component
  const router = useRouter();
  const contextMenuRef = useRef<HTMLDivElement>(null);
  //const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [rightClickedItem, setRightClickedItem] = useState(0);
  const [jsonData, setJsonData] = useState(data);
  const [projectId, setProjectId] = useState(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("projectId") ?? "1") : 1,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [config, setConfig] = useState<any>();
  const [editData, setEditData] = useState<any>();
  const [loadingRecalulate, setloadingRecalulate] = useState(false);
  const [recalulateSuccess, setRecalulateSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  console.log("DOTPLOTCOMPONENT (grpahView) re rendered");
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

  useEffect(() => {
    setLoading(true);
    setProjectId(parseInt(localStorage.getItem("projectId") ?? "1"));
    if (config === undefined) {
      fetchAndUpdateConfigs();
    }

    getCodeTree(projectId)
      .then((response) => {
        console.log("current selected nodes");
        console.log(selectedNodes);
        console.log(localStorage.getItem("selectedNodes"));
        setJsonData(response.data.codes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (dotPlotRef.current && config) {
      console.log("SETTING MODEL TYPE", config.config.model_type);
      console.log(config);
      setLoading(true);
      dotPlotRef.current.setModelType(config.config.model_type);
      setLoading(false);
    }
  }, [config]);

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

  const handleRightClick = (e: React.MouseEvent, value: number) => {
    handleContextMenu(e);
    setRightClickedItem(value);
  };

  const handleUpdateSelectedNodes = (newSelectedNodes: number[]) => {
    setSelectedNodes(newSelectedNodes);
  };

  useEffect(() => {
    if (dotPlotRef.current && selectedNodes) {
      console.log("SETTING FILTER AND PLOTTING graphView, selected_codes", selectedNodes);
      setLoading(true);
      dotPlotRef.current.setPlotFilter(selectedNodes);
      setLoading(false);
    }
  }, [dotPlotRef, selectedNodes]);

  // Function to fetch and update project data
  const fetchAndUpdateConfigs = async () => {
    try {
      setLoading(true);
      const configResponse = (await getconfig(projectId)).data;
      setConfig(configResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleEditConfig = async (config: any) => {
    try {
      await updateConfig(config.config_id, config);
      fetchAndUpdateConfigs();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const handleEditClick = (config: any) => {
    setEditData(config);
    setEditModalOpen(true);
  };

  const handleRecalculate = async () => {
    try {
      setloadingRecalulate(true);
      await recalculateEntries(projectId);
      fetchAndUpdateConfigs();
    } catch (error) {
      console.error("Error recalculate entries:", error);
    }
    finally{
      setloadingRecalulate(false);
      setRecalulateSuccess(true);
    }
  };

  return (
    <div>
      <Header title="Graph View" />
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        onEdit={handleEditConfig}
        config={editData}
        key={editData?.config_id}
        setLoading={() => setLoading(!loading)}
      />
      <LoadingModal open={loading} />
      <div className="flex">
        <div className="float-left">
          <CodeTreeView
            taxonomyData={jsonData}
            contextMenuRef={contextMenuRef}
            selectedNodes={selectedNodes}
            updateSelectedNodes={handleUpdateSelectedNodes}
          />
        </div>
          <DotPlotComp ref={dotPlotRef} projectId={projectId} source="http://localhost:8000/" is_dynamic={false} />
      </div>
      <div className="absolute right-5 bottom-5 ">
          <Button
            variant="outlined"
className="mr-10"
            onClick={() => {
              handleEditClick(config);
            }}
          >
            Edit Config
          </Button>
          <Button
            variant="outlined"
            className="mr-10"

            onClick={() => {
              handleRecalculate();
            }}
          >
            Recalculate
          </Button>
        <Button variant="contained" className="bg-blue-900 rounded" onClick={() => router.push(`/codeView`)}>
          Change View
        </Button>
      </div>
      {/* Add other components from CodeView like AddToCodeModal, LoadingModal, etc. here */}
    </div>
  );
};
export default DotPlotComponent;
