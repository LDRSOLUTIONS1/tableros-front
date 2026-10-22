import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import MethodGet from "../../Config/Service";
import Layout from "../../Components/Layout/Layout";
import { EstadoChip } from "../../Utils/EstadoChip";
import { dateFormatter } from "../../Utils/dateFormatter";

/* ----------------------------- Configuración ----------------------------- */

// Columnas técnicas que no tiene sentido mostrar en la tabla
const HIDDEN_FIELDS = [
  "id",
  "excel_import_version_id",
  "registro_hash",
  "created_at",
  "updated_at",
];

// Columnas que existen pero se repiten en todas las filas: ocultas por defecto
// (el usuario puede activarlas desde el menú "Columnas")
const HIDDEN_BY_DEFAULT = { prod_est: false, cobertura: false };

// Campos numéricos que NO deben formatearse con separador de miles (2,021)
const NO_THOUSANDS = ["anio", "mes_numero"];

// Encabezados amigables (con acentos). Si no está aquí, se "embellece" la llave.
const LABELS = {
  anio: "Año",
  mes_numero: "Mes (n.º)",
  mes: "Mes",
  marca: "Marca",
  modelo: "Modelo",
  tipo: "Tipo",
  segmento: "Segmento",
  pais_destino: "País destino",
  exportacion: "Exportación (unidades)",
  prod_est: "Fuente",
  cobertura: "Cobertura",
};

const STATUS_CHIP = {
  completed: { label: "Completada", color: "success" },
  processing: { label: "Procesando", color: "info" },
  pending: { label: "Pendiente", color: "warning" },
  failed: { label: "Fallida", color: "error" },
};

const prettify = (key) =>
  LABELS[key] ?? key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const formatBytes = (bytes = 0) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const formatDate = (value) => (value ? dateFormatter(value) : "—");

// Las filas vienen dentro de la versión bajo una llave distinta según el Excel
// (exportacion_vehiculos, venta_publico, etc.). Tomamos la primera llave que sea arreglo.
const getRowsFromVersion = (version) => {
  if (!version) return [];
  const key = Object.keys(version).find((k) => Array.isArray(version[k]));
  return key ? version[key] : [];
};

/* ------------------------------ Componentes ------------------------------ */

const InfoItem = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{ fontWeight: 600, wordBreak: "break-word" }}>{children}</Box>
  </Box>
);

const SummaryCard = ({ title, value, helper }) => (
  <Paper
    elevation={0}
    sx={{ p: 2, borderRadius: 3, border: "1px solid #000000", height: "100%" }}
  >
    <Typography variant="caption" color="text.secondary">
      {title}
    </Typography>
    <Box sx={{ mt: 0.5, fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.2 }}>
      {value}
    </Box>
    {helper && (
      <Typography variant="caption" color="text.secondary">
        {helper}
      </Typography>
    )}
  </Paper>
);

const StatusIcon = ({ status }) => {
  if (status === "completed")
    return <CheckCircleIcon color="success" fontSize="small" />;
  if (status === "failed") return <ErrorIcon color="error" fontSize="small" />;
  return <HourglassTopIcon color="warning" fontSize="small" />;
};

/* -------------------------------- Vista --------------------------------- */

const DetalleImportaciones = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [importacion, saveImportacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVersionId, setSelectedVersionId] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    MethodGet(`/importaciones/${id}`)
      .then((res) => {
        saveImportacion(res.data);
        setSelectedVersionId(res.data.current_version_id);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  // Versiones ordenadas de la más nueva a la más vieja
  const versions = useMemo(
    () =>
      [...(importacion?.versions ?? [])].sort(
        (a, b) => b.version_number - a.version_number,
      ),
    [importacion],
  );

  const currentVersion = useMemo(
    () =>
      versions.find((v) => v.id === importacion?.current_version_id) ?? null,
    [versions, importacion],
  );

  const latestVersion = versions[0] ?? null;

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  );

  // Versión COMPLETADA inmediatamente anterior: sirve para mostrar la diferencia de filas.
  // (Una versión fallida tiene 0 filas y daría una comparación engañosa.)
  const previousCompletedVersion = useMemo(() => {
    if (!selectedVersion) return null;
    return (
      versions.find(
        (v) =>
          v.version_number < selectedVersion.version_number &&
          v.status === "completed",
      ) ?? null
    );
  }, [versions, selectedVersion]);

  const rows = useMemo(
    () => getRowsFromVersion(selectedVersion),
    [selectedVersion],
  );

  // Columnas generadas automáticamente a partir de la data (sirve para cualquier Excel).
  // Primero las de texto y al final las numéricas, para leer cada fila de izquierda a derecha.
  const columns = useMemo(() => {
    if (!rows.length) return [];
    const sample = rows[0];
    const keys = Object.keys(sample).filter(
      (key) => !HIDDEN_FIELDS.includes(key),
    );
    const isMetric = (key) =>
      typeof sample[key] === "number" && !NO_THOUSANDS.includes(key);

    const ordered = [
      ...keys.filter((k) => !isMetric(k)),
      ...keys.filter((k) => isMetric(k)),
    ];

    return ordered.map((key) => {
      const isNumber = isMetric(key);
      return {
        field: key,
        headerName: prettify(key),
        minWidth: key === "prod_est" ? 260 : 130,
        flex: key === "prod_est" ? 2 : 1,
        type: isNumber ? "number" : undefined,
        align: isNumber ? "right" : "left",
        headerAlign: isNumber ? "right" : "left",
        valueFormatter: isNumber
          ? (value) => (value ?? 0).toLocaleString("es-MX")
          : undefined,
      };
    });
  }, [rows]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!importacion) {
    return (
      <Layout>
        <Typography>No se encontró la importación.</Typography>
      </Layout>
    );
  }

  const statusChip = STATUS_CHIP[selectedVersion?.status] ?? {
    label: selectedVersion?.status,
    color: "default",
  };
  const latestStatusChip = STATUS_CHIP[latestVersion?.status] ?? {
    label: latestVersion?.status,
    color: "default",
  };

  const isSelectedCurrent =
    selectedVersion?.id === importacion.current_version_id;
  const isFailed = selectedVersion?.status === "failed";
  const isInProgress = ["pending", "processing"].includes(
    selectedVersion?.status,
  );

  const diffRows =
    selectedVersion?.status === "completed" && previousCompletedVersion
      ? selectedVersion.total_rows - previousCompletedVersion.total_rows
      : null;

  // Si la última carga falló, lo avisamos arriba para que no pase desapercibido
  const latestFailedNotCurrent =
    latestVersion?.status === "failed" &&
    latestVersion.id !== currentVersion?.id;

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 6 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Encabezado */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid #000000" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/importaciones")}
                  sx={{ borderRadius: 3 }}
                >
                  Volver
                </Button>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {importacion.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {importacion.codigo}
                  </Typography>
                </Box>
              </Box>
              <EstadoChip estado={importacion.estado} />
            </Box>
          </Paper>

          {/* Aviso global: la última carga falló */}
          {latestFailedNotCurrent && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setSelectedVersionId(latestVersion.id)}
                >
                  Ver detalle
                </Button>
              }
            >
              La última carga (v{latestVersion.version_number}) falló.
              {currentVersion
                ? ` Los datos vigentes siguen siendo los de la v${currentVersion.version_number}.`
                : ""}
            </Alert>
          )}

          {/* Resumen rápido de la fuente */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <SummaryCard
                title="Versión vigente"
                value={
                  currentVersion ? `v${currentVersion.version_number}` : "—"
                }
                helper="La que usan los reportes y Power BI"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <SummaryCard
                title="Registros vigentes"
                value={(currentVersion?.total_rows ?? 0).toLocaleString(
                  "es-MX",
                )}
                helper="Filas de la versión vigente"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <SummaryCard
                title="Última carga"
                value={
                  latestVersion ? (
                    <Chip
                      label={latestStatusChip.label}
                      color={latestStatusChip.color}
                      size="small"
                    />
                  ) : (
                    "—"
                  )
                }
                helper={
                  latestVersion
                    ? formatDate(
                        latestVersion.imported_at ?? latestVersion.created_at,
                      )
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <SummaryCard
                title="Versiones"
                value={versions.length}
                helper="Cargas registradas"
              />
            </Grid>
          </Grid>

          {/* Versionamiento */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid #000000" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Historial de versiones
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Selecciona una versión para ver sus datos y su información.
            </Typography>

            <Tabs
              value={selectedVersionId}
              onChange={(_, value) => setSelectedVersionId(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
            >
              {versions.map((v) => (
                <Tab
                  key={v.id}
                  value={v.id}
                  icon={<StatusIcon status={v.status} />}
                  iconPosition="end"
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {`v${v.version_number}`}
                      {v.id === importacion.current_version_id && (
                        <Chip label="Vigente" color="primary" size="small" />
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {/* Mensaje contextual según la versión seleccionada */}
            {selectedVersion && isFailed && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>
                  Esta carga falló y no se importó ningún dato
                </AlertTitle>
                {selectedVersion.error_message ??
                  "Ocurrió un error durante la importación."}
                {currentVersion && !isSelectedCurrent && (
                  <Box sx={{ mt: 1 }}>
                    Los datos vigentes siguen siendo los de la v
                    {currentVersion.version_number}.{" "}
                    <Button
                      size="small"
                      color="inherit"
                      sx={{ textDecoration: "underline", p: 0, minWidth: 0 }}
                      onClick={() => setSelectedVersionId(currentVersion.id)}
                    >
                      Ver versión vigente
                    </Button>
                  </Box>
                )}
              </Alert>
            )}

            {selectedVersion && isInProgress && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Esta carga todavía se está procesando. Actualiza la página en
                unos momentos.
              </Alert>
            )}

            {selectedVersion &&
              !isFailed &&
              !isInProgress &&
              !isSelectedCurrent &&
              currentVersion && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Estás viendo una versión anterior. La versión vigente es la v
                  {currentVersion.version_number}.{" "}
                  <Button
                    size="small"
                    color="inherit"
                    sx={{ textDecoration: "underline", p: 0, minWidth: 0 }}
                    onClick={() => setSelectedVersionId(currentVersion.id)}
                  >
                    Ir a la vigente
                  </Button>
                </Alert>
              )}

            {selectedVersion && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <InfoItem label="Archivo">
                      {selectedVersion.original_filename}
                    </InfoItem>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <InfoItem label="Estatus">
                      <Chip
                        label={statusChip.label}
                        color={statusChip.color}
                        size="small"
                      />
                    </InfoItem>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <InfoItem label="Filas importadas">
                      {selectedVersion.total_rows.toLocaleString("es-MX")}
                      {diffRows !== null && diffRows !== 0 && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1 }}
                          color={diffRows > 0 ? "success.main" : "error.main"}
                        >
                          {diffRows > 0 ? `+${diffRows}` : diffRows} vs v
                          {previousCompletedVersion.version_number}
                        </Typography>
                      )}
                    </InfoItem>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <InfoItem label="Importado por">
                      {selectedVersion.imported_by?.name ?? "—"}
                    </InfoItem>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <InfoItem
                      label={
                        isFailed ? "Fecha del intento" : "Fecha de importación"
                      }
                    >
                      {formatDate(
                        selectedVersion.imported_at ??
                          selectedVersion.created_at,
                      )}
                    </InfoItem>
                  </Grid>
                </Grid>

                {/* Datos técnicos plegados: útiles para soporte, ruido para el resto */}
                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{
                    mt: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" color="text.secondary">
                      Detalles técnicos del archivo
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={2}>
                        <InfoItem label="Tamaño">
                          {formatBytes(selectedVersion.file_size)}
                        </InfoItem>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <InfoItem label="Hash del archivo">
                          <Tooltip title="Identifica el archivo de forma única">
                            <Box
                              component="span"
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                              }}
                            >
                              {selectedVersion.file_hash}
                            </Box>
                          </Tooltip>
                        </InfoItem>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <InfoItem label="Ruta almacenada">
                          <Box
                            component="span"
                            sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                          >
                            {selectedVersion.file_path}
                          </Box>
                        </InfoItem>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </Paper>

          {/* Data de la versión seleccionada */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid #000000" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Datos de la versión{" "}
              {selectedVersion ? `v${selectedVersion.version_number}` : ""}
            </Typography>
            {rows.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {rows.length.toLocaleString("es-MX")} registros. Usa el buscador
                y los filtros para explorar; en "Columnas" puedes mostrar u
                ocultar campos.
              </Typography>
            )}

            {rows.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  py: 6,
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                <InboxOutlinedIcon sx={{ fontSize: 48 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {isFailed
                    ? "No hay datos porque esta carga falló"
                    : isInProgress
                      ? "Los datos aparecerán cuando termine el procesamiento"
                      : "Esta versión no tiene registros"}
                </Typography>
                {isFailed && currentVersion && !isSelectedCurrent && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, borderRadius: 3 }}
                    onClick={() => setSelectedVersionId(currentVersion.id)}
                  >
                    Ver datos de la versión vigente (v
                    {currentVersion.version_number})
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: isMobile ? 400 : 520 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                  disableRowSelectionOnClick
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 25, page: 0 } },
                    columns: { columnVisibilityModel: HIDDEN_BY_DEFAULT },
                  }}
                  localeText={
                    esES.components.MuiDataGrid.defaultProps.localeText
                  }
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: theme.palette.grey[100],
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: `2px solid ${theme.palette.primary.main}`,
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: theme.palette.action.hover,
                      transition: "0.2s ease-in-out",
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Grid>
    </Layout>
  );
};

export default DetalleImportaciones;
