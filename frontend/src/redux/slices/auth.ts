import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import parseJwt from "../../helpers/parseJwt";
import DrawerCounterApi from "../../api/DrawerCounterApi";
import { User } from "../../types/User";
import Token from "../../types/Token";
import { TOKEN_KEY } from "../../config";

export interface LoginPayload {
  username: string;
  password?: string;
}

export interface UpdatePayload {
  username: string;
  data: {
    username?: string;
    currency?: string;
    password?: string;
    amount?: number;
  };
  goodCallback?: Function;
  badCallback?: Function;
}

export interface AuthState {
  user: User;
  loading: boolean;
  loggedIn: boolean;
}

const initialState: AuthState = {
  user: {
    username: null,
    currency: "USD",
    amount: 10000,
    password: null,
  },
  loading: true,
  loggedIn: false,
};

export const userLogin = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload | undefined, { rejectWithValue }) => {
    try {
      const api = DrawerCounterApi.getInstance();

      let token: Token | null = api.token;

      if (!token) {
        token = await api.authenticateUser(data!);
        api.token = token;
      }

      return { token };
    } catch (error: any) {
      // return custom error message from backend if present

      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userRegister = createAsyncThunk(
  "auth/register",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const api = DrawerCounterApi.getInstance();

      const token = await api.registerUser(data);
      api.token = token;

      return { token };
    } catch (error: any) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (data, { rejectWithValue }) => {
    try {
      const api = DrawerCounterApi.getInstance();
      return { user: await api.getUser(parseJwt(api.token!).username) };
    } catch (error: any) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateUser = createAsyncThunk<
  { data: User; callback: Function | undefined },
  UpdatePayload,
  {
    rejectValue: { error: string; callback: Function | undefined };
  }
>("user/update", async (data, { rejectWithValue }) => {
  try {
    const resp = await DrawerCounterApi.getInstance().updateUser(
      data.username,
      data.data
    );
    return { data: resp, callback: data.goodCallback };
  } catch (error: any) {
    // return custom error message from backend if present
    const err =
      (error.response && error.response.data.message
        ? error.response.data.message
        : error.message) || null;
    return rejectWithValue({ error: err, callback: data.badCallback });
  }
});

const login = (state: AuthState) => {
  state.loggedIn = true;
  fetchUser();
};

const logout = (state: AuthState) => {
  localStorage.setItem(TOKEN_KEY, "");
  DrawerCounterApi.getInstance().resetToken();
  state.loggedIn = false;
  state.user = initialState.user;
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout,
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setCurrency: (state, { payload }: { payload: string }) => {
      state.user.currency = payload;
    },
    setAmount: (state, { payload }: { payload: number }) => {
      state.user.amount = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchUser.rejected, logout)
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.loading = false;
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loggedIn = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        localStorage.setItem(TOKEN_KEY, "");
        state.loading = false;
      })
      .addCase(userRegister.fulfilled, login)
      .addCase(userRegister.rejected, (state, { payload }) => {})
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        if (state.user.username !== payload.data.username) {
          logout(state);
          return;
        }
        state.user.amount = payload.data.amount;
        state.user.currency = payload.data.currency;
        payload.callback && payload.callback();
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        payload!.callback && payload!.callback();
      }),
});

export const { authState } = {
  authState: authSlice.actions,
};

export default authSlice;
