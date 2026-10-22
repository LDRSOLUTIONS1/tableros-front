import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";
import TableImportaciones from "../../Components/Tables/TableImportaciones";
import { Grid } from "@mui/material";

const Importaciones = () => {
  const { importaciones, GetImportaciones } = useContext(ImportacionesContext);

  useEffect(() => {
    GetImportaciones();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableImportaciones rows={importaciones} />
      </Grid>
    </Layout>
  );
};

export default Importaciones;
