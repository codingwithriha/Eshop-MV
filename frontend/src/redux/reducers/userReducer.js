import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  addressloading: false,
  successMessage: null,
  users: [],
  Userloading: false,
};
//builder callback notation
export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    //logout user
   .addCase("LogoutSuccess", (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    })
    // update user info
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("updateUserInfoFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Update User Address
    .addCase("updateUserAddressRequest", (state) => {
      state.addressloading = true;
    })
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("updateUserAddressFailure", (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })
    // Delete User Address
    .addCase("deleteUserAddressRequest", (state) => {
      state.addressloading = true;
    })
    .addCase("deleteUserAddressSuccess", (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("deleteUserAddressFailure", (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })
    //get all User --->ADMIN
    .addCase("getAllUsersRequest", (state) => {
      state.Userloading = true;
    })
    .addCase("getAllUsersSuccess", (state, action) => {
      state.Userloading = false;
      state.users = action.payload;
    })
    .addCase("getAllUsersFail", (state, action) => {
      state.Userloading = false;
      state.error = action.payload;
    })
    //Clear Errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
