import React, { useReducer } from "react";
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

  const handleErrorr = (error) => {
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

  const AddFilee = async ({ archivo, id_importacion }) => {
    if (!archivo) {
      await Swal.fire({
        target: document.body,
        heightAuto: false,
        title: "Archivo requerido",
        text: "Debes seleccionar un archivo Excel.",
        icon: "warning",
      });

      return false;
    }

    if (!id_importacion) {
      await Swal.fire({
        target: document.body,
        heightAuto: false,
        title: "Importación no identificada",
        text: "No se recibió el identificador de la fuente de Excel.",
        icon: "error",
      });

      return false;
    }

    try {
      const formData = new FormData();

      // Debe coincidir con el nombre que espera Laravel.
      formData.append("archivo", archivo);

      const res = await MethodPost(
        `/importaciones/${id_importacion}/subir`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const { message, errores } = res.data || {};

      if (Array.isArray(errores) && errores.length > 0) {
        await Swal.fire({
          target: document.body,
          heightAuto: false,
          title: "Importación con advertencias",
          text: `${message || "La importación finalizó con advertencias."}\n\n${errores
            .map((error) =>
              typeof error === "string" ? error : JSON.stringify(error),
            )
            .join("\n")}`,
          icon: "warning",
        });
      } else {
        await Swal.fire({
          target: document.body,
          heightAuto: false,
          title: "Importación completada",
          text: message || "El archivo se procesó correctamente.",
          icon: "success",
        });
      }

      // Si ya tienes una función para actualizar la tabla
      // principal de importaciones, ejecútala aquí.

      return true;
    } catch (error) {
      const data = error.response?.data;
      let mensaje = data?.message || "Ocurrió un error al importar el archivo.";

      if (data?.errors) {
        mensaje = Object.values(data.errors).flat().join("\n");
      }

      await Swal.fire({
        target: document.body,
        heightAuto: false,
        title: "Error al importar",
        text: mensaje,
        icon: "error",
      });

      return false;
    }
  };

  const AddFile = ({ archivo, id_importacion }) => {
    if (!archivo || !id_importacion) {
      Swal.fire({
        title: "Datos incompletos",
        text: "Selecciona un archivo Excel válido.",
        icon: "warning",
      });
      return Promise.resolve(false);
    }

    const formData = new FormData();
    formData.append("archivo", archivo);

    return MethodPost(
      `/importaciones/${id_importacion}/subir`,
      formData,
      imageHeaders,
    )
      .then((res) => {
        const { message, errores } = res.data || {};

        if (Array.isArray(errores) && errores.length > 0) {
          Swal.fire({
            title: "Importación con advertencias",
            text: `${message || "La importación finalizó con advertencias."}\n\n${errores
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
      })
      .catch((error) => {
        handleError(error);
        return false;
      });
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
