import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Paper, Tabs, Tab, CircularProgress } from "@mui/material";

import Layout from "../../Components/Layout/Layout";
import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";
import TableImportaciones from "../../Components/Tables/TableImportaciones";
import TableImportacionesPorTablero from "../../Components/Tables/TableImportacionesPorTablero";

const Importaciones = () => {
  const {
    importaciones,
    tablerosImportaciones,
    GetImportaciones,
    GetImportacionesPorTablero,
  } = useContext(ImportacionesContext);

  const [vista, setVista] = useState(0);
  const [loading, setLoading] = useState(true);

  const role_id = localStorage.getItem("role_id");
  const esAdministrador = ["1", "2", "4"].includes(role_id);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await GetImportacionesPorTablero();
      setLoading(false);
    };

    cargarDatos();
  }, []);

  const handleChangeVista = async (event, nuevaVista) => {
    setVista(nuevaVista);

    if (nuevaVista === 1) {
      GetImportaciones();
    } else {
      await GetImportacionesPorTablero();
    }
  };

  return (
    <Layout>
      <Grid sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={vista}
            onChange={handleChangeVista}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Importaciones por tablero" />

            {esAdministrador && <Tab label="Administrar fuentes" />}
          </Tabs>
        </Paper>

        {vista === 0 ? (
          loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableImportacionesPorTablero rows={tablerosImportaciones} />
          )
        ) : (
          esAdministrador && <TableImportaciones rows={importaciones} />
        )}
      </Grid>
    </Layout>
  );
};

export default Importaciones;
