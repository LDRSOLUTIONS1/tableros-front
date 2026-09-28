import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import RolesContext from "../../Context/Roles/RolesContext";
import TableRoles from "../../Components/Tables/TableRoles";

const Roles = () => {
  const { roles, GetRoles } = useContext(RolesContext);

  useEffect(() => {
    GetRoles();
  }, []);

  return (
    <Layout>
      <TableRoles rows={roles} />
    </Layout>
  );
};

export default Roles;
