"use client";

import { useState } from "react";
import Modal from "./modal";
import { useSupportedLangs } from "../data";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTranslation } from "@/server/services/translation.service";
import { useRouter } from "next/navigation";

interface TableRow {
  key: string;
  value: string;
  language: string;
}

interface TableProps {
  data: TableRow[];
}

const translationSchema = z.object({
  language: z.string().min(1, "Language is required"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});


export type TranslationFormInputs = z.infer<typeof translationSchema>;

export default function DictionaryTable({ data }: TableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof TableRow>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const supportedLangs = useSupportedLangs();
  const itemsPerPage = 10;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TranslationFormInputs>({
    resolver: zodResolver(translationSchema),
  });

  const onSubmit =  async (data: TranslationFormInputs) => {
    const res = await createTranslation(data.key, data.value, data.language)
    .catch((error) => {
      alert(error.message)
    });
    if (res) {
      alert("Translation added successfully");
      closeModal();
      router.refresh();
    }
  };

  // Filtered and Sorted Data
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (!sortField) return 0;

    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Paginated Data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Controls
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(
    firstItemIndex + itemsPerPage - 1,
    data.length
  );

  // Function to go to the next page
  const nextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  // Function to go to the previous page
  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Sorting Controls
  const onSort = (field: keyof TableRow) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const renderSortIcon = (field: keyof TableRow) => {
    let icon = "⬍"; // Default icon to indicate sortable
    if (sortField === field) {
      icon = sortOrder === "asc" ? "▲" : "▼"; // Change icon based on sort order
    }
    return (
      <svg
        className="w-3 h-3 ml-1.5"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 24 24">
        <path d={icon === "▲" ? "M5 15l7-7 7 7H5z" : "M5 9l7 7 7-7H5z"}></path>
      </svg>
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page with new search results
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full">
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
        type="button"
        onClick={openModal}>
        Add Translation
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Translation">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                id="language"
                {...register("language")}
                className="mt-1 block w-full p-2.5 bg-white border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {supportedLangs.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.language.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="key"
                className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Key
              </label>
              <input
                id="key"
                type="text"
                {...register("key")}
                className="mt-1 block w-full p-2.5 bg-white border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter key"
              />
              {errors.key && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.key.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="value"
                className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Value
              </label>
              <input
                id="value"
                type="text"
                {...register("value")}
                className="mt-1 block w-full p-2.5 bg-white border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter value"
              />
              {errors.value && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.value.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
              Add
            </button>
          </form>
        </div>
      </Modal>

      <form className="max-w-md mx-auto my-4">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search Mockups, Logos..."
            required
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </form>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-black dark:text-gray-400">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={() => onSort("key")}>
              <div className="flex items-center">
                Key {renderSortIcon("key")}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={() => onSort("value")}>
              <div className="flex items-center">
                Value {renderSortIcon("value")}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={() => onSort("language")}>
              <div className="flex items-center">
                Language {renderSortIcon("language")}
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-black dark:border-gray-700">
              <td className="px-6 py-4">{row.key}</td>
              <td className="px-6 py-4">{row.value}</td>
              <td className="px-6 py-4">{row.language}</td>
              <td className="px-6 py-4 text-right">
                <a href="#" className="font-medium hover:underline">
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center my-4">
        {/* Pagination help text */}
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {firstItemIndex}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {lastItemIndex}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {data.length}
          </span>{" "}
          Entries
        </span>
        {/* Pagination buttons */}
        <div className="inline-flex mt-2">
          <button
            onClick={prevPage}
            className="px-4 h-10 text-base font-medium text-black border bg-white rounded-l dark:bg-black dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Prev
          </button>
          <button
            onClick={nextPage}
            className="px-4 h-10 text-base font-medium text-black border bg-white rounded-r dark:bg-black dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
