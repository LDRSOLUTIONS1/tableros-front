import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import TablerosContext from "../../Context/Tableros/TablerosContext";
import TableTableros from "../../Components/Tables/TableTableros";
import { Grid } from "@mui/material";

const Tableros = () => {
  const { tableros, GetTableros } = useContext(TablerosContext);

  useEffect(() => {
    GetTableros();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableTableros rows={tableros} />
      </Grid>
    </Layout>
  );
};

export default Tableros;
