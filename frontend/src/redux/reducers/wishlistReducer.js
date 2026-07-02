import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  wishlist: localStorage.getItem("wishListItems")
    ? JSON.parse(localStorage.getItem("wishListItems"))
    : [],
  cartTotalPrice: 0,
};
export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishList", (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);
      if (isItemExist) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.wishlist.push(item);
      }
      localStorage.setItem("wishListItems", JSON.stringify(state.wishlist));
    })
    .addCase("removeFromWishList", (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
      localStorage.setItem("wishListItems", JSON.stringify(state.wishlist));
    });
});
