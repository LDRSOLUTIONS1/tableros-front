import React, { useContext, useMemo } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Layout from "../../Components/Layout/Layout";
import AuthContext from "../../Context/Auth/AuthContext";
import WorkIcon from "@mui/icons-material/Work";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const ROLES = {
  1: "Super Administrador",
  2: "Administrador",
  3: "Limitado",
  4: "Consultor",
};

const ESTADO_INACTIVO = 1;
const ESTADO_ACTIVO = 2;

const getSaludo = () => {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 19) return "Buenas tardes";

  return "Buenas noches";
};

const getFechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

const getIniciales = (nombre = "") => {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) return "U";

  return partes
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
};

const getNombreRol = (roleId) => ROLES[Number(roleId)] || "Usuario";

const getEstado = (estado) => {
  const valor = Number(estado);

  if (valor === ESTADO_ACTIVO) return { label: "Activo", color: "success" };
  if (valor === ESTADO_INACTIVO) return { label: "Inactivo", color: "default" };

  return { label: "Sin definir", color: "default" };
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  fallback = "No disponible",
  children,
}) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
    <Avatar
      variant="rounded"
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        color: "primary.main",
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
      }}
    >
      <Icon fontSize="small" />
    </Avatar>

    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>

      {children ?? (
        <Typography fontWeight={600} noWrap title={value || undefined}>
          {value || fallback}
        </Typography>
      )}
    </Box>
  </Stack>
);

const InicioSkeleton = () => (
  <>
    <Skeleton variant="rounded" height={190} sx={{ borderRadius: 4, mb: 3 }} />
    <Skeleton variant="rounded" height={280} sx={{ borderRadius: 4 }} />
  </>
);

const Inicio = () => {
  const { usuario, loading } = useContext(AuthContext);

  const saludo = useMemo(getSaludo, []);
  const fechaHoy = useMemo(getFechaHoy, []);

  const user = usuario?.user;
  const nombreCompleto = user?.name || "Usuario";
  const primerNombre = nombreCompleto.trim().split(/\s+/)[0];
  const estado = getEstado(user?.estado);

  return (
    <Layout>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {loading ? (
          <InicioSkeleton />
        ) : (
          <>
            {/* Bienvenida */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                mb: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.12 : 0.06,
                  ),
              }}
            >
              <Stack
                direction={{ xs: "column-reverse", md: "row" }}
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {fechaHoy}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mb: 1.5, fontSize: { xs: "1.8rem", md: "2.4rem" } }}
                  >
                    {saludo}, {primerNombre}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 620 }}
                  >
                    Bienvenido al sistema de{" "}
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      Inteligencia de Negocios
                    </Box>
                    . Desde aquí puedes consultar y gestionar la información.
                  </Typography>

                  <Chip
                    icon={<AdminPanelSettingsIcon />}
                    label={getNombreRol(user?.role_id)}
                    color="primary"
                    size="small"
                    sx={{ mt: 2.5 }}
                  />
                </Box>

                <Avatar
                  sx={{
                    width: { xs: 72, md: 104 },
                    height: { xs: 72, md: 104 },
                    fontSize: { xs: 28, md: 40 },
                    fontWeight: 700,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  {getIniciales(nombreCompleto)}
                </Avatar>
              </Stack>
            </Paper>

            {/* Información de la cuenta */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ p: 3 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Mi cuenta
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Datos del usuario con sesión iniciada
                  </Typography>
                </Box>

                <Chip
                  label={estado.label}
                  color={estado.color}
                  size="small"
                  variant={estado.color === "default" ? "outlined" : "filled"}
                />
              </Stack>

              <Divider />

              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Nombre */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={PersonIcon}
                      label="Nombre completo"
                      value={user?.name}
                    />
                  </Grid>

                  {/* Correo */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={EmailIcon}
                      label="Correo electrónico"
                      value={user?.email}
                    />
                  </Grid>

                  {/* Número de colaborador */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={BadgeIcon}
                      label="No. de colaborador"
                      value={user?.collaborator_number}
                    />
                  </Grid>

                  {/* Marca */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={BusinessIcon}
                      label="Marca"
                      value={user?.brand}
                      fallback="No asignada"
                    />
                  </Grid>

                  {/* Ubicación */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={LocationOnIcon}
                      label="Ubicación"
                      value={user?.location_name}
                      fallback="No asignada"
                    />
                  </Grid>

                  {/* Puesto */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={WorkIcon}
                      label="Puesto"
                      value={user?.puesto}
                      fallback="No asignado"
                    />
                  </Grid>

                  {/* Área */}
                  <Grid item xs={12} sm={6} md={4}>
                    <InfoItem
                      icon={AccountTreeIcon}
                      label="Área"
                      value={user?.area}
                      fallback="No asignada"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Inicio;
