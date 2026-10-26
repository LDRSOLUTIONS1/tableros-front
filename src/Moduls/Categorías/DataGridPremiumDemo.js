import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";

const rows = [
  {
    id: 1,
    commodity: "Vehículos ligeros",
    quantity: 120,
    filledQuantity: 100,
    status: "Completado",
    isFilled: true,
    unitPrice: 25000,
    unitPriceCurrency: "USD",
    subTotal: 2500000,
    feeRate: 0.05,
    feeAmount: 125000,
    incoTerm: "FOB",
  },
  {
    id: 2,
    commodity: "Vehículos pesados",
    quantity: 80,
    filledQuantity: 60,
    status: "En proceso",
    isFilled: false,
    unitPrice: 45000,
    unitPriceCurrency: "USD",
    subTotal: 2700000,
    feeRate: 0.04,
    feeAmount: 108000,
    incoTerm: "CIF",
  },
  {
    id: 3,
    commodity: "Tractocamiones",
    quantity: 50,
    filledQuantity: 50,
    status: "Completado",
    isFilled: true,
    unitPrice: 85000,
    unitPriceCurrency: "USD",
    subTotal: 4250000,
    feeRate: 0.03,
    feeAmount: 127500,
    incoTerm: "EXW",
  },
];

const columns = [
  {
    field: "commodity",
    headerName: "Producto",
    flex: 1,
    minWidth: 180,
    editable: true,
  },
  {
    field: "quantity",
    headerName: "Cantidad",
    type: "number",
    width: 120,
    editable: true,
  },
  {
    field: "filledQuantity",
    headerName: "Cantidad procesada",
    type: "number",
    width: 170,
    editable: true,
  },
  {
    field: "status",
    headerName: "Estado",
    width: 140,
    editable: true,
  },
  {
    field: "isFilled",
    headerName: "Completado",
    type: "boolean",
    width: 130,
    editable: true,
  },
  {
    field: "unitPrice",
    headerName: "Precio unitario",
    type: "number",
    width: 150,
    editable: true,
  },
  {
    field: "unitPriceCurrency",
    headerName: "Moneda",
    width: 100,
    editable: true,
  },
  {
    field: "subTotal",
    headerName: "Subtotal",
    type: "number",
    width: 150,
    editable: true,
  },
  {
    field: "feeRate",
    headerName: "Tasa",
    type: "number",
    width: 100,
    editable: true,
  },
  {
    field: "feeAmount",
    headerName: "Importe de comisión",
    type: "number",
    width: 180,
    editable: true,
  },
  {
    field: "incoTerm",
    headerName: "Incoterm",
    width: 120,
    editable: true,
  },
];

export default function DataGridPremiumDemo() {
  const [tableRows, setTableRows] = React.useState(rows);

  const processRowUpdate = (newRow) => {
    setTableRows((previousRows) =>
      previousRows.map((row) => (row.id === newRow.id ? newRow : row)),
    );

    return newRow;
  };

  return (
    <Box
      sx={{
        height: 520,
        width: "100%",
      }}
    >
      <DataGrid
        rows={tableRows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
          sorting: {
            sortModel: [
              {
                field: "commodity",
                sort: "asc",
              },
            ],
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        showToolbar
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={(theme) => ({
          border: "none",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "background.paper",
          color: "text.primary",

          // Encabezados de las columnas
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#1E293B" : "#F1F5F9",
            color: "text.primary",
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontWeight: 700,
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            fontSize: "0.85rem",
          },

          // Barra de herramientas
          "& .MuiDataGrid-toolbarContainer": {
            padding: "12px 16px",
            gap: "8px",
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: "background.paper",
            flexWrap: "wrap",
          },

          // Botones: Columnas, Filtros, Densidad y Exportar
          "& .MuiDataGrid-toolbarContainer .MuiButton-root": {
            color: "text.primary",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.82rem",
            borderRadius: "8px",
            padding: "7px 12px",
            transition: "all 0.2s ease",
          },

          // Efecto hover sin cambiar permanentemente el fondo
          "& .MuiDataGrid-toolbarContainer .MuiButton-root:hover": {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.primary.main,
          },

          // Iconos de la barra de herramientas
          "& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root": {
            color: "inherit",
            fontSize: "1.2rem",
          },

          // Menús desplegables de la barra de herramientas
          "& .MuiDataGrid-menu .MuiPaper-root": {
            borderRadius: "12px",
          },

          // Filas
          "& .MuiDataGrid-row": {
            transition: "background-color 0.15s ease",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },

          // Celdas
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontSize: "0.875rem",
          },

          // Evitar bordes de enfoque poco estéticos
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },

          // Pie de tabla y paginación
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: "background.paper",
          },

          "& .MuiTablePagination-root": {
            color: "text.primary",
          },

          // Checkboxes
          "& .MuiCheckbox-root": {
            color: "text.secondary",
          },

          "& .MuiCheckbox-root.Mui-checked": {
            color: "primary.main",
          },

          // Iconos de ordenamiento
          "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton": {
            color: "text.secondary",
          },

          // Barra de desplazamiento
          "& .MuiDataGrid-scrollbar": {
            scrollbarWidth: "thin",
          },
        })}
      />
    </Box>
  );
}
