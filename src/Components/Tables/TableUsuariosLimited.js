import React, { useState } from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { dateFormatter } from "../../Utils/dateFormatter";
import { EstadoChip } from "../../Utils/EstadoChip";
import { esES } from "@mui/x-data-grid/locales";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ModalAsignarTableros from "../Modals/ModalAsignarTableros";
import { Tooltip } from "@mui/material";

export default function TableUsuariosLimited({ rows = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [modalUpdate, OpenModalUpdate] = useState(false);
  const [id_usuario, saveIdUsuario] = useState(null);
  const handleClickOpenEdit = (id) => {
    OpenModalUpdate(true);
    saveIdUsuario(id);
  };
  const handleClickCloseEdit = () => {
    OpenModalUpdate(false);
    saveIdUsuario(null);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      minWidth: 50,
      type: "actions",
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            icon={<AdminPanelSettingsIcon sx={{ color: "#4ced02" }} />}
            label="Asignar tableros"
            onClick={() => handleClickOpenEdit(params.id)}
          />,
        ];
        return actions;
      },
    },

    {
      field: "collaborator_number",
      headerName: "Número de colaborador",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },

    {
      field: "name",
      headerName: "Nombre completo",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      minWidth: 180,
    },

    {
      field: "email",
      headerName: "Correo electrónico",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      minWidth: 180,
    },
    {
      field: "empresa",
      headerName: "Empresa",
      flex: 1,
      align: "left",
      headerAlign: "center",
      minWidth: 180,

      renderCell: (params) => (
        <Box sx={{ lineHeight: 1.3 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.brand ?? "N/A"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {params.row.location_name ?? "N/A"}
          </Typography>
        </Box>
      ),
    },

    {
      field: "puesto_area",
      headerName: "Puesto / Área",
      flex: 1.5,
      align: "left",
      headerAlign: "center",
      minWidth: 220,

      renderCell: (params) => (
        <Box sx={{ lineHeight: 1.3 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.puesto ?? "N/A"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {params.row.area ?? "N/A"}
          </Typography>
        </Box>
      ),
    },

    {
      field: "rol",
      headerName: "Rol",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      valueGetter: (value, row) => row.role?.name ?? "N/A",
    },

    {
      field: "dashboards",
      headerName: "Tableros asignados",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 150,

      renderCell: (params) => {
        const dashboards = params.row.dashboards ?? [];

        return (
          <Tooltip
            title={
              dashboards.length > 0
                ? dashboards.map((dashboard) => dashboard.nombre).join(", ")
                : "Sin tableros asignados"
            }
          >
            <span>
              {dashboards.length > 0
                ? `${dashboards.length} ${
                    dashboards.length === 1 ? "tablero" : "tableros"
                  }`
                : "Sin tableros"}
            </span>
          </Tooltip>
        );
      },
    },

    {
      field: "estado",
      headerName: "Estatus",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      type: "singleSelect",
      valueOptions: [
        { value: 1, label: "Inactivo" },
        { value: 2, label: "Activo" },
      ],
      renderCell: (params) => <EstadoChip estado={params.value} />,
    },
  ];

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #000000",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Administración de Tableros
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: isMobile ? 400 : 500,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            showToolbar
            autoHeight={isMobile}
            checkboxSelection={false}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            slots={{
              toolbar: () => (
                <Box
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight={600}>Total: {rows.length}</Typography>
                </Box>
              ),
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: "none",

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.grey[100],
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: 0.5,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `2px solid ${theme.palette.primary.main}`,
              },

              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #000000",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },

              "& .MuiDataGrid-columnSeparator": {
                opacity: 0.3,
                cursor: "col-resize",
              },

              "& .MuiDataGrid-columnSeparator:hover": {
                opacity: 1,
                color: theme.palette.primary.main,
              },

              "& .MuiDataGrid-columnHeader:active .MuiDataGrid-columnSeparator":
                {
                  color: theme.palette.primary.main,
                  width: 2,
                },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
                transition: "0.2s ease-in-out",
              },
            }}
          />
        </Box>
      </Paper>

      {id_usuario !== null && (
        <ModalAsignarTableros
          open={modalUpdate}
          handleClose={handleClickCloseEdit}
          id={id_usuario}
          rows={rows}
        />
      )}
    </>
  );
}
