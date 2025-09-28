/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import ReactPaginate from "react-paginate";
import { Field, Form, Formik } from "formik";
import { FaSearch } from "react-icons/fa";
export interface searchSchema {
  search: string;
}

const Table = ({
  datos,
  cols,
  createLink,
  handlePage,
  handleSearch,
  handleOpen = () => {},
  handleReload = () => {},
  isLink = true,
}: {
  datos: any;
  cols: any;
  createLink: { url: string; name: string };
  handlePage: (query: any) => void;
  handleSearch: (values: any) => void;
  handleOpen?: () => void;
  handleReload?: () => void;
  isLink?: boolean;
}) => {
  const initialValues: searchSchema = {
    search: "",
  };
  const [search, setSearch] = useState("");
  const submitSearch = (values: searchSchema) => {
    setSearch(values.search);
    handleSearch(values);
  };
  const handlePagination = ({ selected }) => {
    let query = { page: selected + 1, search: search };
    handlePage(query);
  };
  const table = useReactTable({
    data: datos.data ?? [],
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="w-auto flex-1 flex flex-row">
          <Formik initialValues={initialValues} onSubmit={submitSearch}>
            {({ isSubmitting }) => (
              <Form className="flex flex-row gap-2 w-full mx-2">
                <Field className={`input input-sm`} type="text" name="search" />
                <button className="btn neumo btn-success ml-auto" type="submit">
                  <FaSearch />
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {isLink ? (
          <Link to={createLink.url} className="btn neumo btn-primary">
            {createLink.name}
          </Link>
        ) : (
          <button className="btn btn-primary neumo" onClick={handleOpen}>
            {createLink.name}
          </button>
        )}
        
      </div>
      <div className="overflow-x-auto overflow-y-auto min-h-[400px] h-[400px] sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium">
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
                  <tr key={row.id} className="border-b">
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
      {datos.last_page > 1 && (
        <div className="flex flex-row-reverse py-2">
          <ReactPaginate
            previousLabel="←"
            nextLabel="→"
            breakLabel="..."
            pageCount={datos.last_page}
            onPageChange={handlePagination}
            containerClassName="flex space-x-2 mt-4"
            pageClassName="btn neumo"
            previousClassName="btn neumo"
            nextClassName="btn neumo"
            breakClassName="btn neumo"
            previousLinkClassName=""
            nextLinkClassName=""
            breakLinkClassName=""
            activeClassName="btn-primary"
          />
        </div>
      )}
    </div>
  );
};

export default Table;
