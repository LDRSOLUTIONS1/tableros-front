import React, { useContext, useState } from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { dateFormatter } from "../../Utils/dateFormatter";
import EditImportaciones from "../../Moduls/Importaciones/EditImportaciones";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import AddImportaciones from "../../Moduls/Importaciones/AddImportaciones";
import { EstadoChip } from "../../Utils/EstadoChip";
import { esES } from "@mui/x-data-grid/locales";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddFileExcel from "../../Moduls/Importaciones/AddFileExcel";
import { useNavigate } from "react-router-dom";
import ViewListIcon from "@mui/icons-material/ViewList";

export default function TableImportaciones({ rows = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const role_id = localStorage.getItem("role_id");

  const [modalUpdate, OpenModalUpdate] = useState(false);
  const [id_importacion, saveIdImportacion] = useState(null);
  const handleClickOpenEdit = (id) => {
    OpenModalUpdate(true);
    saveIdImportacion(id);
  };
  const handleClickCloseEdit = () => {
    OpenModalUpdate(false);
    saveIdImportacion(null);
  };

  const [modalAdd, setOpenModalAdd] = useState(false);
  const handleClickOpenAdd = () => {
    setOpenModalAdd(true);
  };

  const handleClickCloseAdd = () => {
    setOpenModalAdd(false);
  };

  const [modalFile, setOpenModalFile] = useState(false);
  const [id_importacion_file, saveIdImportacionFile] = useState(null);
  const handleClickOpenFile = (id) => {
    setOpenModalFile(true);
    saveIdImportacionFile(id);
  };

  const handleClickCloseFile = () => {
    setOpenModalFile(false);
    saveIdImportacionFile(null);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      type: "actions",
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "#ed6c02" }} />}
            label="Editar"
            onClick={() => handleClickOpenEdit(params.id)}
          />,
        ];

        if (role_id !== "5") {
          actions.push(
            <GridActionsCellItem
              icon={<FileUploadIcon sx={{ color: "#4ced02" }} />}
              label="Importar Excel"
              onClick={() => handleClickOpenFile(params.id)}
            />,
          );
        }
        if (role_id !== "5") {
          actions.push(
            <GridActionsCellItem
              icon={<ViewListIcon sx={{ color: "#42b3f5" }} />}
              label="Ver detalles"
              onClick={() => navigate(`/importaciones/${params.id}`)}
            />,
          );
        }

        return actions;
      },
    },
    {
      field: "codigo",
      headerName: "Código",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
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
      field: "current_version_id",
      headerName: "Versión actual",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "estado",
      headerName: "Estado",
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
    {
      field: "created_at",
      headerName: "Última importación",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      renderCell: (params) => dateFormatter(params.value),
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
          Importaciones de Excel
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
                  {role_id !== "4" && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleClickOpenAdd}
                      sx={{ borderRadius: 3 }}
                    >
                      Importar Excel
                    </Button>
                  )}
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

      {id_importacion !== null && (
        <EditImportaciones
          open={modalUpdate}
          handleClose={handleClickCloseEdit}
          id={id_importacion}
        />
      )}

      <AddImportaciones open={modalAdd} handleClose={handleClickCloseAdd} />

      {id_importacion_file !== null && (
        <AddFileExcel
          open={modalFile}
          handleClose={handleClickCloseFile}
          id={id_importacion_file}
        />
      )}
    </>
  );
}
