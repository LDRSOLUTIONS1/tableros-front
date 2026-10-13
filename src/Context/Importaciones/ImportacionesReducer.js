import { GET_IMPORTACIONES, SHOW_IMPORTACIONES } from "../../Types/Index";

const ImportacionesReducer = (state, action) => {
  switch (action.type) {
    case GET_IMPORTACIONES:
      return {
        ...state,
        importaciones: action.payload,
        success: false,
        ErrorsApi: [],
      };
    case SHOW_IMPORTACIONES:
      return {
        ...state,
        importacion: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default ImportacionesReducer;
