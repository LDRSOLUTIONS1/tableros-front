import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import MethodGet from "../../Config/Service";
import Layout from "../../Components/Layout/Layout";
import { EstadoChip } from "../../Utils/EstadoChip";
import { dateFormatter } from "../../Utils/dateFormatter";

// Columnas técnicas que no tiene sentido mostrar en la tabla
const HIDDEN_FIELDS = [
  "id",
  "excel_import_version_id",
  "registro_hash",
  "created_at",
  "updated_at",
];

// Campos numéricos que NO deben formatearse con separador de miles (2,021)
const NO_THOUSANDS = ["anio", "mes_numero"];

const STATUS_CHIP = {
  completed: { label: "Completada", color: "success" },
  processing: { label: "Procesando", color: "info" },
  pending: { label: "Pendiente", color: "warning" },
  failed: { label: "Fallida", color: "error" },
};

const prettify = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

const formatBytes = (bytes = 0) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

// Las filas vienen dentro de la versión bajo una llave distinta según el Excel
// (exportacion_vehiculos, venta_publico, etc.). Tomamos la primera llave que sea arreglo.
const getRowsFromVersion = (version) => {
  if (!version) return [];
  const key = Object.keys(version).find((k) => Array.isArray(version[k]));
  return key ? version[key] : [];
};

const InfoItem = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{ fontWeight: 600, wordBreak: "break-word" }}>{children}</Box>
  </Box>
);

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

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  );

  // Versión inmediatamente anterior, para mostrar la diferencia de filas
  const previousVersion = useMemo(() => {
    if (!selectedVersion) return null;
    return (
      versions.find((v) => v.version_number === selectedVersion.version_number - 1) ??
      null
    );
  }, [versions, selectedVersion]);

  const rows = useMemo(() => getRowsFromVersion(selectedVersion), [selectedVersion]);

  // Columnas generadas automáticamente a partir de la data,
  // así sirve para cualquier tipo de Excel importado
  const columns = useMemo(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0])
      .filter((key) => !HIDDEN_FIELDS.includes(key))
      .map((key) => {
        const isNumber =
          typeof rows[0][key] === "number" && !NO_THOUSANDS.includes(key);
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
  const diffRows = previousVersion
    ? selectedVersion.total_rows - previousVersion.total_rows
    : null;

  return (
    <Layout>
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

        {/* Versionamiento */}
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 4, border: "1px solid #000000" }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Versiones
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
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {`v${v.version_number}`}
                    {v.id === importacion.current_version_id && (
                      <Chip label="Actual" color="primary" size="small" />
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>

          {selectedVersion && (
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <InfoItem label="Archivo">{selectedVersion.original_filename}</InfoItem>
              </Grid>
              <Grid item xs={6} md={2}>
                <InfoItem label="Estatus">
                  <Chip label={statusChip.label} color={statusChip.color} size="small" />
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
                      {previousVersion.version_number}
                    </Typography>
                  )}
                </InfoItem>
              </Grid>
              <Grid item xs={6} md={2}>
                <InfoItem label="Tamaño">{formatBytes(selectedVersion.file_size)}</InfoItem>
              </Grid>
              <Grid item xs={6} md={3}>
                <InfoItem label="Importado por">
                  {selectedVersion.imported_by?.name ?? "—"}
                </InfoItem>
              </Grid>
              <Grid item xs={6} md={3}>
                <InfoItem label="Fecha de importación">
                  {dateFormatter(selectedVersion.imported_at)}
                </InfoItem>
              </Grid>
              <Grid item xs={6} md={3}>
                <InfoItem label="Hash del archivo">
                  <Tooltip title={selectedVersion.file_hash}>
                    <span>{selectedVersion.file_hash.slice(0, 12)}…</span>
                  </Tooltip>
                </InfoItem>
              </Grid>
              {selectedVersion.error_message && (
                <Grid item xs={12}>
                  <Typography color="error">{selectedVersion.error_message}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Paper>

        {/* Data de la versión seleccionada */}
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 4, border: "1px solid #000000" }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Datos de la versión {selectedVersion ? `v${selectedVersion.version_number}` : ""}
          </Typography>

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
              }}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
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
                  borderBottom: "1px solid #000000",
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
        </Paper>
      </Box>
    </Layout>
  );
};

export default DetalleImportaciones;
