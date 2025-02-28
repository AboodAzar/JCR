"use client";
import { useState } from "react";
import SearchBar from "@/components/admin/SearchBar";
import { RedirectButton } from "@/components/auth/redirect-button";
import { ShowUsers } from "@/components/Tabels/usersTabel";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";

const UsersPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<'general' | 'camelId'>('general');

  const exportToExcel = () => {
    const table = document.getElementById("myUsers");
    if (!table) {
      setError("Table element not found.");
      return;
    }

    try {
      const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
      XLSX.writeFile(workbook, "users-data.xlsx");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setError("An error occurred while exporting to Excel.");
    }
  };

  return (
    <div className="flex flex-1 h-screen">
      <div className="p-2 md:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex">
          <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center py-1 px-4 gap-2">
            <RedirectButton path="/auth/register">
              <Button>
                <FaPlus /> انشاء مستخدم
              </Button>
            </RedirectButton>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              searchType={searchType}
              onSearchTypeChange={setSearchType}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col py-1 px-4">
            <div className="flex flex-row-reverse items-center justify-between">
              <h2 className="w-full flex justify-end text-3xl font-semibold my-2">
                : المستخدمين
              </h2>
              <Button
                variant="outline"
                className="mr-5"
                onClick={exportToExcel}
              >
                طباعة البيانات
              </Button>
            </div>
            <div className="flex-1 min-h-0 bg-gray-200 dark:bg-neutral-700 rounded-lg p-2">
              <ShowUsers searchTerm={searchTerm} searchType={searchType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;