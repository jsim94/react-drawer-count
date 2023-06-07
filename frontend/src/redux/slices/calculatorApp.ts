import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import DrawerCounterApi from "../../api/DrawerCounterApi";
import { RootState } from "../store";
import {
  CalcResult,
  CurrencyField,
  HistoryItem,
  Schema,
  Submission,
  getFields,
} from "../../types/CalcAppTypes";

export interface CalcState {
  historyList: HistoryItem[];
  loadingList: boolean;
  loading: boolean;
  deleteLoading: boolean;
  schema: Schema | null;
  result: CalcResult | null;
  total: number;
}

const initialState: CalcState = {
  historyList: [],
  loadingList: true,
  loading: true,
  deleteLoading: false,
  schema: null,
  result: null,
  total: 0,
};

export const fetchAllHistory = createAsyncThunk(
  "calcApp/getUserHistory",
  async () => {
    return await DrawerCounterApi.getInstance().getUserHistory();
  }
);

export const fetchSchema = createAsyncThunk(
  "calcApp/getSchema",
  async (schemaName: string, { rejectWithValue }) => {
    try {
      const res = await DrawerCounterApi.getInstance().getSchema(schemaName);
      return res;
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

export const submitHistory = createAsyncThunk(
  "calcApp/submit",
  async (data: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const payload: Submission = {
        drawerAmount: state.auth.user.amount,
        currencyCode: state.auth.user.currency,
        denominations: [],
      };

      getFields(state.calcApp.schema!).forEach((field) => {
        payload.denominations.push(data[field.name]);
      });

      return await DrawerCounterApi.getInstance().submitHistory(payload);
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

export const fetchHistory = createAsyncThunk(
  "calcApp/fetchHistory",
  async (id: string, { rejectWithValue }) => {
    try {
      return await DrawerCounterApi.getInstance().getHistory(id);
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

export const deleteAllHistory = createAsyncThunk(
  "calcApp/deleteAllHistory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await DrawerCounterApi.getInstance().deleteAllHistory();
      return res;
    } catch (e) {
      rejectWithValue(null);
    }
  }
);

const calcAppSlice = createSlice({
  name: "calcApp",
  initialState,
  reducers: {
    updateTotal: (state, { payload }) => {
      state.total = getFields(state.schema!).reduce((pv, cv) => {
        return pv + cv.value * payload[cv.name] || 0;
      }, 0);
    },
    resetResult: (state) => {
      state.result = null;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitHistory.fulfilled, (state, { payload }) => {
        state.result = payload;
      })
      .addCase(fetchAllHistory.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(fetchAllHistory.fulfilled, (state, { payload }) => {
        state.historyList = [...payload];
        state.loadingList = false;
      })
      .addCase(fetchAllHistory.rejected, (state, { payload }) => {
        state.loadingList = false;
      })
      .addCase(fetchSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchema.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.schema = payload;
      })
      .addCase(fetchSchema.rejected, (state) => {
        state.loading = false;
        state.schema = null;
      })
      .addCase(fetchHistory.fulfilled, (state, { payload }) => {
        state.result = payload;
      })
      .addCase(deleteAllHistory.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteAllHistory.fulfilled, (state) => {
        state.historyList = [];
        state.deleteLoading = false;
        state.result = null;
      })
      .addCase(deleteAllHistory.rejected, (state) => {
        state.deleteLoading = false;
      });
  },
});

export const { calcAppState } = {
  calcAppState: calcAppSlice.actions,
};

export default calcAppSlice;
