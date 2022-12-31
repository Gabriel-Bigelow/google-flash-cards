import { configureStore } from "@reduxjs/toolkit";
import topicsSlice from "../Components/Topics/topicsSlice";

import googleSlice from "../util/googleSlice";

export default configureStore({
  reducer: {
    google: googleSlice,
    topics: topicsSlice,
    
  },
});
