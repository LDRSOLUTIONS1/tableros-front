import { GET_USER, LOGIN_SUCCESS, LOGIN_ERROR } from "../../Types/Index";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        authenticated: true,
        usuario: action.payload,
        user: action.payload,
        loading: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        loading: false,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        authenticated: false,
        token: null,
        loading: false,
        errorAuth: "No está autenticado",
      };
    default:
      return state;
  }
};

export default AuthReducer;

