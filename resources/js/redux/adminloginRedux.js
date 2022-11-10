import { createSlice } from "@reduxjs/toolkit";

const initialAdminLoginState = {
  adminlogin:false,
}

const adminloginSlice = createSlice({
  name:'adminlogin',
  initialState:initialAdminLoginState,
  reducers:{
    adminloggedin(state){
      state.adminlogin = true;
    },
    adminloggedout(state){
      state.adminlogin = false;
    },
  }
})

export const {adminloggedin} = adminloginSlice.actions;
export const {adminloggedout} = adminloginSlice.actions;
export default adminloginSlice.reducer;
