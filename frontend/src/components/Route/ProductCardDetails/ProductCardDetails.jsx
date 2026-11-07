import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addTocart } from "../../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../../server";
import { toast } from "react-toastify";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/actions/wishlist";
const ProductCardDetails = ({ setOpen, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (wishlist && data?._id && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data?._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishList(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishList(data));
  };
  const handleMessageSubmit = () => {
    console.log("Done!");
  };
  const incrementCount = () => {
    setCount(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };
  const addTocartHandler = (id) => {
    const isItemExist = cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < count) {
        toast.error("Not enough stock available");
      } else {
        const cartItem = {
          ...data,
          qty: count,
        };
        dispatch(addTocart(cartItem));
        toast.success("Item added to cart successfully");
      }
    }
  };
  return (
    <div className="bg-[#202923]/60 backdrop-blur-sm">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#202923]/60 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-[#fbfcfa] rounded-[24px] border border-[#e7ebe5] shadow-2xl relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />
            {/* Main Container */}
            <div className="block w-full 800px:flex overflow-hidden">
              {/* Left Container */}
              <div className="w-full 800px:w-[50%]">
                {data.images && data.images[0] && (
                  <img
                    src={`${data.images && data.images[0]?.url}`}
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                )}

                <div className="flex ">
                  {data.shop && data.shop.avatar && (
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  )}
                  {/* Ratings to Product */}
                  <div>
                    <h3 className={`${styles.shop_name}`}>{data?.shop?.name}</h3>
                    <h5 className="pb-3 text-[15px] ">
                      ({data?.shop?.ratings}) Ratings
                    </h5>
                  </div>
                </div>
                <div
                  className={`${styles.button}  bg-[#315c46] mt-4 rounded-full h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff]  flex items-center ">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
                <h5 className="text-16px text-red-600 mt-5">
                  {`${data.sold_out}`} sold Out
                </h5>
              </div>
              {/* Right Container */}
              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]  ">
                <h1 className={`${styles.productTitle} text-[20px] `}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3 ">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.price ? data.price + "$" : null}
                  </h3>
                </div>
                {/* Quantity Handler */}
                <div className="flex items-center mt-12 justify-between pr-3 ">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 px-4 font-medium py-[11px] rounded-md ">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  {/* Heart icon */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={20}
                        className="cursor-pointer "
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={20}
                        className="cursor-pointer "
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addTocartHandler(data._id)}
                >
                  <span className="text-[#fff]  flex items-center ">
                    Add to Cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductCardDetails;
