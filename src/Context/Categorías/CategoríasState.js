import React, { useReducer } from "react";
import CategoríasContext from "./CategoríasContext";
import CategoríasReducer from "./CategoríasReducer";
import MethodGet, { MethodPost, MethodPut } from "../../Config/Service";
import Swal from "sweetalert2";
import {
  GET_CATEGORIAS,
  ADD_CATEGORIAS,
  SHOW_CATEGORIAS,
  EDIT_CATEGORIAS,
} from "../../Types/Index";
import imageHeaders from "../../Config/ImageHeaders";

const CategoriasState = ({ children }) => {
  const initialState = {
    categorias: [],
    categoria: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(CategoríasReducer, initialState);

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

  const GetCategorias = () => {
    MethodGet("/categorias")
      .then((res) => {
        dispatch({
          type: GET_CATEGORIAS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const GetCategoria = (id) => {
    MethodGet(`/categorias/${id}`)
      .then((res) => {
        dispatch({
          type: SHOW_CATEGORIAS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const CreateCategorias = (data) => {
    MethodPost("/categorias", data, imageHeaders)
      .then((res) => {
        dispatch({ type: ADD_CATEGORIAS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Categoría creada correctamente",
          icon: "success",
        });
        GetCategorias();
      })
      .catch(handleError);
  };

  const EditCategorias = (data) => {
    MethodPut(`/categorias/${data.id}`, data)
      .then((res) => {
        dispatch({ type: EDIT_CATEGORIAS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Categoría actualizada correctamente",
          icon: "success",
        });
        GetCategorias();
      })
      .catch(handleError);
  };

  return (
    <CategoríasContext.Provider
      value={{
        categorias: state.categorias,
        categoria: state.categoria,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetCategorias,
        GetCategoria,
        CreateCategorias,
        EditCategorias,
      }}
    >
      {children}
    </CategoríasContext.Provider>
  );
};

export default CategoriasState;
