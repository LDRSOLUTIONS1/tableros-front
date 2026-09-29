import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import CategoríasContext from "../../Context/Categorías/CategoríasContext";
import TableCategorías from "../../Components/Tables/TableCategorías";

const Categorías = () => {
  const { categorias, GetCategorias } = useContext(CategoríasContext);

  useEffect(() => {
    GetCategorias();
  }, []);

  return (
    <Layout>
      <TableCategorías rows={categorias} />
    </Layout>
  );
};

export default Categorías;
