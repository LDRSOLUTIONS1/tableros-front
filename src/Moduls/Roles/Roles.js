import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import RolesContext from "../../Context/Roles/RolesContext";
import TableRoles from "../../Components/Tables/TableRoles";
import { Grid } from "@mui/material";

const Roles = () => {
  const { roles, GetRoles } = useContext(RolesContext);

  useEffect(() => {
    GetRoles();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableRoles rows={roles} />
      </Grid>
    </Layout>
  );
};

export default Roles;
