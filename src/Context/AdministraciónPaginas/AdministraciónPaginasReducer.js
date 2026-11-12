import { GET_PAGINAS, SHOW_PAGINAS } from "../../Types/Index";

const AdministraciónPaginasReducer = (state, action) => {
  switch (action.type) {
    case GET_PAGINAS:
      return {
        ...state,
        paginas: action.payload,
        success: false,
        ErrorsApi: [],
      };
    case SHOW_PAGINAS:
      return {
        ...state,
        pagina: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default AdministraciónPaginasReducer;
