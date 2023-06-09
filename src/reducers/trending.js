import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../utils";

export const getTrending = createAsyncThunk(
  "trending/getTrending",
  async () => {
    const { data } = await client(
      `${process.env.REACT_APP_BACKEND_URL}/videos`
    );
    data.sort((a, b) => b.views - a.views);
    return data?.length > 5 ? data?.slice(0, 5) : data;
  }
);

const trendingSlice = createSlice({
  name: "trending",
  initialState: {
    isFetching: true,
    videos: [],
  },
  extraReducers: {
    [getTrending.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.videos = action.payload;
    },
  },
});

export default trendingSlice.reducer;
