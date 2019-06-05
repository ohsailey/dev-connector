import axios from "axios";
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
import { setAlert } from "./alert";

// Get Post List 取得文章列表
export const getPosts = () => async dispatch => {
  // Clear Post State 清除單一文章資料
  dispatch({ type: CLEAR_POST });

  try {
    const res = await axios.get("/api/posts");

    dispatch({
      type: GET_POSTS,
      items: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get Post By ID 取得單一文章
export const getPost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      post: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Add Post Like 文章點讚
export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      post: { id, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Remove Post Like 文章取消按讚
export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      post: { id, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Add post 建立文章
export const addPost = formData => async dispatch => {
  try {
    const res = await axios.post(`/api/posts`, formData);

    dispatch({
      type: ADD_POST,
      post: res.data
    });

    dispatch(setAlert("Post Created", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//Delete post 刪除文章
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({ type: DELETE_POST, id });
    dispatch(setAlert("Post Removed", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Add Comment To Post 新增文章留言
export const addComment = (postID, formData) => async dispatch => {
  try {
    const res = await axios.post(`/api/posts/comment/${postID}`, formData);

    dispatch({
      type: ADD_COMMENT,
      comments: res.data
    });
    dispatch(setAlert("Comment Added", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Delete Comment of Post 刪除文章留言
export const deleteComment = (postID, commentID) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postID}/${commentID}`);

    dispatch({
      type: DELETE_COMMENT,
      comments: res.data
    });
    dispatch(setAlert("Comment Removed", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      error: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
