import React, { useReducer } from "react";
import UsuariosContext from "./UsuariosContext";
import UsuariosReducer from "./UsuariosReducer";
import MethodGet, { MethodPost, MethodPut } from "../../Config/Service";
import Swal from "sweetalert2";
import {
  GET_USUARIOS,
  ADD_USUARIOS,
  SHOW_USUARIOS,
  EDIT_USUARIOS,
} from "../../Types/Index";
import imageHeaders from "../../Config/ImageHeaders";

const UsuariosState = ({ children }) => {
  const initialState = {
    usuarios: [],
    usuario: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(UsuariosReducer, initialState);

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
  
  const GetUsuarios = () => {
    MethodGet("/usuarios")
      .then((res) => {
        dispatch({
          type: GET_USUARIOS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const GetUsuario = (id) => {
    MethodGet(`/usuarios/${id}`)
      .then((res) => {
        dispatch({
          type: SHOW_USUARIOS,
          payload: res.data,
        });
      })
      .catch(handleError);
  };

  const CreateUsuarios = (data) => {
    MethodPost("/usuarios", data, imageHeaders)
      .then((res) => {
        dispatch({ type: ADD_USUARIOS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Usuario creado correctamente",
          icon: "success",
        });
        GetUsuarios();
      })
      .catch(handleError);
  };

  const EditUsuarios = (data) => {
    MethodPut(`/usuarios/${data.id}`, data)
      .then((res) => {
        dispatch({ type: EDIT_USUARIOS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Usuario actualizado correctamente",
          icon: "success",
        });
        GetUsuarios();
      })
      .catch(handleError);
  };

  return (
    <UsuariosContext.Provider
      value={{
        usuarios: state.usuarios,
        usuario: state.usuario,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetUsuarios,
        GetUsuario,
        CreateUsuarios,
        EditUsuarios,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};

export default UsuariosState;
