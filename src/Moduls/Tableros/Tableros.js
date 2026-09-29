import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import TablerosContext from "../../Context/Tableros/TablerosContext";
import TableTableros from "../../Components/Tables/TableTableros";

const Tableros = () => {
  const { tableros, GetTableros } = useContext(TablerosContext);

  useEffect(() => {
    GetTableros();
  }, []);

  return (
    <Layout>
      <TableTableros rows={tableros} />
    </Layout>
  );
};

export default Tableros;
