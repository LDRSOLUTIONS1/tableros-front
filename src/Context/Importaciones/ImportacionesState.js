import React, { useReducer, useRef } from "react";
import ImportacionesContext from "./ImportacionesContext";
import ImportacionesReducer from "./ImportacionesReducer";
import MethodGet, { MethodPost, MethodPut } from "../../Config/Service";
import Swal from "sweetalert2";
import {
  GET_IMPORTACIONES,
  ADD_IMPORTACIONES,
  SHOW_IMPORTACIONES,
  EDIT_IMPORTACIONES,
} from "../../Types/Index";
import imageHeaders from "../../Config/ImageHeaders";
import Appcss from "../../App.css";

const ImportacionesState = ({ children }) => {
  const initialState = {
    importaciones: [],
    importacion: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(ImportacionesReducer, initialState);

  const importacionEnCurso = useRef(false);

  const handleError = (error) => {
    if (!error.response) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
      return;
    }
    const { status, data } = error.response;

    if (status === 422 && data.errors) {
      const mensajes = Object.values(data.errors)
        .flat()
        .map((m) => `• ${m}`)
        .join("\n");

      Swal.fire({
        title: data.message || "Error de validación",
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

  const GetImportaciones = () => {
    MethodGet("/importaciones")
      .then((res) => {
        dispatch({
          type: GET_IMPORTACIONES,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const GetImportacion = (id) => {
    MethodGet(`/importaciones/${id}`)
      .then((res) => {
        dispatch({
          type: SHOW_IMPORTACIONES,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const CreateImportaciones = (data) => {
    MethodPost("/importaciones", data, imageHeaders)
      .then((res) => {
        dispatch({ type: ADD_IMPORTACIONES, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Fuente de Excel creada correctamente",
          icon: "success",
        });
        GetImportaciones();
      })
      .catch(handleError);
  };

  const EditImportaciones = (data) => {
    MethodPut(`/importaciones/${data.id}`, data)
      .then((res) => {
        dispatch({ type: EDIT_IMPORTACIONES, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Fuente de Excel actualizada correctamente",
          icon: "success",
        });
        GetImportaciones();
      })
      .catch(handleError);
  };

  const AddFile = async ({ archivo, id_importacion }) => {
    if (importacionEnCurso.current) {
      return false;
    }

    if (!archivo || !id_importacion) {
      Swal.fire({
        title: "Datos incompletos",
        text: "Selecciona un archivo Excel válido.",
        icon: "warning",
      });

      return false;
    }

    importacionEnCurso.current = true;

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res = await MethodPost(
        `/importaciones/${id_importacion}/subir`,
        formData,
        imageHeaders,
      );

      const { message, errores } = res.data || {};

      if (Array.isArray(errores) && errores.length > 0) {
        Swal.fire({
          title: "Importación con advertencias",
          text: `${
            message || "La importación finalizó con advertencias."
          }\n\n${errores
            .map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
            .join("\n")}`,
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Éxito",
          text: message || "El archivo se procesó correctamente.",
          icon: "success",
        });
      }

      GetImportaciones();

      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      importacionEnCurso.current = false;
    }
  };

  return (
    <ImportacionesContext.Provider
      value={{
        importaciones: state.importaciones,
        importacion: state.importacion,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetImportaciones,
        GetImportacion,
        CreateImportaciones,
        EditImportaciones,
        AddFile,
      }}
    >
      {children}
    </ImportacionesContext.Provider>
  );
};

export default ImportacionesState;
