/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";

const Table = ({
  datos,
  cols,
  createLink,
}: {
  datos: any;
  cols: any;
  createLink: { url: string; name: string };
}) => {
  const table = useReactTable({
    data: datos ?? [],
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex flex-col">
      <div className="flex flex-row-reverse">
        <Link to={createLink.url} className="btn  neumo btn-primary">
          {createLink.name}
        </Link>
      </div>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light neumo">
              <thead className="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} scope="col" className="px-6 py-4">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
