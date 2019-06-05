import {
  PROFILE_LOADING,
  GET_PROFILE,
  GET_PROFILES,
  CREATE_PROFILE,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GET_REPOS
} from "../constants/ActionTypes";

const initialState = {
  me: null,
  others: [],
  repos: [],
  error: {},
  loading: true
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_LOADING:
      return { ...state, loading: true };
    case GET_PROFILE:
    case CREATE_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, me: action.profile, loading: false };
    case GET_PROFILES:
      return { ...state, others: action.profiles, loading: false };
    case PROFILE_ERROR:
      return { ...state, error: action.error, loading: false };
    case CLEAR_PROFILE:
      return { ...state, me: null };
    case GET_REPOS:
      return { ...state, repos: action.repos, loading: false };
    default:
      return state;
  }
};

export default profile;
