import React, { useState, useEffect } from "react";
import { getProjects, deleteProject, updateProject } from "@/pages/api/api";
import Header from "@/components/Header";
import { Button, ButtonGroup } from "@mui/material";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import EditModal from "@/components/EditModal";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import ConfirmModal from "@/components/ConfirmModal";

type Project = {
  project_name: string;
  project_id: number;
  config_id: number;
};

const columns: ColumnDef<Project>[] = [
  {
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorFn: (row) => row.project_id,
        id: "project_id",
        cell: (info) => info.getValue(),
        header: () => <span>Project ID</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "project_name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorFn: (row) => row.config_id,
        id: "config_id",
        cell: (info) => info.getValue(),
        header: () => <span>Config ID</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
];

export default function WelcomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const table = useReactTable({
    columns,
    data: projects,
    getCoreRowModel: getCoreRowModel(),
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [projectId, setProjectId] = useState(0);

  // Function to fetch and update project data
  const fetchAndUpdateProjects = async () => {
    try {
      const result = await getProjects();
      let projectData: Project[] = result.data.data;
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    // Fetch project data when the component mounts
    fetchAndUpdateProjects();
  }, []);

  // Function to handle project deletion
  const handleDeleteProject = async (projectIdToDelete: number) => {
    try {
      // Call your deleteProject function here
      await deleteProject(projectIdToDelete);
      // Fetch and update the project data after successful deletion
      fetchAndUpdateProjects();
      // Close the confirm modal
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <header>
      <EditModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} />
      <ConfirmModal
        open={confirmModalOpen}
        handleClose={() => setConfirmModalOpen(false)}
        onDelete={handleDeleteProject}
        projectId={projectId}
      />

      <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
        <Header title="Code View" />
        <div className="h-2" />
        <table className="w-full ">
          <thead>
            <tr>
              <th className="text-left">Project Name</th>
              <th className="text-left">Project ID</th>
              <th className="text-left">Config ID</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.project_id}>
                <td className="text-left">{project.project_name}</td>
                <td className="text-left">{project.project_id}</td>
                <td className="text-left">{project.config_id}</td>
                <td className="text-left">
                  <div>
                    <button onClick={() => setEditModalOpen(true)}>
                      <Edit />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmModalOpen(true);
                        setProjectId(project.project_id);
                      }}
                    >
                      <Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </header>
  );
}
