import axios from "axios";
import { setAlert } from "./alert";
import {
  PROFILE_LOADING,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  CREATE_PROFILE,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_REMOVED
} from "../constants/ActionTypes";

// Get login user profile 取得使用者profile
export const getCurrentProfile = () => async dispatch => {
  dispatch({ type: PROFILE_LOADING });

  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      profile: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get list of user profile 取得使用者個人資訊名單
export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: PROFILE_LOADING });

  try {
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      profiles: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get profile by ID 取得單一使用者資訊
export const getProfileByID = userID => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userID}`);

    dispatch({
      type: GET_PROFILE,
      profile: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get github repos 取得使用者github資訊
export const getGithubReops = username => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      repos: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Create or Edit Profile 建立或編輯個人資料
export const createProfile = (
  formData,
  history,
  isEdit = false
) => async dispatch => {
  try {
    const res = await axios.post("/api/profile", formData);

    dispatch({
      type: isEdit ? UPDATE_PROFILE : CREATE_PROFILE,
      profile: res.data
    });

    dispatch(
      setAlert(isEdit ? "Profile Updated" : "Profile Created", "success")
    );

    if (!isEdit) {
      history.push("/dashboard");
    }
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Add experience 新增工作經驗
export const addExperience = (formData, history) => async dispatch => {
  try {
    const res = await axios.put("/api/profile/experience", formData);

    dispatch({
      type: UPDATE_PROFILE,
      profile: res.data
    });

    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Add education 新增學歷
export const addEducation = (formData, history) => async dispatch => {
  try {
    const res = await axios.put("/api/profile/education", formData);

    dispatch({
      type: UPDATE_PROFILE,
      profile: res.data
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.map(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Delete experience 移除工作經驗
export const deleteExperience = experienceID => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${experienceID}`);

    dispatch({
      type: UPDATE_PROFILE,
      profile: res.data
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Delete education 移除學歷
export const deleteEducation = educationID => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${educationID}`);

    dispatch({
      type: UPDATE_PROFILE,
      profile: res.data
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Delete profile & account 移除個人資料和帳號
export const deleteAccount = () => async dispatch => {
  try {
    if (window.confirm("Are you sure? This can NOT be RECOVER")) {
      await axios.delete("/api/profile");

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_REMOVED });

      dispatch(setAlert("Your account has been permanantly deleted"));
    }
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
