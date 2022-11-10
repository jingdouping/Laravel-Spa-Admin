import { configureStore } from "@reduxjs/toolkit";
import adminloginReducer from "./adminloginRedux";


const store = configureStore({
  reducer:{
    adminlogin:adminloginReducer,
  }
})

export default store;
