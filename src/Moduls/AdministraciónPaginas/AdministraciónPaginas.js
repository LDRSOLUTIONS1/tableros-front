import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import AdministraciónPaginasContext from "../../Context/AdministraciónPaginas/AdministraciónPaginasContext";
import TablePaginas from "../../Components/Tables/TablePaginas";
import { Grid } from "@mui/material";

const AdministraciónPaginas = () => {
  const { paginas, GetPaginas } = useContext(AdministraciónPaginasContext);

  useEffect(() => {
    GetPaginas();
  }, []);
  
  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TablePaginas rows={paginas} />
      </Grid>
    </Layout>
  );
};

export default AdministraciónPaginas;
