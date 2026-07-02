import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  orders: [],
  adminOrders: [],
  adminOrderLoading: false,
};
//get all Orders of User
export const orderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.success = true;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    //get all Orders of Seller
    .addCase("getAllOrdersSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.success = true;
    })
    .addCase("getAllOrdersSellerFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    // Get all Orders Of Admin
    .addCase("getAllOrdersAdminRequest", (state) => {
      state.adminOrderLoading = true;
    })
    .addCase("getAllOrdersAdminSuccess", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = action.payload;
      state.success = true;
    })
    .addCase("getAllOrdersAdminFailed", (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
