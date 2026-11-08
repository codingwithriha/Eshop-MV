import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { addTocart } from "../../redux/actions/cart";
import {
  addToWishList,
  removeFromWishList,
} from "../../redux/actions/wishlist";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { products } = useSelector((state) => state.products);
  const [count, setCout] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data?.shop?._id) return;
    dispatch(getAllProductsShop(data?.shop?._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [dispatch, wishlist, data?.shop?._id, data?._id]);
  const incrementCount = () => {
    setCout(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) {
      setCout(count - 1);
    }
  };
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishList(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishList(data));
  };

  const addTocartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item is already in the cart!");
    } else {
      if (data?.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };
  const totalReviewsLength =
    products?.length > 0
      ? products.reduce(
          (acc, product) => acc + (product?.reviews?.length || 0),
          0
        )
      : 0;
  const totalRatings =
    products?.length > 0
      ? products.reduce(
          (acc, product) =>
            acc +
            (product.reviews?.length > 0
              ? product.reviews.reduce(
                  (sum, review) => sum + (review.rating || 0),
                  0
                )
              : 0),
          0
        )
      : 0;
  const averageRating =

    totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;


  const handleMessageSubmit = async () => {
    if (isAuthenticated && user?._id && data?._id && data?.shop?._id) {
      const groupTitle = data?._id + user?._id;
      const userId = user?._id;
      const sellerId = data?.shop?._id;
      axios
        .post(`${server}/conversation/create-new-converation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?/${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data?.message);
        });
    } else {
      toast.error("Please Login To Create A Conversation!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] py-8">
      {data ? (
        <div className={` ${styles.section} w-[90%] 800px:w-[80%] `}>
          <div className="w-[100%] py-5">
            <div className="block w-full 800px:flex  ">
              {/* left Part  */}
              <div className="object-fit: cover w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}/${data && data.images[select]}`}
                  alt=""
                  className="w-[80%]"
                />
                <div
                  className="w-full flex gap-2
                "
                >
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === index ? "border" : ""
                        } cursor-pointer`}
                      >
                        <img
                              src={`${i?.url}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  <div
                    className={`${
                      select === 1 ? "border" : "null"
                    } cursor-pointer`}
                  ></div>
                </div>
              </div>
              {/* right Part */}
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{`${data.description}`}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
                  </h3>
                </div>
                {/* Quantity Handler */}
                <div className="flex items-center mt-12 justify-between pr-3 ">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-2xl px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
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
                {/* Add to cart Button */}
                <div
                  className={`${styles.button} !rounded !mt-6 capitalize text-[#fff] font-semibold !h-11 flex items-center`}
                  onClick={() => addTocartHandler(data._id)}
                >
                  <span className="text-white flex items-center gap-2">
                    add to cart
                    <AiOutlineShoppingCart />
                  </span>
                </div>
                {/* Selller part */}
                <div className="flex items-center pt-8 space-x-4">
                  <Link to={`/shop/preview/${data.shop?._id}`}>
                    <img
                      className="w-[50px] h-[50px] rounded-full  mr-2"
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                    />
                    {/* rating icons */}
                    <div className="pr-8">
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data?.shop?.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">
                        ({totalRatings}/5) Ratings
                      </h5>
                    </div>
                  </Link>

                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11 capitalize`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-[#fff] flex items-center gap-2 ">
                      send message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
          {/* Product Details and more Information */}
          <ProductsDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      ) : null}
    </div>
  );
};
const ProductsDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded ">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[10px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data && data.reviews && data.reviews.length > 0 ? (
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2" key={index}>
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user?.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      ) : null}
      {active === 3 ? (
        <div className="w-full block 800px:flex  justify-between m p-5">
          {/* left section */}
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data?.shop?._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full mr-2"
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data?.shop?.name}</h3>
                  <h5 className="pb-2 text-[15px] ">
                    ({averageRating}/5)Ratings
                  </h5>
                </div>
              </div>
            </Link>

            <p className="pt-2">{data?.shop?.description}</p>
          </div>
          {/* right section */}
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined On:
                <span className="font-[500] text-left">
                  {data.shop?.createdAt.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:
                <span className="font-[500] text-left">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:
                <span className="font-[500] text-left">
                  {totalReviewsLength}
                </span>
              </h5>
              <Link to={`/shop/preview/${data?.shop?._id}`}>
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ProductDetails;
