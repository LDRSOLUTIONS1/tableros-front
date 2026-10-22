import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import CategoríasContext from "../../Context/Categorías/CategoríasContext";
import TableCategorías from "../../Components/Tables/TableCategorías";
import { Grid } from "@mui/material";

const Categorías = () => {
  const { categorias, GetCategorias } = useContext(CategoríasContext);

  useEffect(() => {
    GetCategorias();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableCategorías rows={categorias} />
      </Grid>
    </Layout>
  );
};

export default Categorías;
