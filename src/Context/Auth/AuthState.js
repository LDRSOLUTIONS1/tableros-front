import React, { useReducer } from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import MethodGet, { MethodPost } from "../../Config/Service";
import tokenAuth from "../../Config/TokenAuth";
import Swal from "sweetalert2";

import { GET_USER, LOGIN_SUCCESS, LOGIN_ERROR } from "../../Types/Index";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    authenticated: false,
    usuario: {},
    user: {},
    loading: true,
    success: false,
    errorAuth: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const AuthenticatedUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      tokenAuth(token);
    }

    MethodGet("/user")
      .then(({ data }) => {
        localStorage.setItem("role_id", data.user.role_id);
        localStorage.setItem("id", data.user.id);
        dispatch({
          type: GET_USER,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_ERROR,
        });
      });
  };

  const loginExternoo = async (collaborator_number) => {
    try {
      const { data } = await MethodPost(`/login/${collaborator_number}`);

      localStorage.setItem("token", data.token);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });

      await AuthenticatedUser();
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
      });
    }
  };

  const loginExterno = async () => {
    try {
      const { data } = await MethodPost(`/login`);
      localStorage.setItem("token", data.token);
      tokenAuth(data.token);
      //dispatch({ type: LOGIN_SUCCESS, payload: data });
      await AuthenticatedUser();
    } catch (error) {
      dispatch({ type: LOGIN_ERROR });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        authenticated: state.authenticated,
        usuario: state.usuario,
        user: state.user,
        success: state.success,
        loading: state.loading,
        errorAuth: state.errorAuth,
        AuthenticatedUser,
        loginExterno,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
