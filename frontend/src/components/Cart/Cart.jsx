import React from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../../styles/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const qtyChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart && cart.length == 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full flex justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5 ">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Items Length */}
              <div className={`${styles.normalFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[14px] font-bold">
                  {cart && cart.length} items
                </h5>
              </div>
              {/* Card Single Items */}
              <br />
              <div className="w-full border-t ">
                {cart &&
                  cart.map((item, index) => (
                    <CartSingle
                      key={index}
                      item={item}
                      qtyChangeHandler={qtyChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>
            <div className="px-5 mb-3 ">
              {/* Checkout buttons */}
              <Link
                to="/checkout"
                className={`h-[45px] flex items-center justify-center w-[100%] bg-[#315c46] rounded-xl`}
              >
                <h1 className="text-[#fff] text-[20px] font-[500] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]">
                  CheckOut Now USD$ ({totalPrice})
                </h1>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ item, qtyChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(item.qty);
  const totalPrice = item.discountPrice * value;
  const increment = (item) => {
    if (item.stock < value) {
      toast.error("Not enough stock available");
    } else {
      setValue(value + 1);
      const newData = {
        ...item,
        qty: value + 1,
      };
      qtyChangeHandler(newData);
    }
  };
  const decrement = (item) => {
    setValue(value == 1 ? 1 : value - 1);
    const newData = {
      ...item,
      qty: value == 1 ? 1 : value - 1,
    };
    qtyChangeHandler(newData);
  };
  return (
    <div className="border-b p-4 ">
      <div className="w-full flex  items-center">
        {/* Quantity Controls */}
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px]  ${styles.normalFlex}  justify-center cursor-pointer`}
            onClick={() => increment(item)}
          >
            <HiPlus size={20} className="text-[#fff]" />
          </div>
          <span className="pl-[10px]">{item.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(item)}
          >
            <HiOutlineMinus size={16} className="text-[#7d879d]" />
          </div>
        </div>
        {/* Product Image */}
        <img
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px] "
          src={`${item.images[0]?.url}`}
          alt="Static Product"
        />
        <div className="pl-[5px]">
          <h1>{item.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#000]">
            {item.discountPrice}*{value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[13px] text-[red] font-Roboto">
            US$ {totalPrice}
          </h4>
        </div>
        <RxCross1
          onClick={() => removeFromCartHandler(item)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Cart;
