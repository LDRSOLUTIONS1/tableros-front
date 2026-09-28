import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import UsuariosContext from "../../Context/Usuarios/UsuariosContext";
import TableUsuarios from "../../Components/Tables/TableUsuarios";

const Usuarios = () => {
  const { usuarios, GetUsuarios } = useContext(UsuariosContext);
  
  useEffect(() => {
    GetUsuarios();
  }, []);

  return (
    <Layout>
      <TableUsuarios rows={usuarios} />
    </Layout>
  );
};

export default Usuarios;
