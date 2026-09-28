import { GET_ROLES, SHOW_ROLES } from "../../Types/Index";

const RolesReducer = (state, action) => {
  switch (action.type) {
    case GET_ROLES:
      return {
        ...state,
        roles: action.payload,
        success: false,
        ErrorsApi: [],
      };
    case SHOW_ROLES:
      return {
        ...state,
        role: action.payload,
        success: false,
        ErrorsApi: [],
      };
    default:
      return state;
  }
};

export default RolesReducer;
