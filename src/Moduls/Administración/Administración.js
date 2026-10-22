import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import UsuariosContext from "../../Context/Usuarios/UsuariosContext";
import TableUsuariosLimited from "../../Components/Tables/TableUsuariosLimited";
import { Grid } from "@mui/material";

const Administración = () => {
  const { usuarios, GetUsuariosLimited } = useContext(UsuariosContext);

  useEffect(() => {
    GetUsuariosLimited();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableUsuariosLimited rows={usuarios} />
      </Grid>
    </Layout>
  );
};

export default Administración;
