import React, { useState, useEffect } from "react";
import { getProjects, deleteProject, updateProjectName, updateProjectConfig, postProject } from "@/pages/api/api";
import Header from "@/components/Header";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import EditModal from "@/components/EditModal";
import CreateModal from "@/components/CreateModal";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import ConfirmModal from "@/components/ConfirmModal";
import { AiOutlinePlus } from "react-icons/ai";

type Project = {
  project_name: string;
  project_id: number;
  config_id: number;
};

export default function WelcomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [editData, setEditData] = useState<any>({});

  const columns: ColumnDef<Project>[] = [
    {
      header: "Projects",
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
    {
      header: "Actions",
      footer: (props) => props.column.id,
      columns: [
        {
          id: "edit",
          header: () => <span>Edit</span>,
          cell: (info) => (
            <div className="flex justify-center">
              <Edit
                className="cursor-pointer"
                onClick={() => {
                  handleEditClick(info.row.original);
                }}
              />
            </div>
          ),
          footer: (props) => props.column.id,
        },
        {
          id: "delete",
          header: () => <span>Delete</span>,
          cell: (info) => (
            <div className="flex justify-center">
              <Delete
                className="cursor-pointer"
                onClick={() => {
                  setConfirmModalOpen(true);
                  setProjectId(info.row.original.project_id);
                }}
              />
            </div>
          ),
          footer: (props) => props.column.id,
        },
      ],
    },
  ];

  const table = useReactTable({
    columns,
    data: projects,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });
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
    fetchAndUpdateProjects();
  }, []);

  const handleDeleteProject = async (projectIdToDelete: number) => {
    try {
      await deleteProject(projectIdToDelete);
      fetchAndUpdateProjects();
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditData({ project_name: project.project_name, config_id: project.config_id, project_id: project.project_id });
    setEditModalOpen(true);
  };

  const handleEditProject = async (project: Project) => {
    try {
      await updateProjectName(project.project_id, project.project_name);
      fetchAndUpdateProjects();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const handleCreateProject = async (project_name: string) => {
    try {
      await postProject(project_name);
      fetchAndUpdateProjects();
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <header>
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        onEdit={handleEditProject}
        project={editData}
      />
      <ConfirmModal
        open={confirmModalOpen}
        handleClose={() => setConfirmModalOpen(false)}
        onDelete={handleDeleteProject}
        projectId={projectId}
      />
      <CreateModal
        open={createModalOpen}
        handleClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateProject}
        project_name={projectName}
      />

      <Header title="Code View" />
      <div className="flex justify-center">
        <button
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateModalOpen(true)}
        >
          <AiOutlinePlus className="mr-2" />
          Create Project
        </button>
      </div>
      <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
        <div className="h-2" />
        <table className="w-full ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ position: "relative", width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                        ></div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </header>
  );
}