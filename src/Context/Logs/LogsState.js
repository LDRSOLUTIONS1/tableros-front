import React, { useReducer } from "react";
import LogsContext from "./LogsContext";
import LogsReducer from "./LogsReducer";
import MethodGet from "../../Config/Service";
import Swal from "sweetalert2";
import { GET_LOGS } from "../../Types/Index";

const LogsState = ({ children }) => {
  const initialState = {
    logs: [],
    log: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(LogsReducer, initialState);

  const handleError = (error) => {
    if (!error.response) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
      return;
    }
    const { status, data } = error.response;
    if (status === 422 && data.errors) {
      const mensajes = Object.entries(data.errors)
        .map(([campo, errores]) => `• ${errores.join(", ")}`)
        .join("\n");
      Swal.fire({
        title: "Error de validación",
        text: mensajes,
        icon: "warning",
      });
      return;
    }
    if (data.message) {
      Swal.fire("Error", data.message, "error");
      return;
    }
    Swal.fire("Error", "Ocurrió un error inesperado", "error");
  };

  const GetLogs = () => {
    MethodGet("/logs")
      .then((res) => {
        dispatch({
          type: GET_LOGS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  return (
    <LogsContext.Provider
      value={{
        logs: state.logs,
        log: state.log,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetLogs,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};

export default LogsState;
