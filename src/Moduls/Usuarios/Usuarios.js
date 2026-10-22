import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import UsuariosContext from "../../Context/Usuarios/UsuariosContext";
import TableUsuarios from "../../Components/Tables/TableUsuarios";
import { Grid } from "@mui/material";

const Usuarios = () => {
  const { usuarios, GetUsuarios } = useContext(UsuariosContext);

  useEffect(() => {
    GetUsuarios();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableUsuarios rows={usuarios} />
      </Grid>
    </Layout>
  );
};

export default Usuarios;
