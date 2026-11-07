import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import ProductCardDetails from "../ProductCardDetails/ProductCardDetails";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/actions/wishlist";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setClick(Boolean(wishlist?.find((item) => item._id === data?._id)));
  }, [wishlist, data?._id]);

  const productUrl = isEvent
    ? `/product/${data?._id}?isEvent=true`
    : `/product/${data?._id}`;

  const toggleWishlist = () => {
    if (click) {
      dispatch(removeFromWishList(data));
    } else {
      dispatch(addToWishList(data));
    }
    setClick(!click);
  };

  const addToCart = () => {
    const exists = cart?.find((item) => item._id === data._id);
    if (exists) {
      toast.error("Item already in cart!");
      return;
    }
    if (data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Item added to cart successfully!");
  };

  if (!data?._id) return null;

  const hasDiscount = data.originalPrice && data.originalPrice > data.discountPrice;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#e8ece6] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#d5dfd5] hover:shadow-[0_18px_45px_rgba(34,55,42,.09)]">
      <div className="relative overflow-hidden bg-[#f4f6f2]">
        <Link to={productUrl} className="block aspect-[4/3]">
          <img
            src={data.images?.[0]?.url}
            alt={data.name || "Product"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
          />
        </Link>

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-[#315c46] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-white">
            Special price
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#344239] shadow-sm transition hover:bg-[#315c46] hover:text-white"
          >
            {click ? <AiFillHeart size={19} className="text-[#c65c55]" /> : <AiOutlineHeart size={19} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Quick view"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#344239] shadow-sm transition hover:bg-[#315c46] hover:text-white"
          >
            <AiOutlineEye size={19} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          to={`/shop/preview/${data?.shop?._id}`}
          className="mb-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#789080] transition hover:text-[#315c46]"
        >
          {data?.shop?.name || "Marketplace seller"}
        </Link>

        <Link to={productUrl} className="min-h-[44px]">
          <h3 className="line-clamp-2 text-[14px] font-bold leading-[1.55] text-[#26332b] transition hover:text-[#315c46] sm:text-[15px]">
            {data.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <Ratings rating={data?.ratings} />
          <span className="text-[11px] text-[#8a948d]">({data?.reviews?.length || 0})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[19px] font-extrabold tracking-tight text-[#263b2e]">
              ${data.discountPrice}
            </span>
            {hasDiscount && (
              <span className="text-[12px] font-medium text-[#9aa39c] line-through">
                ${data.originalPrice}
              </span>
            )}
          </div>
          <span className="whitespace-nowrap text-[10px] font-medium text-[#8a948d]">
            {data?.sold_out || 0} sold
          </span>
        </div>

        <button
          type="button"
          onClick={addToCart}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#dce5dc] bg-[#f7f9f6] text-[12px] font-bold text-[#315c46] transition hover:border-[#315c46] hover:bg-[#315c46] hover:text-white"
        >
          <AiOutlineShoppingCart size={17} />
          Add to cart
        </button>
      </div>

      {open && <ProductCardDetails setOpen={setOpen} data={data} />}
    </article>
  );
};

export default ProductCard;
