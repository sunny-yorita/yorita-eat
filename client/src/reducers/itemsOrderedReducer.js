import {
  ADD_TO_ORDER,
  FETCH_ORDER,
  REMOVE_FROM_ORDER,
  MODIFY_ORDER_QUANTITY,
  ON_CHECKOUT
} from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case ADD_TO_ORDER:
      return action.order;
    case REMOVE_FROM_ORDER:
      return action.order;
    case MODIFY_ORDER_QUANTITY:
      return action.order;
    case FETCH_ORDER:
      return action.order;
    case ON_CHECKOUT:
      return null;
    default:
      return state;
  }
};
