import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Database, Eye, Save, Trash2, ChevronLeft, ChevronRight, Loader2, Pencil, X, Maximize2, Minimize2 } from "lucide-react";

interface TableInfo {
  table: string;
  label: string;
}

interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
}

interface PaginationInfo {
  page: number;
  perPage: number;
  totalRows: number;
  totalPages: number;
}

interface TableData {
  table: string;
  baseTable: string;
  language: string;
  columns: string[];
  primaryKeys: string[];
  foreignKeys: string[];
  rows: Record<string, any>[];
  pagination: PaginationInfo;
}

interface EditingCell {
  rowId: string;
  column: string;
}

const TablesManager = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState("products");
  const [selectedLang, setSelectedLang] = useState("en");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getAuthHeaders = useCallback(() => {
    const token = sessionStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchConfig = async () => {
      const token = sessionStorage.getItem("auth_token");
      if (!token) return;
      try {
        const response = await fetch("/api/tables/list", {
          headers: getAuthHeaders(),
        });
        if (!response.ok || cancelled) return;
        const data = await response.json();
        if (cancelled) return;
        console.log("Tables list data:", data);
        setTables(data.tables || []);
        setLanguages(data.languages || []);
        
        // Initialize selection if not already set to something valid
        setTables(prevTables => {
          const newTables = data.tables || [];
          if (newTables.length > 0 && !selectedTable) {
            setSelectedTable(newTables[0].table);
          }
          return newTables;
        });
        
        setLanguages(prevLangs => {
          const newLangs = data.languages || [];
          if (newLangs.length > 0 && !selectedLang) {
            setSelectedLang(newLangs[0].code);
          }
          return newLangs;
        });
      } catch (error) {
        console.error("Failed to fetch tables config:", error);
      }
    };
    fetchConfig();
    return () => { cancelled = true; };
  }, [getAuthHeaders, selectedTable]);

  const fetchTableData = useCallback(async (table: string, lang: string, page: number) => {
    setIsLoading(true);
    setEditingCell(null);
    setDeleteConfirm(null);
    setExpandedCell(null);
    try {
      const response = await fetch(
        `/api/tables/data?table=${encodeURIComponent(table)}&lang=${encodeURIComponent(lang)}&page=${page}`,
        { headers: getAuthHeaders() }
      );
      if (!response.ok) throw new Error("Failed to fetch table data");
      const data: TableData = await response.json();
      setTableData(data);
      setCurrentPage(data.pagination.page);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load table data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, toast]);

  const handleDisplay = () => {
    fetchTableData(selectedTable, selectedLang, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (!tableData) return;
    fetchTableData(tableData.baseTable, tableData.language, newPage);
  };

  const startEditing = (rowId: string, column: string, currentValue: any) => {
    setEditingCell({ rowId, column });
    setEditValue(currentValue === null || currentValue === undefined ? "" : String(currentValue));
    setExpandedCell(null);
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingCell || !tableData) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/tables/update", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          table: tableData.baseTable,
          lang: tableData.language,
          id: editingCell.rowId,
          updates: { [editingCell.column]: editValue },
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Update failed");
      }
      setTableData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rows: prev.rows.map(row =>
            String(row.id) === String(editingCell.rowId)
              ? { ...row, [editingCell.column]: editValue }
              : row
          ),
        };
      });
      cancelEditing();
      toast({ title: "Saved", description: "Record updated successfully." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update record.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (rowId: string) => {
    if (!tableData) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/tables/delete", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          table: tableData.baseTable,
          lang: tableData.language,
          id: rowId,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Delete failed");
      }
      setDeleteConfirm(null);
      toast({ title: "Deleted", description: "Record deleted successfully." });
      fetchTableData(tableData.baseTable, tableData.language, currentPage);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete record.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isProtectedColumn = (col: string) => {
    return ["id", "master_id"].includes(col);
  };

  const isIdColumn = (col: string) => {
    return col === "id";
  };

  const getColumnType = (col: string): "id" | "boolean" | "date" | "long_text" | "short_text" | "number" => {
    if (["id", "master_id", "category_id", "product_id", "user_id"].includes(col)) return "id";
    if (["synchronized_data", "is_active", "is_featured", "published", "active"].includes(col)) return "boolean";
    if (["created_at", "updated_at", "published_at", "date", "start_date", "end_date", "last_sign_in_at"].includes(col)) return "date";
    if (["description", "content", "long_description", "body", "requirements", "responsibilities", "benefits", "meta_description", "og_description", "applications", "key_benefits"].includes(col)) return "long_text";
    if (["price", "sort_order", "priority", "search_volume", "relevance_score", "display_order", "order_index"].includes(col)) return "number";
    return "short_text";
  };

  const getColumnMinWidth = (col: string): string => {
    const type = getColumnType(col);
    switch (type) {
      case "id": return "120px";
      case "boolean": return "100px";
      case "date": return "180px";
      case "long_text": return "300px";
      case "number": return "100px";
      default: return "180px";
    }
  };

  const formatColumnHeader = (col: string) => {
    return col
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatCellValue = (value: any, col: string) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-300 italic text-xs">null</span>;
    }
    const type = getColumnType(col);
    const strVal = String(value);

    if (type === "boolean") {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          value === true || value === "true" || value === "1" || value === 1
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {value === true || value === "true" || value === "1" || value === 1 ? "Yes" : "No"}
        </span>
      );
    }

    if (type === "id") {
      const display = strVal.length > 12 ? strVal.substring(0, 8) + "..." : strVal;
      return (
        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded" title={strVal}>
          {display}
        </span>
      );
    }

    if (type === "date") {
      try {
        const d = new Date(strVal);
        if (!isNaN(d.getTime())) {
          return <span className="text-xs text-gray-600 whitespace-nowrap">{d.toLocaleString()}</span>;
        }
      } catch {}
      return <span className="text-xs text-gray-600">{strVal}</span>;
    }

    if (type === "number") {
      return <span className="font-mono text-sm text-gray-800">{strVal}</span>;
    }

    return strVal;
  };

  const cellKey = (rowId: string, col: string) => `${rowId}__${col}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Tables Browser
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Browse, edit, and manage translation table data across all languages.
        </p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-black">Select Table & Language</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Table</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {tables.map((t) => (
                  <option key={t.table} value={t.table}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleDisplay}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              Display
            </Button>
          </div>
        </CardContent>
      </Card>

      {tableData && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg text-black">
                {tables.find(t => t.table === tableData.baseTable)?.label || tableData.table}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({languages.find(l => l.code === tableData.language)?.flag}{" "}
                  {languages.find(l => l.code === tableData.language)?.name})
                </span>
              </CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {tableData.pagination.totalRows} record{tableData.pagination.totalRows !== 1 ? "s" : ""} total
                </span>
                <span className="text-xs text-gray-400 hidden sm:inline">
                  Scroll horizontally to see all columns
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {tableData.rows.length === 0 ? (
              <div className="text-center py-8 text-gray-500 px-6">
                No records found in this table.
              </div>
            ) : (
              <>
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto border rounded-lg mx-2 sm:mx-0"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#94a3b8 #f1f5f9",
                  }}
                >
                  <style>{`
                    .table-scroll::-webkit-scrollbar {
                      height: 10px;
                    }
                    .table-scroll::-webkit-scrollbar-track {
                      background: #f1f5f9;
                      border-radius: 5px;
                    }
                    .table-scroll::-webkit-scrollbar-thumb {
                      background: #94a3b8;
                      border-radius: 5px;
                    }
                    .table-scroll::-webkit-scrollbar-thumb:hover {
                      background: #64748b;
                    }
                  `}</style>
                  <div className="table-scroll overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#94a3b8 #f1f5f9" }}>
                    <table className="text-sm" style={{ minWidth: "100%", width: "max-content" }}>
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-200">
                          {tableData.columns.map((col, colIdx) => (
                            <th
                              key={col}
                              className={`px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200 last:border-r-0 ${
                                colIdx === 0 ? "sticky left-0 z-10 bg-gray-100" : ""
                              }`}
                              style={{ minWidth: getColumnMinWidth(col) }}
                            >
                              {formatColumnHeader(col)}
                              {isProtectedColumn(col) && (
                                <span className="ml-1 text-[10px] text-gray-400 font-normal">(locked)</span>
                              )}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap sticky right-0 z-10 bg-gray-100 border-l border-gray-200" style={{ minWidth: "90px" }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.rows.map((row, rowIdx) => (
                          <tr
                            key={row.id ?? rowIdx}
                            className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                          >
                            {tableData.columns.map((col, colIdx) => {
                              const isEditing =
                                editingCell?.rowId === String(row.id) &&
                                editingCell?.column === col;
                              const isProtected = isProtectedColumn(col);
                              const cellValue = row[col];
                              const strVal = cellValue === null || cellValue === undefined ? "" : String(cellValue);
                              const isLong = strVal.length > 100;
                              const isExpanded = expandedCell === cellKey(String(row.id), col);
                              const colType = getColumnType(col);

                              return (
                                <td
                                  key={col}
                                  className={`px-4 py-2.5 align-top border-r border-gray-100 last:border-r-0 ${
                                    colIdx === 0 ? `sticky left-0 z-[5] ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/80"} shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]` : ""
                                  }`}
                                  style={{ minWidth: getColumnMinWidth(col), maxWidth: colType === "long_text" ? "400px" : "300px" }}
                                >
                                  {isEditing ? (
                                    <div className="flex flex-col gap-1.5">
                                      {isLong || colType === "long_text" ? (
                                        <textarea
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="w-full border-2 border-blue-400 rounded-md px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 resize-y"
                                          autoFocus
                                        />
                                      ) : (
                                        <input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="w-full border-2 border-blue-400 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                                          autoFocus
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") saveEdit();
                                            if (e.key === "Escape") cancelEditing();
                                          }}
                                        />
                                      )}
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={saveEdit}
                                          disabled={isSaving}
                                          className="h-7 text-xs px-3 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          {isSaving ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          ) : (
                                            <Save className="h-3 w-3 mr-1" />
                                          )}
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelEditing}
                                          className="h-7 text-xs px-3"
                                        >
                                          <X className="h-3 w-3 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className={`group relative ${
                                        !isProtected ? "cursor-pointer rounded-md hover:bg-blue-50 px-1 py-0.5 -mx-1 -my-0.5 transition-colors" : ""
                                      }`}
                                      onClick={() => {
                                        if (!isProtected) {
                                          startEditing(String(row.id), col, cellValue);
                                        }
                                      }}
                                      title={!isProtected ? "Click to edit" : strVal}
                                    >
                                      {isLong && !isExpanded ? (
                                        <div>
                                          <span className="text-sm text-gray-800 leading-relaxed">
                                            {strVal.substring(0, 120)}...
                                          </span>
                                          <button
                                            className="ml-1 text-blue-500 hover:text-blue-700 text-xs font-medium inline-flex items-center gap-0.5"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExpandedCell(cellKey(String(row.id), col));
                                            }}
                                          >
                                            <Maximize2 className="h-3 w-3" />
                                            more
                                          </button>
                                        </div>
                                      ) : isLong && isExpanded ? (
                                        <div>
                                          <span className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                                            {strVal}
                                          </span>
                                          <button
                                            className="ml-1 text-blue-500 hover:text-blue-700 text-xs font-medium inline-flex items-center gap-0.5"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExpandedCell(null);
                                            }}
                                          >
                                            <Minimize2 className="h-3 w-3" />
                                            less
                                          </button>
                                        </div>
                                      ) : (
                                        <span className={`text-sm leading-relaxed ${isProtected ? "" : "text-gray-800"}`}>
                                          {formatCellValue(cellValue, col)}
                                        </span>
                                      )}
                                      {!isProtected && !isLong && (
                                        <Pencil className="h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 absolute top-0.5 right-0.5 transition-opacity" />
                                      )}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td className={`px-3 py-2.5 text-center sticky right-0 z-[5] border-l border-gray-200 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/80"} shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]`}>
                              {deleteConfirm === String(row.id) ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-[10px] text-red-600 font-medium">Delete?</span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(String(row.id))}
                                      disabled={isSaving}
                                      className="h-6 text-[10px] px-2"
                                    >
                                      {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setDeleteConfirm(null)}
                                      className="h-6 text-[10px] px-2"
                                    >
                                      No
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setDeleteConfirm(String(row.id))}
                                  className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                  title="Delete record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {tableData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t px-2 sm:px-0">
                    <span className="text-sm text-gray-600">
                      Page {tableData.pagination.page} of {tableData.pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Prev
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, tableData.pagination.totalPages) }, (_, i) => {
                          let pageNum: number;
                          const total = tableData.pagination.totalPages;
                          if (total <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= total - 2) {
                            pageNum = total - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={pageNum === currentPage ? "default" : "outline"}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={isLoading}
                              className="h-8 w-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= tableData.pagination.totalPages || isLoading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Select a language and table, then click "Display" to view the data.
            Click on any cell to edit its value (primary keys and foreign keys are locked).
            Use the horizontal scrollbar to see all columns. Long text can be expanded with the "more" button.
            Deleting a record from a translation table will mark the master record as needing
            re-synchronization on the next translation sync.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TablesManager;
