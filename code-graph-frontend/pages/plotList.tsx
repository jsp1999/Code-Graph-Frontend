import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@mui/material";
import { BsListColumnsReverse } from "react-icons/bs";
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { getPlots, searchSentence, searchCode, searchCluster, searchSegment } from "@/pages/api/api";

type Plot = {
  id: number;
  sentence: string;
  segment: string;
  code: number;
  reduced_embedding: {
    x: number;
    y: number;
  };
  cluster: number;
};

export default function PlotsPage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const project_id: number = 1;

  const plots_columns: ColumnDef<Plot>[] = [
    {
      header: "Plot",
      columns: [
        {
          accessorFn: (row) => row.id,
          id: "id",
          cell: (info) => info.getValue(),
          header: () => <span>ID</span>,
          maxSize: 5,
        },
        {
          accessorFn: (row) => row.sentence,
          id: "sentence",
          cell: (info) => info.getValue(),
          header: () => <span>Sentence</span>,
          minSize: 450,
        },
        {
          accessorFn: (row) => row.segment,
          id: "segment",
          cell: (info) => info.getValue(),
          header: () => <span>Segment</span>,
          minSize: 40,
        },
        {
          accessorFn: (row) => row.code,
          id: "code",
          cell: (info) => info.getValue(),
          header: () => <span>Code</span>,
          maxSize: 5,
        },
        {
          accessorFn: (row) => row.reduced_embedding.x,
          id: "reduced_embedding_x",
          cell: (info) => info.getValue(),
          header: () => <span>X</span>,
          maxSize: 5,
        },
        {
          accessorFn: (row) => row.reduced_embedding.y,
          id: "reduced_embedding_y",
          cell: (info) => info.getValue(),
          header: () => <span> Y</span>,
          maxSize: 5,
        },
        {
          accessorFn: (row) => row.cluster,
          id: "cluster",
          cell: (info) => info.getValue(),
          header: () => <span>Cluster</span>,
          maxSize: 5,
        },
      ],
    },
  ];

  const plots_table = useReactTable({
    columns: plots_columns,
    data: plots,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchAndUpdatePlots = async (page: number, pageSize: number) => {
    let all = false;
    try {
      const plotsResponse: any = await getPlots(project_id, all, page, pageSize);
      const plotArray: Plot[] = plotsResponse.data.data;
      const plotCount = plotsResponse.data.count;
      setPlots(plotArray);
      setTotalCount(plotCount);
    } catch (error) {
      console.error("Error fetching plots:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdatePlots(currentPage, pageSize);
  }, [currentPage, pageSize]);

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
      <Header title="Plot List" />
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
            {plots_table.getHeaderGroups().map((headerGroup) => (
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
            {plots_table.getRowModel().rows.map((row) => {
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
