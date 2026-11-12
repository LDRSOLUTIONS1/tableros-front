import React, { useReducer } from "react";
import AdministraciónPaginasContext from "./AdministraciónPaginasContext";
import AdministraciónPaginasReducer from "./AdministraciónPaginasReducer";
import MethodGet, { MethodPost, MethodPut } from "../../Config/Service";
import Swal from "sweetalert2";
import {
  GET_PAGINAS,
  ADD_PAGINAS,
  SHOW_PAGINAS,
  EDIT_PAGINAS,
} from "../../Types/Index";
import imageHeaders from "../../Config/ImageHeaders";

const AdministraciónPaginasState = ({ children }) => {
  const initialState = {
    paginas: [],
    pagina: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(
    AdministraciónPaginasReducer,
    initialState,
  );

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

  const GetPaginas = () => {
    MethodGet("/paginas")
      .then((res) => {
        dispatch({
          type: GET_PAGINAS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const GetPagina = (id) => {
    MethodGet(`/paginas/${id}`)
      .then((res) => {
        dispatch({
          type: SHOW_PAGINAS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const CreatePaginas = (data) => {
    MethodPost("/paginas", data, imageHeaders)
      .then((res) => {
        dispatch({ type: ADD_PAGINAS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Página creada correctamente",
          icon: "success",
        });
        GetPaginas();
      })
      .catch(handleError);
  };

  const EditPaginas = (data) => {
    MethodPut(`/paginas/${data.id}`, data)
      .then((res) => {
        dispatch({ type: EDIT_PAGINAS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Página actualizada correctamente",
          icon: "success",
        });
        GetPaginas();
      })
      .catch(handleError);
  };

  const AssignPermissions = (data) => {
    return MethodPost(`/paginas/${data.id}/excels`, {
      excel_source_ids: data.excel_source_ids,
    })
      .then((res) => {
        Swal.fire({
          title: "Éxito",
          text: res.data.message,
          icon: "success",
        });

        GetPaginas();

        return true;
      })
      .catch((error) => {
        handleError(error);
        return false;
      });
  };

  return (
    <AdministraciónPaginasContext.Provider
      value={{
        paginas: state.paginas,
        pagina: state.pagina,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetPaginas,
        GetPagina,
        CreatePaginas,
        EditPaginas,
        AssignPermissions,
      }}
    >
      {children}
    </AdministraciónPaginasContext.Provider>
  );
};

export default AdministraciónPaginasState;
