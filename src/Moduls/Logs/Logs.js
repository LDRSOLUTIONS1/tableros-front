import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import LogsContext from "../../Context/Logs/LogsContext";
import TableLogs from "../../Components/Tables/TableLogs";

const Logs = () => {
  const { logs, GetLogs } = useContext(LogsContext);

  useEffect(() => {
    GetLogs();
  }, []);

  return (
    <Layout>
      <TableLogs rows={logs} />
    </Layout>
  );
};

export default Logs;
