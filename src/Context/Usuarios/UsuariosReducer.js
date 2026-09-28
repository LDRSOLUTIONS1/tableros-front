import { GET_USUARIOS, SHOW_USUARIOS } from "../../Types/Index";

const UsuariosReducer = (state, action) => {
  switch (action.type) {
    case GET_USUARIOS:
      return {
        ...state,
        usuarios: action.payload,
        success: false,
        ErrorsApi: [],
      };
    case SHOW_USUARIOS:
      return {
        ...state,
        usuario: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default UsuariosReducer;
