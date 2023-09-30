import { Menu } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import EditModal from "./EditModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useRouter } from "next/router";
import { Button, ButtonGroup } from "@mui/material";
import { PiSuitcaseSimpleLight } from "react-icons/pi";
import { FcScatterPlot } from "react-icons/fc";
import { HiOutlineAnnotation } from "react-icons/hi";
import { BsFillDatabaseFill } from "react-icons/bs";
import { MdOutlineDataset } from "react-icons/md";
import { AiOutlineBoxPlot } from "react-icons/ai";
import { GrCluster } from "react-icons/gr";
import { GiPositionMarker } from "react-icons/gi";
import { GrConfigure } from "react-icons/gr";
import { BsChatRightText } from "react-icons/bs";
import { PiListMagnifyingGlassThin } from "react-icons/pi";
import { ImStatsBars } from "react-icons/im";
import { getProjects } from "@/pages/api/api";

interface HeaderProps {
  title: string;
}

interface Project {
  project_id: number;
  project_name: string;
  config_id: number;
}

export default function Header(props: HeaderProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(
    typeof window !== "undefined" ? parseInt(localStorage.getItem("projectId") ?? "1") : 1,
  );
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Do api stuff here
  useEffect(() => {
    setProjectId(parseInt(localStorage.getItem("projectId") ?? "1"));
    const fetchProjects = async () => {
      try {
        const response = await getProjects(); // Replace with your API endpoint
        const projectData = response.data.data; // Access the "data" property of the response
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <header className="w-screen h-16 bg-blue-900 p-3 pl-5 mb-5 text-white flex items-center">
      <ConfirmModal open={confirmModalOpen} handleClose={() => setConfirmModalOpen(false)} />
      <EditModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} />

      <div className="mr-5">
        <button onClick={toggleDrawer}>
          <Menu />
        </button>
      </div>
      <div className="">
        <h1 className="font-bold text-3xl">{props.title}</h1>
      </div>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <div className="p-4 w-64">
          <h1 className="text-2xl text-black">Menu</h1>
          <ButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Button
              variant="outlined"
              component="label"
              onClick={() => router.push(`/projects`)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>Projects</span>
              <PiSuitcaseSimpleLight />
            </Button>
            <Button
              variant="outlined"
              component="label"
              onClick={() => router.push(`/configs`)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>Configs</span>
              <GrConfigure />
            </Button>
            <Button
              variant="outlined"
              component="label"
              onClick={() => router.push(`/databases`)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>Databases</span>
              <BsFillDatabaseFill />
            </Button>
            <Button
              variant="outlined"
              component="label"
              onClick={() => router.push(`/stats`)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>Stats</span>
              <ImStatsBars />
            </Button>
          </ButtonGroup>
          <div className="mt-5">
            <p>Project {projectId}</p>
            {/* Für jeden bereich bsp. Projects ein eigenes accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p>{projects.find((project) => project.project_id == projectId)?.project_name}</p>
              </AccordionSummary>
              {/* Styling noch anpassen und eigene sachen drüber mappen */}
              {projects.map((project) => (
                <div key={project.project_id}>
                  {project.project_name}
                  {project.project_id != projectId && (
                    <button
                      onClick={() => {
                        localStorage.setItem("projectId", project.project_id.toString());
                        window.location.reload(); // Reload the page
                      }}
                    >
                      <CompareArrowsIcon />
                    </button>
                  )}
                </div>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="p-4 w-64">
          <p>View</p>
          <div className="center">
            <ButtonGroup
              variant="contained"
              color="primary"
              aria-label="contained primary button group"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/codeView`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Codes</span>
                <HiOutlineAnnotation />
              </Button>
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/clusterView`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Graph</span>
                <FcScatterPlot />
              </Button>
            </ButtonGroup>
            <br />
            <p>Data</p>
            <ButtonGroup
              variant="contained"
              color="primary"
              aria-label="contained primary button group"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/datasets`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Datasets</span>
                <MdOutlineDataset />
              </Button>
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/sentences`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Sentences</span>
                <BsChatRightText />
              </Button>
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/embeddings`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Embeddings</span>
                <AiOutlineBoxPlot />
              </Button>
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/reducedEmbeddings`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Positions</span>
                <GiPositionMarker />
              </Button>
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/clusters`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Clusters</span>
                <GrCluster />
              </Button>
              <Button
                variant="outlined"
                component="label"
                onClick={() => router.push(`/plotSearch`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Plot Search</span>
                <PiListMagnifyingGlassThin />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
