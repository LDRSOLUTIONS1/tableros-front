import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";
import TableImportaciones from "../../Components/Tables/TableImportaciones";

const Importaciones = () => {
  const { importaciones, GetImportaciones } = useContext(ImportacionesContext);

  useEffect(() => {
    GetImportaciones();
  }, []);

  return (
    <Layout>
      <TableImportaciones rows={importaciones} />
    </Layout>
  );
};

export default Importaciones;
