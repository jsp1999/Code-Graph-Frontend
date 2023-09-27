import React, { useState, useEffect } from "react";
import {
  getDatabaseInfos,
  deleteDatabaseTables,
  deleteDatabaseTable,
  downloadFile,
  listFiles,
  initTables,
} from "@/pages/api/api";
import Header from "@/components/Header";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import CreateModal from "@/components/project/CreateProjectModal";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import DeleteAllDatabasesModal from "@/components/database/DeleteDatabasesModal";
import DeleteDatabasesModal from "@/components/database/DeleteDatabaseModal";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@mui/material";
import { BsTrash } from "react-icons/bs";
import { BsListColumnsReverse } from "react-icons/bs";

type Database = {
  name: string;
  count: number;
};

export default function ProjectPage() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [databaseName, setDatabaseName] = useState("");

  const columns: ColumnDef<Database>[] = [
    {
      header: "Database",
      footer: (props) => props.column.id,
      columns: [
        {
          accessorFn: (row) => row.name,
          id: "name",
          cell: (info) => info.getValue(),
          header: () => <span>Name</span>,
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.count,
          id: "count",
          cell: (info) => info.getValue(),
          header: () => <span>Count</span>,
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      header: "Actions",
      footer: (props) => props.column.id,
      columns: [
        {
          id: "delete",
          maxSize: 5,
          header: () => <span>Delete</span>,
          cell: (info) => (
            <div className="flex justify-center">
              <Delete
                className="cursor-pointer"
                onClick={() => {
                  setDatabaseName(info.row.original.name);
                  setDeleteModalOpen(true);
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
    data: databases,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });
  // Function to fetch and update project data
  const fetchAndUpdateProjects = async () => {
    try {
      const databases: Database[] = (await getDatabaseInfos()).data;
      setDatabases(databases);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateProjects();
  }, []);

  const handleDeleteDatabases = async () => {
    try {
      await deleteDatabaseTables();
      fetchAndUpdateProjects();
      setDeleteAllModalOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDeleteDatabase = async (databaseName: string) => {
    try {
      await deleteDatabaseTable(databaseName);
      fetchAndUpdateProjects();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const initDatabases = async () => {
    try {
      await initTables();
      fetchAndUpdateProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <header>
      <DeleteAllDatabasesModal
        open={deleteAllModalOpen}
        handleClose={() => setDeleteAllModalOpen(false)}
        onDelete={handleDeleteDatabases}
      />
      <DeleteDatabasesModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteDatabase}
        databaseName={databaseName}
      />

      <Header title="Code View" />
      <div className="flex justify-center">
        <Button
          variant="outlined"
          component="label"
          className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => initDatabases()}
        >
          <BsListColumnsReverse className="mr-2" />
          Initialize Databases
        </Button>
        <Button
          variant="outlined"
          component="label"
          className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setDeleteAllModalOpen(true)}
        >
          <BsTrash className="mr-2" />
          Delete All Databases
        </Button>
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
