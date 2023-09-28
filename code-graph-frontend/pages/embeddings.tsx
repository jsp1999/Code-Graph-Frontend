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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

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

  const fetchAndUpdateEmbeddings = async (page: number, pageSize: number) => {
    let all = false;
    let reduced_length = 3;
    try {
      const embeddings: Embedding[] = (await getEmbeddings(project_id, all, page, pageSize, reduced_length)).data.data;
      setEmbeddings(embeddings);
    } catch (error) {
      console.error("Error fetching databases:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateEmbeddings(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleExportEmbeddings = async () => {
    try {
      await extractEmbeddings(project_id);
      fetchAndUpdateEmbeddings(currentPage, pageSize);
    } catch (error) {
      console.error("Error deleting database:", error);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
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
      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <Button variant="outlined" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
          Previous Page
        </Button>
        <Button variant="outlined" onClick={() => goToPage(currentPage + 1)}>
          Next Page
        </Button>
        <select value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))} className="ml-2">
          <option value={100}>Page Size: 100</option>
          <option value={50}>Page Size: 50</option>
          <option value={25}>Page Size: 25</option>
        </select>
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
