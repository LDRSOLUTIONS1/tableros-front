import { GET_LOGS } from "../../Types/Index";

const LogsReducer = (state, action) => {
  switch (action.type) {
    case GET_LOGS:
      return {
        ...state,
        logs: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default LogsReducer;
