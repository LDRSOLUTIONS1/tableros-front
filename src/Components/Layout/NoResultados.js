import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const NoResultados = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "calc(100vh - 50px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Stack
          alignItems="center"
          textAlign="center"
          spacing={3}
          sx={{ maxWidth: 420 }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
            }}
          >
            <SearchOffRoundedIcon
              sx={{ fontSize: 40, color: "primary.main" }}
            />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3.5rem", sm: "5rem" },
              fontWeight: 800,
              lineHeight: 1,
              color: "text.primary",
              letterSpacing: "-0.02em",
            }}
          >
            404
          </Typography>

          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={600}>
              La página que buscas no está disponible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verifica la dirección web o regresa al inicio. Si crees que esto
              es un error, contacta al administrador del sistema.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} pt={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
            >
              Regresar
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={() => navigate("/")}
            >
              Ir al inicio
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
};

export default NoResultados;
