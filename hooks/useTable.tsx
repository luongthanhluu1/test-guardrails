import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  DataGrid,
  Columns,
  SortModel,
  SelectionChangeParams,
  PageChangeParams,
  SortModelParams,
  SortItem,
  FilterModel,
} from "@material-ui/data-grid";

const useStyles = makeStyles({
  table: {
    width: "100%",
    height: "auto",
  },
});

interface UseTableProps {
  data: any[];
  headers: Columns;
  page?: number;
  pageSize?: number;
  sortModel?: SortModel;
  total?: number;
  loading?: boolean;
  onPageChange?: (params: PageChangeParams) => void;
  onSortChange?: (params: SortItem) => void;
  disableColumnSelector?: boolean;
  showToolbar?: boolean;
  paginationMode?: "server" | "client";
  sortingMode?: "server" | "client";
  filterModel?: FilterModel;
}

export const useTable = ({
  data,
  headers,
  page = 1,
  pageSize = 10,
  sortModel,
  total,
  loading,
  onPageChange,
  onSortChange,
  disableColumnSelector = false,
  showToolbar = false,
  paginationMode = "server",
  sortingMode = "server",
  filterModel,
}: UseTableProps) => {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const onSelectionChange = (e: SelectionChangeParams) => {
    setSelected(e.rowIds);
  };

  const onSortModelChange = (params: SortModelParams) => {
    if (params && params.sortModel && params.sortModel[0]) {
      onSortChange ? onSortChange(params.sortModel[0]) : null;
    }
  };

  const TableComponent = (
    <div style={{ height: "calc(100% - 300px)", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={headers}
        pageSize={pageSize}
        checkboxSelection
        rowsPerPageOptions={[10, 20, 30]}
        sortModel={sortModel}
        onSelectionChange={onSelectionChange}
        rowCount={total}
        page={page}
        loading={loading}
        paginationMode={paginationMode}
        onPageChange={onPageChange}
        autoHeight={true}
        disableSelectionOnClick={disableColumnSelector}
        sortingMode={sortingMode}
        onSortModelChange={onSortModelChange}
        filterModel={filterModel}
        showToolbar={showToolbar}
        filterMode="client"
        disableColumnFilter={false}
      />
    </div>
  );
  return { TableComponent, selected };
};
