import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOAD,
  AUTH_ERROR,
  CLEAR_PROFILE
} from "../constants/ActionTypes";

import setAuthToken from "../helpers/setAuthToken";

// Get user data by authorized token 之前已登入過，利用tokem取得使用者資料
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOAD,
      user: res.data
    });
  } catch (error) {
    localStorage.removeItem("token");

    dispatch({ type: AUTH_ERROR });
  }
};

// Login User 使用者登入
export const login = (email, password) => async dispatch => {
  try {
    const res = await axios.post("/api/auth", { email, password });

    localStorage.setItem("token", res.data.token);

    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({ type: LOGIN_FAIL });
  }
};

// Register User 使用者註冊
export const register = formData => async dispatch => {
  try {
    const res = await axios.post("/api/users", formData);

    localStorage.setItem("token", res.token);

    dispatch({ type: REGISTER_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({ type: REGISTER_FAIL });
  }
};

// Logout User 使用者登出
export const logout = () => dispatch => {
  localStorage.removeItem("token");

  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
