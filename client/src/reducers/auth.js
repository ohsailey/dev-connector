import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  ACCOUNT_REMOVED,
  LOGOUT,
  USER_LOAD,
  AUTH_ERROR
} from "../constants/ActionTypes";

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: null
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false
      };
    case USER_LOAD:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.user
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false
      };
    case LOGOUT:
    case ACCOUNT_REMOVED:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
};

export default auth;
