import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "../constants/ActionTypes";
export const setAlert = (msg, type, time = 3000) => dispatch => {
  const id = uuid.v4();

  dispatch({
    type: SET_ALERT,
    alert: { id, msg, type }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, alertId: id }), time);
};
