import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import UsuariosContext from "../../Context/Usuarios/UsuariosContext";
import TableUsuariosLimited from "../../Components/Tables/TableUsuariosLimited";

const Administración = () => {
  const { usuarios, GetUsuariosLimited } = useContext(UsuariosContext);
  
  useEffect(() => {
    GetUsuariosLimited();
  }, []);

  return (
    <Layout>
      <TableUsuariosLimited rows={usuarios} />
    </Layout>
  );
};

export default Administración;
