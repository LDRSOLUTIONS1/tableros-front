import React, { useReducer } from "react";
import TablerosContext from "./TablerosContext";
import TablerosReducer from "./TablerosReducer";
import MethodGet, { MethodPost, MethodPut } from "../../Config/Service";
import Swal from "sweetalert2";
import {
  GET_TABLEROS,
  ADD_TABLEROS,
  SHOW_TABLEROS,
  EDIT_TABLEROS,
} from "../../Types/Index";
import imageHeaders from "../../Config/ImageHeaders";

const TablerosState = ({ children }) => {
  const initialState = {
    tableros: [],
    tablero: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(TablerosReducer, initialState);

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

  const GetTableros = () => {
    MethodGet("/tableros")
      .then((res) => {
        dispatch({
          type: GET_TABLEROS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const GetTablero = (id) => {
    MethodGet(`/tableros/${id}`)
      .then((res) => {
        dispatch({
          type: SHOW_TABLEROS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const CreateTableros = (data) => {
    MethodPost("/tableros", data, imageHeaders)
      .then((res) => {
        dispatch({ type: ADD_TABLEROS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Tablero creada correctamente",
          icon: "success",
        });
        GetTableros();
      })
      .catch(handleError);
  };

  const EditTableros = (data) => {
    MethodPut(`/tableros/${data.id}`, data)
      .then((res) => {
        dispatch({ type: EDIT_TABLEROS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Tablero actualizada correctamente",
          icon: "success",
        });
        GetTableros();
      })
      .catch(handleError);
  };

  return (
    <TablerosContext.Provider
      value={{
        tableros: state.tableros,
        tablero: state.tablero,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetTableros,
        GetTablero,
        CreateTableros,
        EditTableros,
      }}
    >
      {children}
    </TablerosContext.Provider>
  );
};

export default TablerosState;
