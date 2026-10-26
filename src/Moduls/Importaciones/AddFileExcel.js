import * as React from "react";
import { useContext, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";

export default function AddFileExcel({ open, handleClose, id }) {
  const { AddFile } = useContext(ImportacionesContext);

  const { handleSubmit, reset } = useForm();

  const [archivo, setArchivo] = useState(null);
  const [columnas, setColumnas] = useState([]);
  const [filas, setFilas] = useState([]);
  const [nombreHoja, setNombreHoja] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [importando, setImportando] = useState(false);
  const enviandoRef = useRef(false);

  const limpiarFormulario = () => {
    setArchivo(null);
    setColumnas([]);
    setFilas([]);
    setNombreHoja("");
    setError("");
    setCargando(false);
    reset();
  };

  const cerrarModal = () => {
    limpiarFormulario();
    handleClose();
  };

  const detectarExcel = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    limpiarFormulario();
    setCargando(true);

    try {
      const extension = file.name.split(".").pop().toLowerCase();

      if (!["xlsx", "xls"].includes(extension)) {
        throw new Error(
          "Selecciona un archivo Excel con extensión .xlsx o .xls.",
        );
      }

      if (file.size === 0) {
        throw new Error("El archivo está vacío.");
      }

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      if (!workbook.SheetNames.length) {
        throw new Error("El archivo no contiene hojas.");
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const matriz = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
        blankrows: false,
      });

      if (!matriz.length) {
        throw new Error("La hoja seleccionada no contiene datos.");
      }

      const encabezadosOriginales = matriz[0];

      if (
        !encabezadosOriginales ||
        !encabezadosOriginales.some((valor) => String(valor).trim() !== "")
      ) {
        throw new Error("No se encontraron encabezados en la primera fila.");
      }

      const usados = new Set();

      const encabezados = encabezadosOriginales.map((valor, index) => {
        const texto = String(valor ?? "").trim();

        const nombreBase = texto || `Columna ${index + 1}`;
        let nombre = nombreBase;
        let contador = 2;

        while (usados.has(nombre.toLowerCase())) {
          nombre = `${nombreBase} (${contador})`;
          contador++;
        }

        usados.add(nombre.toLowerCase());

        return {
          field: `col_${index}`,
          headerName: nombre,
          minWidth: 150,
          flex: 1,
          sortable: true,
        };
      });

      const registros = matriz
        .slice(1)
        .filter((fila) =>
          fila.some((valor) => String(valor ?? "").trim() !== ""),
        )
        .map((fila, index) => {
          const registro = {
            __rowId: index + 1,
          };

          encabezados.forEach((columna, colIndex) => {
            registro[columna.field] = fila[colIndex] ?? "";
          });

          return registro;
        });

      setArchivo(file);
      setColumnas(encabezados);
      setFilas(registros);
      setNombreHoja(sheetName);
    } catch (err) {
      setError(err.message || "No fue posible leer el archivo Excel.");
    } finally {
      setCargando(false);
    }
  };

  const onSubmit = async () => {
    if (enviandoRef.current) return;

    if (!archivo || columnas.length === 0) {
      setError("Selecciona un archivo Excel válido.");
      return;
    }

    enviandoRef.current = true;
    setImportando(true);
    setError("");

    try {
      const resultado = await AddFile({
        archivo,
        id_importacion: id,
      });

      if (resultado) {
        cerrarModal();
      }
    } catch (err) {
      setError(err.message || "No fue posible importar el archivo.");
    } finally {
      enviandoRef.current = false;
      setImportando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!importando) {
          cerrarModal();
        }
      }}
      fullWidth
      maxWidth="xl"
      disableEnforceFocus
    >
      <DialogTitle>Nueva importación de Excel</DialogTitle>

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.target.tagName !== "BUTTON") {
            event.preventDefault();
          }
        }}
      >
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "action.hover",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 45, color: "primary.main" }} />

                <Typography variant="h6" sx={{ mb: 1 }}>
                  Selecciona tu archivo Excel
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Formatos permitidos: .xlsx y .xls
                </Typography>

                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  disabled={cargando || importando}
                >
                  Seleccionar archivo
                  <input
                    hidden
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={detectarExcel}
                  />
                </Button>
              </Box>
            </Grid>

            {cargando && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                  }}
                >
                  <CircularProgress size={24} />

                  <Typography>
                    Leyendo archivo y preparando vista previa...
                  </Typography>
                </Box>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              </Grid>
            )}

            {archivo && !cargando && (
              <>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <InsertDriveFileIcon
                      color="success"
                      sx={{ fontSize: 35 }}
                    />

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {archivo.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {(archivo.size / 1024).toFixed(2)} KB
                        {" · "}
                        Hoja: {nombreHoja}
                      </Typography>
                    </Box>

                    <Chip color="success" label="Excel leído" />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Total de registros
                        </Typography>

                        <Typography variant="h5">
                          {filas.length.toLocaleString("es-MX")}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Total de columnas
                        </Typography>

                        <Typography variant="h5">{columnas.length}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Tamaño del archivo
                        </Typography>

                        <Typography variant="h5">
                          {(archivo.size / 1024).toFixed(0)} KB
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Vista previa de los datos
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Revisa los encabezados y los registros antes de iniciar la
                    importación.
                  </Typography>

                  <Box sx={{ width: "100%", height: 420 }}>
                    <DataGrid
                      rows={filas}
                      columns={columnas}
                      getRowId={(row) => row.__rowId}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                            page: 0,
                          },
                        },
                      }}
                      pageSizeOptions={[10, 20, 50]}
                      disableRowSelectionOnClick
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      showToolbar
                      localeText={{
                        noRowsLabel: "No hay registros",
                        toolbarQuickFilterPlaceholder: "Buscar en Excel...",
                        paginationRowsPerPage: "Filas por página:",
                      }}
                    />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={cerrarModal}
            disabled={importando}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={cargando || importando || !archivo}
            startIcon={
              importando ? <CircularProgress size={18} color="inherit" /> : null
            }
            sx={{
              backgroundColor: "#1565c0",
              color: "white",
              "&:hover": {
                backgroundColor: "#0d47a1",
              },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "text.disabled",
              },
            }}
          >
            {importando ? "Importando Excel..." : "Importar Excel"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
