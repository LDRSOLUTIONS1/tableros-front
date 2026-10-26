import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import MethodGet, { MethodGetPDF } from "../../Config/Service";
import Layout from "../../Components/Layout/Layout";
import { EstadoChip } from "../../Utils/EstadoChip";
import { dateFormatter } from "../../Utils/dateFormatter";
import DownloadIcon from "@mui/icons-material/Download";

/* ----------------------------- Configuración ----------------------------- */

const HIDDEN_FIELDS = [
  "excel_import_version_id",
  "registro_hash",
  "created_at",
  "updated_at",
];

// false = oculta la columna inicialmente en MUI DataGrid.
const HIDDEN_BY_DEFAULT = {
  prod_est: false,
  cobertura: false,
};

// Años y números de mes se muestran sin separador de miles.
const NO_THOUSANDS = ["anio", "mes_numero", "numero_mes", "year"];

// Mientras haya una carga en curso se consulta el historial cada N ms.
const POLLING_MS = 5000;

const LABELS = {
  anio: "Año",
  year: "Año",
  mes_numero: "Mes (n.º)",
  numero_mes: "Número de mes",
  mes: "Mes",
  marca: "Marca",
  modelo: "Modelo",
  tipo: "Tipo",
  segmento: "Segmento",
  segmento_inegi: "Segmento INEGI",
  pais_destino: "País destino",
  pais_origen: "País de origen",
  exportacion: "Exportación (unidades)",
  produccion: "Producción (unidades)",
  cantidad: "Cantidad",
  prod_est: "Fuente",
  cobertura: "Cobertura",
  tema: "Tema",
  origen: "Origen",
  mercado_inegi: "Mercado INEGI",
  marca_mercado_foton: "Marca mercado FOTON",
  unidad_foton_inegi: "Unidad FOTON INEGI",
  seg_pv: "Segmento P&V",
  origen_2: "Origen 2",
};

const STATUS_CHIP = {
  completed: { label: "Completada", color: "success" },
  processing: { label: "Procesando", color: "info" },
  pending: { label: "Pendiente", color: "warning" },
  failed: { label: "Fallida", color: "error" },
};

const IN_PROGRESS = ["pending", "processing"];

const prettify = (key) =>
  LABELS[key] ?? key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const statusColor = (status) => STATUS_CHIP[status]?.color ?? "primary";

const formatDate = (value) => (value ? dateFormatter(value) : "—");

const formatNumber = (value) =>
  typeof value === "number" ? value.toLocaleString("es-MX") : (value ?? "—");

/* ------------------------------ Componentes ------------------------------ */

const StatusChip = ({ status }) => {
  const config = STATUS_CHIP[status] ?? {
    label: status || "Desconocido",
    color: "default",
  };

  return <Chip label={config.label} color={config.color} size="small" />;
};

const MetaItem = ({ icon, label, children }) => (
  <Box
    sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, minWidth: 0 }}
  >
    <Box sx={{ color: "text.secondary", display: "flex", mt: "2px" }}>
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", lineHeight: 1.2 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{ fontWeight: 600, wordBreak: "break-word" }}
      >
        {children ?? "—"}
      </Typography>
    </Box>
  </Box>
);

const KpiCard = ({ icon, title, value, helper, color = "primary" }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      height: "100%",
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Avatar
      variant="rounded"
      sx={(theme) => ({
        width: 46,
        height: 46,
        borderRadius: 2.5,
        bgcolor: alpha(theme.palette[color].main, 0.12),
        color: theme.palette[color].main,
      })}
    >
      {icon}
    </Avatar>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Box sx={{ fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.25 }}>
        {value}
      </Box>
      {helper && (
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ display: "block" }}
        >
          {helper}
        </Typography>
      )}
    </Box>
  </Paper>
);

const EmptyState = ({ title, description, action }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      py: 7,
      px: 2,
      color: "text.secondary",
      textAlign: "center",
    }}
  >
    <Avatar
      sx={{
        width: 72,
        height: 72,
        bgcolor: "action.hover",
        color: "text.secondary",
        mb: 1,
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 38 }} />
    </Avatar>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ maxWidth: 460 }}>
        {description}
      </Typography>
    )}
    {action}
  </Box>
);

const PageSkeleton = () => (
  <Box sx={{ p: { xs: 2, md: 4 } }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Skeleton variant="rounded" height={110} sx={{ borderRadius: 4 }} />
      <Grid container spacing={2}>
        {[0, 1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton variant="rounded" height={92} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }} />
    </Box>
  </Box>
);

/* -------------------------------- Vista --------------------------------- */

const DetalleImportaciones = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState(0);

  const [datosActuales, setDatosActuales] = useState(null);
  const [versiones, setVersiones] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState(null);

  const [loadingDatos, setLoadingDatos] = useState(true);
  const [loadingVersiones, setLoadingVersiones] = useState(true);
  const [errorDatos, setErrorDatos] = useState("");
  const [errorVersiones, setErrorVersiones] = useState("");

  const [datosTick, setDatosTick] = useState(0);
  const [copied, setCopied] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  //Download excel
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (version) => {
    if (!version?.id || !id) {
      window.alert("No se encontró la información de la versión.");
      return;
    }

    try {
      setDownloadingId(version.id);

      // id = ID de la fuente de Excel.
      // version.id = ID de la versión que se desea descargar.
      const response = await MethodGetPDF(
        `/importaciones/${id}/versiones/${version.id}/descargar`,
        {},
        {
          responseType: "blob",
        },
      );

      const blob = response.data;

      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new Error("El servidor no devolvió un archivo válido.");
      }

      // Laravel puede devolver JSON o HTML si ocurrió un error.
      if (
        blob.type.includes("application/json") ||
        blob.type.includes("text/html")
      ) {
        const contenido = await blob.text();

        let mensaje = contenido;

        try {
          const respuestaJson = JSON.parse(contenido);
          mensaje = respuestaJson.message || contenido;
        } catch {
          // Se conserva el contenido original si no es JSON.
        }

        throw new Error(
          mensaje || "No fue posible descargar el archivo Excel.",
        );
      }

      // Crear un enlace temporal para iniciar la descarga.
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download =
        version.original_filename || `version-${version.version_number}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Liberar la URL temporal.
      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      console.error("Error al descargar el Excel:", error);

      window.alert(
        error?.response?.data?.message ||
          error?.message ||
          "Ocurrió un error al descargar el archivo Excel.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // Permite descartar respuestas de una fuente anterior si el usuario navega.
  const activeIdRef = useRef(id);
  useEffect(() => {
    activeIdRef.current = id;
  }, [id]);

  // Reinicia el estado si el usuario navega a otra fuente.
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: 25 });
    setTab(0);
    setDatosActuales(null);
    setVersiones([]);
    setSelectedVersionId(null);
    setErrorDatos("");
    setErrorVersiones("");
  }, [id]);

  // Endpoint 1: datos vigentes de la fuente, paginados desde Laravel.
  useEffect(() => {
    if (!id) return undefined;

    let cancelled = false;
    setLoadingDatos(true);
    setErrorDatos("");

    MethodGet(
      `/${id}/datos?page=${paginationModel.page + 1}&per_page=${paginationModel.pageSize}`,
    )
      .then((res) => {
        if (!cancelled) setDatosActuales(res.data);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Error al consultar los datos actuales:", error);
          setErrorDatos(
            error?.response?.data?.message ??
              "No fue posible cargar los datos actuales de esta fuente.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDatos(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, paginationModel.page, paginationModel.pageSize, datosTick]);

  // Endpoint 2: historial de intentos/importaciones (solo metadatos).
  // `silent` evita parpadeos de carga cuando se consulta en segundo plano.
  const loadVersiones = useCallback(
    async ({ silent = false } = {}) => {
      if (!id) return;

      if (!silent) {
        setLoadingVersiones(true);
        setErrorVersiones("");
      }

      try {
        const res = await MethodGet(`/${id}/versiones`);
        if (activeIdRef.current !== id) return;

        const ordered = [...(res.data?.versions ?? [])].sort(
          (a, b) => b.version_number - a.version_number,
        );

        setVersiones(ordered);
        setSelectedVersionId((previousId) => {
          if (ordered.some((version) => version.id === previousId)) {
            return previousId;
          }
          return (
            ordered.find((version) => version.is_current)?.id ??
            ordered[0]?.id ??
            null
          );
        });
      } catch (error) {
        if (activeIdRef.current !== id || silent) return;
        console.error("Error al consultar el historial:", error);
        setErrorVersiones(
          error?.response?.data?.message ??
            "No fue posible cargar el historial de importaciones.",
        );
      } finally {
        if (!silent && activeIdRef.current === id) setLoadingVersiones(false);
      }
    },
    [id],
  );

  useEffect(() => {
    loadVersiones();
  }, [loadVersiones]);

  const source = datosActuales?.source ?? null;
  const currentVersion = datosActuales?.version ?? null;
  const dataset = datosActuales?.dataset ?? null;
  const rows = datosActuales?.rows ?? [];
  const pagination = datosActuales?.pagination ?? {
    current_page: 1,
    per_page: paginationModel.pageSize,
    total: 0,
    last_page: 1,
  };

  const latestVersion = versiones[0] ?? null;
  const selectedVersion = useMemo(
    () => versiones.find((version) => version.id === selectedVersionId) ?? null,
    [versiones, selectedVersionId],
  );

  const importInProgress = IN_PROGRESS.includes(latestVersion?.status);

  // Si hay una carga en curso, se actualiza el historial automáticamente.
  useEffect(() => {
    if (!importInProgress) return undefined;

    const timer = setInterval(
      () => loadVersiones({ silent: true }),
      POLLING_MS,
    );
    return () => clearInterval(timer);
  }, [importInProgress, loadVersiones]);

  // Al terminar la carga, se refrescan también los datos vigentes.
  const wasInProgress = useRef(false);
  useEffect(() => {
    if (wasInProgress.current && !importInProgress) {
      setDatosTick((tick) => tick + 1);
    }
    wasInProgress.current = importInProgress;
  }, [importInProgress]);

  const latestFailedNotCurrent =
    latestVersion?.status === "failed" &&
    latestVersion.id !== currentVersion?.id;

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(selectedVersion?.error_message ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("No se pudo copiar el error:", error);
    }
  };

  const columns = useMemo(() => {
    const fields = (dataset?.columns ?? []).filter(
      (field) => !HIDDEN_FIELDS.includes(field),
    );

    const rowNumberColumn = {
      field: "__rowNumber",
      headerName: "#",
      width: 70,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        paginationModel.page * paginationModel.pageSize +
        params.api.getRowIndexRelativeToVisibleRows(params.id) +
        1,
    };

    // La API devuelve tipos JSON; se infiere el tipo numérico con las filas cargadas.
    const dataColumns = fields.map((field) => {
      const isNumber = rows.some((row) => typeof row[field] === "number");

      return {
        field,
        headerName: prettify(field),
        minWidth: field === "prod_est" ? 240 : 140,
        flex: field === "prod_est" ? 2 : 1,
        type: isNumber ? "number" : undefined,
        align: isNumber ? "right" : "left",
        headerAlign: isNumber ? "right" : "left",
        valueFormatter: (value) => {
          if (value == null || value === "") return "—";
          if (typeof value === "number" && !NO_THOUSANDS.includes(field)) {
            return value.toLocaleString("es-MX");
          }
          return String(value);
        },
      };
    });

    return [rowNumberColumn, ...dataColumns];
  }, [dataset, rows, paginationModel.page, paginationModel.pageSize]);

  const historyRows = useMemo(
    () =>
      versiones.map((version) => ({
        ...version,
        imported_by_name: version.imported_by?.name ?? "—",
        display_date: formatDate(version.imported_at ?? version.created_at),
      })),
    [versiones],
  );

  const historyColumns = useMemo(
    () => [
      {
        field: "version_number",
        headerName: "Versión",
        minWidth: 130,
        flex: 0.7,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              v{params.row.version_number}
            </Typography>
            {params.row.is_current && (
              <Chip label="Vigente" color="primary" size="small" />
            )}
          </Box>
        ),
      },
      {
        field: "original_filename",
        headerName: "Archivo",
        minWidth: 190,
        flex: 1.4,
      },
      {
        field: "status",
        headerName: "Estado",
        minWidth: 135,
        flex: 0.8,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
      {
        field: "total_rows",
        headerName: "Filas importadas",
        minWidth: 140,
        type: "number",
        align: "right",
        headerAlign: "right",
        valueFormatter: (value) => formatNumber(value),
      },
      {
        field: "imported_by_name",
        headerName: "Importado por",
        minWidth: 150,
        flex: 0.8,
      },
      {
        field: "display_date",
        headerName: "Fecha",
        minWidth: 150,
        flex: 0.9,
      },
      {
        field: "error_message",
        headerName: "Error",
        minWidth: 110,
        sortable: false,
        renderCell: (params) =>
          params.value ? (
            <Tooltip title="Haz clic en la fila para ver el detalle" arrow>
              <Chip
                label="Ver error"
                color="error"
                variant="outlined"
                size="small"
              />
            </Tooltip>
          ) : (
            "—"
          ),
      },
      {
        field: "actions",
        headerName: "Descargar",
        width: 110,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const busy = downloadingId === params.row.id;
          return (
            <Tooltip title={`Descargar ${params.row.original_filename}`} arrow>
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  disabled={busy}
                  onClick={(event) => {
                    // Evita que el clic también seleccione la fila.
                    event.stopPropagation();
                    handleDownload(params.row);
                  }}
                >
                  {busy ? (
                    <CircularProgress size={18} />
                  ) : (
                    <DownloadIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          );
        },
      },
    ],
    [],
  );

  const gridSx = {
    border: "none",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: alpha(theme.palette.primary.main, 0.06),
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
      fontSize: "0.85rem",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    "& .MuiDataGrid-cell": {
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
      outline: "none",
    },
    "& .zebra": {
      backgroundColor: alpha(theme.palette.grey[500], 0.045),
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: theme.palette.action.hover,
      transition: "background-color 0.2s ease-in-out",
    },
  };

  /* ------------------------- Estados de la página ------------------------- */

  if (loadingDatos && !source) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  if (!source) {
    return (
      <Layout>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/importaciones")}
            sx={{ mb: 2 }}
          >
            Volver a importaciones
          </Button>
          {errorDatos ? (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setDatosTick((tick) => tick + 1)}
                >
                  Reintentar
                </Button>
              }
            >
              {errorDatos}
            </Alert>
          ) : (
            <Alert severity="warning">
              No se encontró la fuente de importación.
            </Alert>
          )}
        </Box>
      </Layout>
    );
  }

  const currentColor = currentVersion
    ? statusColor(currentVersion.status)
    : "warning";
  const latestColor = latestVersion
    ? statusColor(latestVersion.status)
    : "primary";

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Navegación + encabezado de la fuente */}
          <Box>
            <Button
              variant="text"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/importaciones")}
              sx={{ mb: 1, ml: -1 }}
            >
              Volver a importaciones
            </Button>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.07,
                )} 0%, ${theme.palette.background.paper} 60%)`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 3,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    <TableChartOutlinedIcon />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {source.nombre}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label={source.codigo}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: "monospace", fontWeight: 600 }}
                      />
                      {dataset?.label && (
                        <Typography variant="body2" color="text.secondary">
                          {dataset.label}
                        </Typography>
                      )}
                    </Box>
                    {source.descripcion && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.75 }}
                      >
                        {source.descripcion}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <EstadoChip estado={source.estado} />
              </Box>
            </Paper>
          </Box>

          {/* Carga en curso */}
          {importInProgress && (
            <Alert severity="info" icon={false}>
              <AlertTitle>
                Hay una carga en proceso (v{latestVersion.version_number})
              </AlertTitle>
              Esta pantalla se actualiza sola. Mientras tanto, los datos que ves
              siguen siendo los de la versión vigente.
              <LinearProgress sx={{ mt: 1.5, borderRadius: 1 }} />
            </Alert>
          )}

          {/* Aviso si el último intento falló */}
          {latestFailedNotCurrent && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setTab(1);
                    setSelectedVersionId(latestVersion.id);
                  }}
                >
                  Ver detalle
                </Button>
              }
            >
              <AlertTitle>
                La última carga (v{latestVersion.version_number}) falló.
              </AlertTitle>
              {currentVersion
                ? `Los datos actuales siguen asociados a la versión vigente v${currentVersion.version_number}.`
                : "No hay una versión completada identificada como vigente."}
            </Alert>
          )}

          {/* Resumen de la fuente */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<VerifiedOutlinedIcon />}
                color={currentColor}
                title="Versión vigente"
                value={
                  currentVersion ? `v${currentVersion.version_number}` : "—"
                }
                helper={
                  currentVersion
                    ? `Importada ${formatDate(currentVersion.imported_at)}`
                    : "Sin versión vigente"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<TableRowsOutlinedIcon />}
                color="primary"
                title="Registros actuales"
                value={formatNumber(
                  pagination.total ?? currentVersion?.total_rows ?? 0,
                )}
                helper="Filas en el conjunto vigente"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<EventAvailableOutlinedIcon />}
                color={latestColor}
                title="Última carga"
                value={
                  latestVersion ? (
                    <StatusChip status={latestVersion.status} />
                  ) : (
                    "—"
                  )
                }
                helper={
                  latestVersion
                    ? formatDate(
                        latestVersion.imported_at ?? latestVersion.created_at,
                      )
                    : "Sin importaciones registradas"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<LayersOutlinedIcon />}
                color="info"
                title="Versiones"
                value={loadingVersiones ? "…" : versiones.length}
                helper="Cargas registradas"
              />
            </Grid>
          </Grid>

          {/* Panel principal con las dos consultas */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, md: 3 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2.5, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                icon={<TableChartOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Datos actuales"
                sx={{ minHeight: 48, textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                icon={<HistoryOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label={`Historial de cargas (${versiones.length})`}
                sx={{ minHeight: 48, textTransform: "none", fontWeight: 600 }}
              />
            </Tabs>

            {/* Pestaña 1: conjunto de datos vigente */}
            {tab === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {dataset?.label ?? "Datos actuales"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vista de solo lectura del conjunto vigente. Usa el botón
                      “Columnas” para mostrar u ocultar campos.
                    </Typography>
                  </Box>
                  {currentVersion && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={downloadingId === currentVersion.id}
                        startIcon={
                          downloadingId === currentVersion.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DownloadIcon />
                          )
                        }
                        onClick={() =>
                          handleDownload({
                            ...currentVersion,
                            download_url: datosActuales?.download_url,
                          })
                        }
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Descargar Excel vigente
                      </Button>
                      <StatusChip status={currentVersion.status} />
                    </Box>
                  )}
                </Box>

                {currentVersion && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.grey[500], 0.06),
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <MetaItem
                          icon={
                            <InsertDriveFileOutlinedIcon fontSize="small" />
                          }
                          label="Archivo origen"
                        >
                          {currentVersion.original_filename}
                        </MetaItem>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2}>
                        <MetaItem
                          icon={<LayersOutlinedIcon fontSize="small" />}
                          label="Versión"
                        >
                          v{currentVersion.version_number}
                        </MetaItem>
                      </Grid>
                      <Grid item xs={6} sm={3} md={3}>
                        <MetaItem
                          icon={<PersonOutlineIcon fontSize="small" />}
                          label="Importado por"
                        >
                          {currentVersion.imported_by?.name ?? "—"}
                        </MetaItem>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetaItem
                          icon={<ScheduleOutlinedIcon fontSize="small" />}
                          label="Fecha de importación"
                        >
                          {formatDate(currentVersion.imported_at)}
                        </MetaItem>
                      </Grid>
                    </Grid>
                  </Paper>
                )}

                {errorDatos ? (
                  <Alert
                    severity="error"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => setDatosTick((tick) => tick + 1)}
                      >
                        Reintentar
                      </Button>
                    }
                  >
                    {errorDatos}
                  </Alert>
                ) : !loadingDatos && rows.length === 0 ? (
                  <EmptyState
                    title="No hay datos para mostrar"
                    description={
                      !currentVersion
                        ? "Todavía no hay una versión vigente. Cuando se complete una importación, sus registros aparecerán aquí."
                        : currentVersion.status !== "completed"
                          ? "La versión vigente no está completada. Revisa el historial de cargas."
                          : "La fuente todavía no contiene registros, o la consulta no devolvió filas."
                    }
                    action={
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<HistoryOutlinedIcon />}
                        onClick={() => setTab(1)}
                        sx={{ mt: 1, borderRadius: 2 }}
                      >
                        Ver historial de cargas
                      </Button>
                    }
                  />
                ) : (
                  <Box sx={{ width: "100%", height: isMobile ? 440 : 580 }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      loading={loadingDatos}
                      getRowId={(row) => row.id}
                      getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 1
                          ? "zebra"
                          : ""
                      }
                      rowCount={pagination.total ?? 0}
                      paginationMode="server"
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      pageSizeOptions={[25, 50, 100]}
                      // El orden y los filtros del grid solo actuarían sobre la
                      // página cargada; se desactivan para no inducir a error.
                      disableColumnSorting
                      disableColumnFilter
                      disableRowSelectionOnClick
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: false,
                          csvOptions: { disableToolbarButton: true },
                          printOptions: { disableToolbarButton: true },
                        },
                      }}
                      initialState={{
                        columns: { columnVisibilityModel: HIDDEN_BY_DEFAULT },
                      }}
                      localeText={
                        esES.components.MuiDataGrid.defaultProps.localeText
                      }
                      sx={gridSx}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Pestaña 2: historial de versiones/importaciones */}
            {tab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Historial de importaciones
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Selecciona una fila para ver el detalle y los errores de cada
                  intento. El historial muestra metadatos de las versiones, no
                  sus filas históricas.
                </Typography>

                {errorVersiones ? (
                  <Alert
                    severity="error"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => loadVersiones()}
                      >
                        Reintentar
                      </Button>
                    }
                  >
                    {errorVersiones}
                  </Alert>
                ) : loadingVersiones ? (
                  <Skeleton
                    variant="rounded"
                    height={320}
                    sx={{ borderRadius: 3 }}
                  />
                ) : versiones.length === 0 ? (
                  <EmptyState
                    title="Todavía no hay versiones"
                    description="Cuando importes un archivo, sus intentos aparecerán aquí."
                  />
                ) : (
                  <>
                    <Box sx={{ width: "100%", height: isMobile ? 460 : 500 }}>
                      <DataGrid
                        rows={historyRows}
                        columns={historyColumns}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 25, 50]}
                        columnVisibilityModel={{
                          imported_by_name: !isMobile,
                        }}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                          },
                          sorting: {
                            sortModel: [
                              { field: "version_number", sort: "desc" },
                            ],
                          },
                        }}
                        onRowClick={(params) =>
                          setSelectedVersionId(params.row.id)
                        }
                        getRowClassName={(params) =>
                          [
                            params.id === selectedVersionId
                              ? "selected-row"
                              : "",
                            params.indexRelativeToCurrentPage % 2 === 1
                              ? "zebra"
                              : "",
                          ]
                            .join(" ")
                            .trim()
                        }
                        disableRowSelectionOnClick
                        localeText={
                          esES.components.MuiDataGrid.defaultProps.localeText
                        }
                        sx={{
                          ...gridSx,
                          "& .MuiDataGrid-row": { cursor: "pointer" },
                          "& .selected-row, & .selected-row:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.12,
                            ),
                          },
                        }}
                      />
                    </Box>

                    {selectedVersion && (
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 2,
                          p: 2.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderLeft: "4px solid",
                          borderLeftColor: `${statusColor(selectedVersion.status)}.main`,
                          borderRadius: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={700}>
                            Detalle de la versión v
                            {selectedVersion.version_number}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <StatusChip status={selectedVersion.status} />
                            {selectedVersion.is_current && (
                              <Chip
                                label="Vigente"
                                color="primary"
                                size="small"
                              />
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={downloadingId === selectedVersion.id}
                              startIcon={
                                downloadingId === selectedVersion.id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <DownloadIcon />
                                )
                              }
                              onClick={() => handleDownload(selectedVersion)}
                              sx={{ borderRadius: 2, textTransform: "none" }}
                            >
                              Descargar archivo
                            </Button>
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <MetaItem
                              icon={
                                <InsertDriveFileOutlinedIcon fontSize="small" />
                              }
                              label="Archivo"
                            >
                              {selectedVersion.original_filename}
                            </MetaItem>
                          </Grid>
                          <Grid item xs={6} sm={3} md={2}>
                            <MetaItem
                              icon={<TableRowsOutlinedIcon fontSize="small" />}
                              label="Filas importadas"
                            >
                              {formatNumber(selectedVersion.total_rows)}
                            </MetaItem>
                          </Grid>
                          <Grid item xs={6} sm={3} md={3}>
                            <MetaItem
                              icon={<PersonOutlineIcon fontSize="small" />}
                              label="Importado por"
                            >
                              {selectedVersion.imported_by?.name ?? "—"}
                            </MetaItem>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <MetaItem
                              icon={<ScheduleOutlinedIcon fontSize="small" />}
                              label={
                                selectedVersion.status === "failed"
                                  ? "Fecha del intento"
                                  : "Fecha de importación"
                              }
                            >
                              {formatDate(
                                selectedVersion.imported_at ??
                                  selectedVersion.created_at,
                              )}
                            </MetaItem>
                          </Grid>
                        </Grid>

                        {selectedVersion.error_message && (
                          <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                            action={
                              <Button
                                color="inherit"
                                size="small"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyError}
                              >
                                {copied ? "Copiado" : "Copiar"}
                              </Button>
                            }
                          >
                            <AlertTitle>Detalle del error</AlertTitle>
                            <Box
                              component="pre"
                              sx={{
                                m: 0,
                                maxHeight: 180,
                                overflow: "auto",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                              }}
                            >
                              {selectedVersion.error_message}
                            </Box>
                          </Alert>
                        )}

                        {selectedVersion.is_current !== true &&
                          selectedVersion.status === "completed" && (
                            <Alert
                              severity="info"
                              sx={{ mt: 2 }}
                              action={
                                <Button
                                  color="inherit"
                                  size="small"
                                  onClick={() => setTab(0)}
                                >
                                  Ver datos actuales
                                </Button>
                              }
                            >
                              Esta es una versión anterior. La tabla de datos
                              actuales muestra el conjunto vigente, no una
                              reconstrucción de las filas de esta versión.
                            </Alert>
                          )}
                      </Paper>
                    )}
                  </>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
};

export default DetalleImportaciones;
