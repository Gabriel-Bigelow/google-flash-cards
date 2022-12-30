import { configureStore } from "@reduxjs/toolkit";

import googleSlice from "../util/googleSlice";

export default configureStore({
  reducer: {
    google: googleSlice,
  },
});
