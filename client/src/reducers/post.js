import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  ADD_POST,
  CLEAR_POST,
  DELETE_POST,
  UPDATE_LIKES,
  ADD_COMMENT,
  DELETE_COMMENT
} from "../constants/ActionTypes";

const initialState = {
  single: null,
  items: [],
  loading: true,
  error: {}
};

const post = (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTS:
      return { ...state, items: action.items, loading: false };
    case GET_POST:
      return { ...state, single: action.post, loading: false };
    case POST_ERROR:
      return { ...state, error: action.error, loading: false };
    case ADD_POST:
      return { ...state, items: [action.post, ...state.items] };
    case CLEAR_POST:
      return { ...state, single: null };
    case DELETE_POST:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.id),
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.post.id
            ? { ...item, likes: action.post.likes }
            : item
        ),
        loading: false
      };
    case ADD_COMMENT:
    case DELETE_COMMENT:
      return {
        ...state,
        single: { ...state.single, comments: action.comments },
        loading: false
      };
    default:
      return state;
  }
};

export default post;
