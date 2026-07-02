import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishList } from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishList(data));
  };
  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(newData));
    setOpenWishlist(false);
  };
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5 ">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>
          {/* Items Length */}
          <div className={`800px:${styles.normalFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {wishlist && wishlist.length} items
            </h5>
          </div>
          {/* Card Single Items */}
          <br />
          <div className="w-full border-t ">
            {wishlist &&
              wishlist.map((item, index) => (
                <CartSingle
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  addToCartHandler={addToCartHandler}
                  key={index}
                  item={item}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSingle = ({ item, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = item.discountPrice * value;
  return (
    <div className="border-b p-4 ">
      <div className="w-full 800px:flex  items-center">
        <RxCross1
          onClick={() => removeFromWishlistHandler(item)}
          className="cursor-pointer 800px:mb-['unset']  800px:ml-['unset'] mb-2 ml-2"
        />
        {/* Product Image */}
        <img
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px] "
          src={`${item?.images[0]?.url}`}
          alt="Static Product"
        />

        <div className="pl-[5px]">
          <h1>{item.name}</h1>
          <h4 className="font-[600] text-[17px] 800px:pt-[3px]  text-[red] font-Roboto">
            US$ {totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            onClick={() => addToCartHandler(item)}
            className="cursor-pointer"
            title="Add to Cart"
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
