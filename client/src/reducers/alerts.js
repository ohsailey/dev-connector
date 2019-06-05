import { SET_ALERT, REMOVE_ALERT } from "../constants/ActionTypes";

const initialState = [];

const alerts = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.alert];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== action.alertId);
    default:
      return state;
  }
};

export default alerts;
