import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { TOKEN_KEY } from "../config";
import {
  userLogin,
  userRegister,
  fetchUser,
  authState,
  updateUser,
} from "./slices/auth";
import {
  calcAppState,
  fetchAllHistory,
  fetchHistory,
  fetchSchema,
  submitHistory,
} from "./slices/calculatorApp";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(userLogin.fulfilled, userRegister.fulfilled),
  effect: ({ payload }, { dispatch }) => {
    localStorage.setItem(TOKEN_KEY, payload.token!);
    dispatch(fetchUser());
    dispatch(fetchAllHistory());
  },
});

listenerMiddleware.startListening({
  actionCreator: submitHistory.fulfilled,
  effect: (action, { dispatch }) => {
    dispatch(fetchAllHistory());
  },
});

listenerMiddleware.startListening({
  actionCreator: fetchHistory.fulfilled,
  effect: ({ payload }, { dispatch }) => {
    dispatch(authState.setAmount(payload.drawerAmount));
    dispatch(authState.setCurrency(payload.currencyCode));
  },
});

listenerMiddleware.startListening({
  actionCreator: updateUser.fulfilled,
  effect: ({ payload }, { dispatch }) => {
    dispatch(calcAppState.resetResult());
  },
});

listenerMiddleware.startListening({
  predicate: (action, cs: any, ps: any) => {
    if (cs.auth.user.currency !== ps.auth.user.currency) return true;

    if (action.type === "auth/fetchUser/fulfilled") return true;

    return false;
  },
  effect: (action, { dispatch, getState }) => {
    const state: any = getState();
    dispatch(fetchSchema(state.auth.user.currency));
  },
});

export default listenerMiddleware;
