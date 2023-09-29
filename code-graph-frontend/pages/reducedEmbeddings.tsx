import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@mui/material";
import { BsListColumnsReverse } from "react-icons/bs";
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { getReducedEmbeddings, extractReducedEmbeddings } from "@/pages/api/api";

type ReducedEmbedding = {
  reduced_embedding_id: number;
  pos_x: number;
  embedding_id: number;
  model_id: number;
  pos_y: number;
};

export default function ReducedEmbeddingsPage() {
  const [reducedEmbeddings, setReducedEmbeddings] = useState<ReducedEmbedding[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const project_id: number = 1;

  const reducedEmbeddings_columns: ColumnDef<ReducedEmbedding>[] = [
    {
      header: "Reduced Embeddings",
      columns: [
        {
          accessorFn: (row) => row.reduced_embedding_id,
          id: "reduced_embedding_id",
          cell: (info) => info.getValue(),
          header: () => <span>Reduced Embedding ID</span>,
        },
        {
          accessorFn: (row) => row.embedding_id,
          id: "embedding_id",
          cell: (info) => info.getValue(),
          header: () => <span>Embedding ID</span>,
        },
        {
          accessorFn: (row) => row.model_id,
          id: "model_id",
          cell: (info) => info.getValue(),
          header: () => <span>Model ID</span>,
        },
        {
          accessorFn: (row) => row.pos_x,
          id: "pos_x",
          cell: (info) => info.getValue(),
          header: () => <span>Position X</span>,
        },
        {
          accessorFn: (row) => row.pos_y,
          id: "pos_y",
          cell: (info) => info.getValue(),
          header: () => <span>Position Y</span>,
        },
      ],
    },
  ];

  const reducedEmbeddings_table = useReactTable({
    columns: reducedEmbeddings_columns,
    data: reducedEmbeddings,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchAndUpdateReducedEmbeddings = async (page: number, pageSize: number) => {
    let all = false;
    try {
      const reducedEmbeddingsResponse: any = await getReducedEmbeddings(project_id, all, page, pageSize);
      const reducedEmbeddingsArray: ReducedEmbedding[] = reducedEmbeddingsResponse.data.data;
      const reducedEmbeddingsCount = reducedEmbeddingsResponse.data.count;
      setReducedEmbeddings(reducedEmbeddingsArray);
      setTotalCount(reducedEmbeddingsCount);
    } catch (error) {
      console.error("Error fetching reduced Embeddings:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateReducedEmbeddings(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleExportReducedEmbeddings = async () => {
    try {
      await extractReducedEmbeddings(project_id);
      fetchAndUpdateReducedEmbeddings(currentPage, pageSize);
    } catch (error) {
      console.error("Error extracting reduced Embeddings:", error);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(totalCount / pageSize) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  return (
    <header>
      <Header title="Positions View" />
      <div className="flex justify-center">
        <Button
          variant="outlined"
          component="label"
          className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleExportReducedEmbeddings()}
        >
          <BsListColumnsReverse className="mr-2" />
          Export Positions
        </Button>
      </div>
      <div className="text-center mt-2">Total Count: {totalCount}</div>
      <div className="flex justify-center mt-4">
        <Button variant="outlined" onClick={prevPage} disabled={currentPage === 0}>
          Previous Page
        </Button>
        <Button variant="outlined" onClick={nextPage} disabled={currentPage === Math.ceil(totalCount / pageSize) - 1}>
          Next Page
        </Button>
        <select value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))} className="ml-2">
          <option value={100}>Page Size: 100</option>
          <option value={50}>Page Size: 50</option>
          <option value={25}>Page Size: 25</option>
        </select>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => {
            const enteredValue = parseInt(e.target.value, 10);
            if (!isNaN(enteredValue)) {
              setCurrentPage(enteredValue);
            } else {
              // Handle empty input by setting it to 0
              setCurrentPage(0);
            }
          }}
          className="ml-2 p-1"
          style={{ width: "60px" }}
        />

        <span>/ {Math.ceil(totalCount / pageSize)}</span>
      </div>
      <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
        <div className="h-2" />
        <table className="w-full ">
          <thead>
            {reducedEmbeddings_table.getHeaderGroups().map((headerGroup) => (
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
            {reducedEmbeddings_table.getRowModel().rows.map((row) => {
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