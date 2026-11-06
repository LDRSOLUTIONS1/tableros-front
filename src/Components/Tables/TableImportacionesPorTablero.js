import React, { useContext, useMemo, useState, useEffect } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  TextField,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { useNavigate, useSearchParams } from "react-router-dom";

import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";
import AddFileExcel from "../../Moduls/Importaciones/AddFileExcel";

// Agrupa las fuentes únicas de cada tablero.
// Un archivo puede alimentar varias páginas.
const agruparFuentes = (paginas = []) => {
  const fuentes = new Map();

  paginas.forEach((pagina) => {
    (pagina.excel_sources || []).forEach((archivo) => {
      const paginaRelacionada = {
        id: pagina.id,
        nombre: pagina.nombre,
        instrucciones: archivo.pivot?.instrucciones || "",
        es_requerido: archivo.pivot?.es_requerido === 1,
      };

      if (fuentes.has(archivo.id)) {
        fuentes.get(archivo.id).paginas.push(paginaRelacionada);
      } else {
        fuentes.set(archivo.id, {
          ...archivo,
          paginas: [paginaRelacionada],
        });
      }
    });
  });

  return Array.from(fuentes.values());
};

export default function TableImportacionesPorTablero({ rows = [] }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { handleClickDownload } = useContext(ImportacionesContext);

  const role_id = localStorage.getItem("role_id");

  // Consultor: solo consulta.
  // Ajustar de acuerdo con los permisos definitivos del backend.
  const puedeImportar = !["4", "5"].includes(role_id);
  const puedeConsultar = role_id !== "5";

  const tableroId = Number(searchParams.get("tablero_id")) || null;

  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState(tableroId);

  const [modalFile, setModalFile] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  useEffect(() => {
    if (tableroId) {
      setExpandido(tableroId);
    }
  }, [tableroId]);

  // Preparar tableros y evitar archivos repetidos dentro de cada uno.
  const tableros = useMemo(() => {
    return rows.map((tablero) => ({
      ...tablero,
      archivos: agruparFuentes(tablero.pages || []),
    }));
  }, [rows]);

  // Buscar por nombre del tablero, archivo o código.
  const tablerosFiltrados = tableros.filter((tablero) => {
    const texto = busqueda.toLowerCase();

    return (
      tablero.nombre.toLowerCase().includes(texto) ||
      tablero.archivos.some(
        (archivo) =>
          archivo.nombre.toLowerCase().includes(texto) ||
          archivo.codigo.toLowerCase().includes(texto),
      )
    );
  });

  const handleOpenFile = (archivo) => {
    setArchivoSeleccionado(archivo);
    setModalFile(true);
  };

  const handleCloseFile = () => {
    setModalFile(false);
    setArchivoSeleccionado(null);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Importaciones de Excel por tablero
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Selecciona un tablero para consultar los archivos Excel utilizados en
          sus páginas.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            size="small"
            label="Buscar tablero o Excel"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ width: { xs: "100%", sm: 350 } }}
          />

          <Typography fontWeight={600}>
            Total de tableros: {tablerosFiltrados.length}
          </Typography>
        </Box>

        {tablerosFiltrados.length === 0 && (
          <Alert severity="info">
            No se encontraron tableros con ese criterio.
          </Alert>
        )}

        {tablerosFiltrados.map((tablero) => (
          <Accordion
            key={tablero.id}
            expanded={expandido === tablero.id}
            onChange={(event, abierto) =>
              setExpandido(abierto ? tablero.id : null)
            }
            sx={{
              mb: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: "12px !important",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ width: "100%", flexWrap: "wrap" }}
              >
                <DashboardIcon color="primary" />

                <Box sx={{ flex: 1, minWidth: 180 }}>
                  <Typography fontWeight={600}>{tablero.nombre}</Typography>

                  <Typography variant="caption" color="text.secondary">
                    {tablero.pages?.length || 0} páginas relacionadas
                  </Typography>
                </Box>

                <Chip
                  label={`${tablero.archivos.length} archivos`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              {tablero.archivos.length === 0 ? (
                <Alert severity="info">
                  Este tablero todavía no tiene archivos Excel asociados.
                </Alert>
              ) : (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  <Table size="small" sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Archivo Excel</TableCell>
                        <TableCell>Páginas que actualiza</TableCell>
                        <TableCell align="center">Versión actual</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {tablero.archivos.map((archivo) => (
                        <TableRow hover key={archivo.id}>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <InsertDriveFileIcon color="success" />

                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {archivo.nombre}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {archivo.codigo}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              useFlexGap
                              flexWrap="wrap"
                            >
                              {archivo.paginas.map((pagina) => (
                                <Tooltip
                                  key={pagina.id}
                                  title={pagina.instrucciones || pagina.nombre}
                                  arrow
                                >
                                  <Chip
                                    label={pagina.nombre}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Tooltip>
                              ))}
                            </Stack>
                          </TableCell>

                          <TableCell align="center">
                            {archivo.current_version?.version_number
                              ? `V${archivo.current_version.version_number}`
                              : "Sin importación"}
                          </TableCell>

                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={0.5}
                              justifyContent="center"
                            >
                              {puedeConsultar && (
                                <Tooltip title="Descargar layout">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleClickDownload(
                                        archivo.id,
                                        archivo.codigo,
                                      )
                                    }
                                  >
                                    <FileDownloadIcon color="primary" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {puedeImportar && (
                                <Tooltip title="Importar Excel">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenFile(archivo)}
                                  >
                                    <FileUploadIcon color="success" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {puedeConsultar && (
                                <Tooltip title="Ver detalles y versiones">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      navigate(`/importaciones/${archivo.id}`)
                                    }
                                  >
                                    <VisibilityIcon color="info" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {archivoSeleccionado !== null && (
        <AddFileExcel
          open={modalFile}
          handleClose={handleCloseFile} 
          id={archivoSeleccionado.id}
          codigo={archivoSeleccionado.codigo}
          nombre={archivoSeleccionado.nombre}
        />
      )}
    </>
  );
}
