import React, { useReducer, useRef } from "react";
import ImportacionesContext from "./ImportacionesContext";
import ImportacionesReducer from "./ImportacionesReducer";
import MethodGet, {
  MethodPost,
  MethodPut,
  MethodGetPDF,
} from "../../Config/Service";
import Swal from "sweetalert2";
import {
  GET_IMPORTACIONES,
  GET_IMPORTACIONES_POR_TABLERO,
  ADD_IMPORTACIONES,
  SHOW_IMPORTACIONES,
  EDIT_IMPORTACIONES,
} from "../../Types/Index";
import imageHeaders from "../../Config/ImageHeaders";
import Appcss from "../../App.css";

const ImportacionesState = ({ children }) => {
  const initialState = {
    importaciones: [],
    tablerosImportaciones: [],
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

  const GetImportacionesPorTablero = async () => {
    try {
      const res = await MethodGet("/importacionesPorTablero");

      dispatch({
        type: GET_IMPORTACIONES_POR_TABLERO,
        payload: res.data,
      });

      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
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
      await GetImportacionesPorTablero();

      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      importacionEnCurso.current = false;
    }
  };

  const handleClickDownload = async (sourceId, codigo) => {
    try {
      const response = await MethodGetPDF(
        `/importaciones/${sourceId}/layout`,
        {},
        {
          responseType: "blob",
        },
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${codigo || sourceId}-layout.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error descargando layout:", error);

      if (error.response?.data instanceof Blob) {
        const errorData = await error.response.data.text();

        try {
          const json = JSON.parse(errorData);

          Swal.fire(
            "Error",
            json.message || "No fue posible descargar el layout.",
            "error",
          );
        } catch {
          Swal.fire(
            "Error",
            "No fue posible generar el archivo Excel.",
            "error",
          );
        }
      } else {
        handleError(error);
      }
    }
  };

  return (
    <ImportacionesContext.Provider
      value={{
        importaciones: state.importaciones,
        tablerosImportaciones: state.tablerosImportaciones,
        importacion: state.importacion,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetImportaciones,
        GetImportacionesPorTablero,
        GetImportacion,
        CreateImportaciones,
        EditImportaciones,
        AddFile,
        handleClickDownload,
      }}
    >
      {children}
    </ImportacionesContext.Provider>
  );
};

export default ImportacionesState;
