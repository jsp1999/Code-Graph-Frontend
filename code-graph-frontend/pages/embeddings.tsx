import React, { useState, useEffect } from "react";
import { getEmbeddings, extractEmbeddings } from "@/pages/api/api";
import Header from "@/components/Header";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import { Button } from "@mui/material";
import { BsListColumnsReverse } from "react-icons/bs";

type Embedding = {
  id: string;
  embedding: number[];
};

export default function databasesPage() {
  const [embeddings, setEmbeddings] = useState<Embedding[]>([]);

  const project_id: number = 1;

  const embeddings_columns: ColumnDef<Embedding>[] = [
    {
      header: "Embedding",
      footer: (props) => props.column.id,
      columns: [
        {
          accessorFn: (row) => row.id,
          id: "id",
          cell: (info) => info.getValue(),
          header: () => <span>ID</span>,
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.embedding,
          id: "embedding",
          cell: (info) => info.getValue().toString(),
          header: () => <span>Embedding</span>,
          footer: (props) => props.column.id,
        },
      ],
    },
  ];

  const embeddings_table = useReactTable({
    columns: embeddings_columns,
    data: embeddings,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  // Function to fetch and update database data
  const fetchAndUpdateEmbeddings = async () => {
    try {
      const embeddings: Embedding[] = (await getEmbeddings(project_id)).data.data;
      setEmbeddings(embeddings);
    } catch (error) {
      console.error("Error fetching databases:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateEmbeddings();
  }, []);

  const handleExportEmbeddings = async () => {
    try {
      await extractEmbeddings(project_id);
      fetchAndUpdateEmbeddings();
    } catch (error) {
      console.error("Error deleting database:", error);
    }
  };

  return (
    <header>
      <Header title="Code View" />
      <div className="flex justify-center">
        <Button
          variant="outlined"
          component="label"
          className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleExportEmbeddings()}
        >
          <BsListColumnsReverse className="mr-2" />
          Export Embeddings
        </Button>
      </div>
      <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
        <div className="h-2" />
        <table className="w-full ">
          <thead>
            {embeddings_table.getHeaderGroups().map((headerGroup) => (
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
            {embeddings_table.getRowModel().rows.map((row) => {
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
