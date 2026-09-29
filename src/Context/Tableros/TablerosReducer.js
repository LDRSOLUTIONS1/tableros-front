import { GET_TABLEROS, SHOW_TABLEROS } from "../../Types/Index";

const TablerosReducer = (state, action) => {
  switch (action.type) {
    case GET_TABLEROS:
      return {
        ...state,
        tableros: action.payload,
        success: false,
        ErrorsApi: [],
      };
    case SHOW_TABLEROS:
      return {
        ...state,
        tablero: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default TablerosReducer;
