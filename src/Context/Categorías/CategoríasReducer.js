import { GET_CATEGORIAS, SHOW_CATEGORIAS } from "../../Types/Index";

const CategoríasReducer = (state, action) => {
  switch (action.type) {
    case GET_CATEGORIAS:
      return {
        ...state,
        categorias: action.payload,
        success: false,
        ErrorsApi: [],
      };
    case SHOW_CATEGORIAS:
      return {
        ...state,
        categoria: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default CategoríasReducer;
