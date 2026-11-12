import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ModalDetallePagina from "../Modals/ModalDetallePagina";
import AdministraciónPaginasContext from "../../Context/AdministraciónPaginas/AdministraciónPaginasContext";
import EditIcon from "@mui/icons-material/Edit";
import { dateFormatter } from "../../Utils/dateFormatter";
import EditPaginas from "../../Moduls/AdministraciónPaginas/EditPaginas";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import AddPaginas from "../../Moduls/AdministraciónPaginas/AddPaginas";
import { EstadoChip } from "../../Utils/EstadoChip";
import { esES } from "@mui/x-data-grid/locales";
import TablerosContext from "../../Context/Tableros/TablerosContext";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import ModalPermissions from "../Modals/ModalPermissions";

export default function TablePaginas({ rows = [] }) {
  const { pagina, GetPagina } = useContext(AdministraciónPaginasContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { tableros, GetTableros } = useContext(TablerosContext);

  const [openModal, setOpenModal] = useState(false);
  const handleClickOpen = async (id) => {
    await GetPagina(id);
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const [modalUpdate, OpenModalUpdate] = useState(false);
  const [id_pagina, saveIdPagina] = useState(null);
  const handleClickOpenEdit = (id) => {
    OpenModalUpdate(true);
    saveIdPagina(id);
  };
  const handleClickCloseEdit = () => {
    OpenModalUpdate(false);
    saveIdPagina(null);
  };

  const [modalAdd, setOpenModalAdd] = useState(false);
  const handleClickOpenAdd = () => {
    setOpenModalAdd(true);
  };

  const handleClickCloseAdd = () => {
    setOpenModalAdd(false);
  };

  const [modalPermissions, OpenModalPermissions] = useState(false);
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(null);

  const handleClickOpenPermissions = (row) => {
    setPaginaSeleccionada(row);
    OpenModalPermissions(true);
  };

  const handleClickClosePermissions = () => {
    OpenModalPermissions(false);
    setPaginaSeleccionada(null);
  };

  useEffect(() => {
    GetTableros();
  }, []);

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      type: "actions",
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            icon={<VisibilityIcon sx={{ color: "#42A5F5" }} />}
            label="Ver detalles"
            onClick={() => handleClickOpen(params.id)}
          />,
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "#ed6c02" }} />}
            label="Editar"
            onClick={() => handleClickOpenEdit(params.id)}
          />,
          <GridActionsCellItem
            icon={<PermDataSettingIcon sx={{ color: "#15ff00" }} />}
            label="Configurar Excel"
            onClick={() => handleClickOpenPermissions(params.row)}
          />,
        ];
        return actions;
      },
    },
    {
      field: "tablero",
      headerName: "Tablero",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 250,
      valueGetter: (value, row) => row.dashboard?.nombre || "Sin tablero",
    },
    {
      field: "descripcion_tablero",
      headerName: "Descripción del tablero",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 300,
      valueGetter: (value, row) =>
        row.dashboard?.descripcion || "Sin descripción",
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "total_excels",
      headerName: "Excel asociados",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "orden",
      headerName: "Orden",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "created_at",
      headerName: "Creado en",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      renderCell: (params) => dateFormatter(params.value),
    },
    {
      field: "estado",
      headerName: "Estatus",
      flex: 0.5,
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
          Administración de páginas
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
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpenAdd}
                    sx={{ borderRadius: 3 }}
                  >
                    Nueva página
                  </Button>
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
      <ModalDetallePagina
        open={openModal}
        handleClose={handleClose}
        pagina={pagina}
      />

      {id_pagina !== null && (
        <EditPaginas
          open={modalUpdate}
          handleClose={handleClickCloseEdit}
          id={id_pagina}
          tableros={tableros}
        />
      )}

      <AddPaginas
        open={modalAdd}
        handleClose={handleClickCloseAdd}
        tableros={tableros}
      />

      {paginaSeleccionada !== null && (
        <ModalPermissions
          open={modalPermissions}
          handleClose={handleClickClosePermissions}
          id={paginaSeleccionada.id}
          pagina={paginaSeleccionada}
        />
      )}
    </>
  );
}
