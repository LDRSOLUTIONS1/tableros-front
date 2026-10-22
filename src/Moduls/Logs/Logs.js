import React, { useContext, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import LogsContext from "../../Context/Logs/LogsContext";
import TableLogs from "../../Components/Tables/TableLogs";
import { Grid } from "@mui/material";

const Logs = () => {
  const { logs, GetLogs } = useContext(LogsContext);

  useEffect(() => {
    GetLogs();
  }, []);

  return (
    <Layout>
      <Grid spacing={2} sx={{ p: 2 }}>
        <TableLogs rows={logs} />
      </Grid>
    </Layout>
  );
};

export default Logs;
