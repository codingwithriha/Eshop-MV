import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMinus,
  FiPlus,
  FiStar,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { getAllProductsShop } from "../../redux/actions/product";
import { addTocart } from "../../redux/actions/cart";
import { addToWishList, removeFromWishList } from "../../redux/actions/wishlist";
import Ratings from "./Ratings";
import CountDown from "../Events/CountDown";

const money = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount)
    : "—";
};

const ProductDetails = ({ data }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEvent = searchParams.has("isEvent");
  const dispatch = useDispatch();
  const { cart = [] } = useSelector((state) => state.cart || {});
  const { user, isAuthenticated } = useSelector((state) => state.user || {});
  const { wishlist = [] } = useSelector((state) => state.wishlist || {});
  const { products = [] } = useSelector((state) => state.products || {});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const images = useMemo(
    () => (Array.isArray(data?.images) ? data.images.filter((image) => image?.url) : []),
    [data?.images]
  );
  const shop = data?.shop || {};
  const inWishlist = wishlist.some((item) => item?._id === data?._id);
  const stock = Math.max(0, Number(data?.stock) || 0);
  const hasDiscount = Number(data?.originalPrice) > Number(data?.discountPrice);
  const discountPercent = hasDiscount
    ? Math.round(((Number(data.originalPrice) - Number(data.discountPrice)) / Number(data.originalPrice)) * 100)
    : 0;
  const reviewCount = Array.isArray(data?.reviews) ? data.reviews.length : 0;
  const totalShopReviews = products.reduce((sum, product) => sum + (product?.reviews?.length || 0), 0);
  const totalShopRating = products.reduce(
    (sum, product) => sum + (product?.reviews || []).reduce((sub, review) => sub + (Number(review?.rating) || 0), 0),
    0
  );
  const averageShopRating = totalShopReviews ? (totalShopRating / totalShopReviews).toFixed(1) : "New";

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab("details");
  }, [data?._id]);

  useEffect(() => {
    if (shop?._id) dispatch(getAllProductsShop(shop._id));
  }, [dispatch, shop?._id]);

  const addToCartHandler = () => {
    if (!data?._id) return;
    if (cart.some((item) => item?._id === data._id)) {
      toast.error("Item is already in your cart!");
      return;
    }
    if (quantity > stock) {
      toast.error("The requested quantity is not available.");
      return;
    }
    dispatch(addTocart({ ...data, qty: quantity }));
    toast.success("Added to cart successfully!");
  };

  const messageSeller = async () => {
    if (!isAuthenticated || !user?._id || !data?._id || !shop?._id) {
      toast.error("Please log in to message this seller.");
      return;
    }
    try {
      const groupTitle = data._id + user._id;
      const response = await axios.post(`${server}/conversation/create-new-converation`, {
        groupTitle,
        userId: user._id,
        sellerId: shop._id,
      });
      navigate(`/inbox?/${response.data.conversation._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start a conversation.");
    }
  };

  const tabs = isEvent
    ? [{ id: "details", label: "Offer details" }, { id: "seller", label: "Seller" }]
    : [{ id: "details", label: "Description" }, { id: "reviews", label: `Reviews (${reviewCount})` }, { id: "seller", label: "Seller" }];

  if (!data) {
    return (
      <main className="min-h-[55vh] bg-[#f7f8f5] px-5 py-20">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-[#e5ebe3] bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#66806e]">Eshop marketplace</p>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-[#26372d]">This listing is unavailable</h1>
          <p className="mt-2 text-sm text-[#7b867e]">It may have been removed or is still loading.</p>
          <Link to={isEvent ? "/events" : "/products"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#315c46] px-6 py-3 text-sm font-bold text-white hover:bg-[#244735]">
            <FiArrowLeft /> Back to {isEvent ? "events" : "products"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] pb-16 pt-6 sm:pt-9">
      <div className="mx-auto w-[92%] max-w-[1240px]">
        <Link to={isEvent ? "/events" : "/products"} className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#68776c] transition hover:text-[#315c46]">
          <FiArrowLeft /> Back to {isEvent ? "events" : "products"}
        </Link>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,.96fr)] lg:gap-10">
          <section className="min-w-0">
            <div className="relative overflow-hidden rounded-[28px] border border-[#e6ebe4] bg-white p-3 shadow-[0_12px_40px_rgba(32,41,35,.05)] sm:p-5">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] bg-[#f1f4ef]">
                {images[selectedImage]?.url ? (
                  <img src={images[selectedImage].url} alt={data.name || "Listing image"} className="h-full w-full object-contain p-3 sm:p-6" />
                ) : (
                  <div className="px-5 text-center text-sm text-[#89948b]">No image available for this listing</div>
                )}
                {discountPercent > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-[#315c46] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-white">
                    Save {discountPercent}%
                  </span>
                )}
                <button type="button" onClick={() => inWishlist ? dispatch(removeFromWishList(data)) : dispatch(addToWishList(data))} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e5eae3] bg-white/95 text-[#315c46] shadow-sm transition hover:scale-105">
                  {inWishlist ? <AiFillHeart size={21} className="text-rose-500" /> : <AiOutlineHeart size={21} />}
                </button>
              </div>
              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {images.map((image, index) => (
                    <button type="button" key={image.public_id || image.url || index} onClick={() => setSelectedImage(index)} aria-label={`View image ${index + 1}`} className={`aspect-square overflow-hidden rounded-xl border-2 bg-[#f1f4ef] transition ${selectedImage === index ? "border-[#315c46] ring-2 ring-[#315c46]/10" : "border-transparent hover:border-[#cbd8cb]"}`}>
                      <img src={image.url} alt={`${data.name || "Listing"} view ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 px-1 text-xs text-[#78847b]">
              <span className="inline-flex items-center gap-1.5"><FiCheckCircle className="text-[#66806e]" /> Seller listed</span>
              <span className="h-1 w-1 rounded-full bg-[#c4cdc3]" />
              <span className="inline-flex items-center gap-1.5"><FiTruck className="text-[#66806e]" /> Contact seller for delivery details</span>
            </div>
          </section>

          <section className="flex min-w-0 flex-col rounded-[28px] border border-[#e6ebe4] bg-white p-6 shadow-[0_12px_40px_rgba(32,41,35,.05)] sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#edf3ed] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.15em] text-[#315c46]">{isEvent ? "Limited-time offer" : "Marketplace listing"}</span>
              {data.category && <span className="rounded-full bg-[#f5f6f2] px-3 py-1.5 text-[10px] font-bold text-[#748075]">{data.category}</span>}
              {isEvent && data.status && <span className="rounded-full bg-[#f8f2e9] px-3 py-1.5 text-[10px] font-bold text-[#96734a]">{data.status}</span>}
            </div>

            <h1 className="mt-5 font-display text-3xl font-extrabold leading-[1.12] tracking-[-.045em] text-[#202923] sm:text-[38px]">{data.name}</h1>
            {!isEvent && data.ratings > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#7c887e]">
                <Ratings rating={data.ratings} />
                <span>{Number(data.ratings).toFixed(1)} rating</span>
                {reviewCount > 0 && <span>· {reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1 border-b border-[#edf0eb] pb-7">
              <span className="font-display text-4xl font-extrabold tracking-tight text-[#315c46]">{money(data.discountPrice)}</span>
              {hasDiscount && <span className="pb-1 text-base text-[#9ba49c] line-through">{money(data.originalPrice)}</span>}
              {discountPercent > 0 && <span className="mb-1 rounded-full bg-[#f7eee6] px-3 py-1 text-[10px] font-extrabold text-[#a36f43]">{discountPercent}% OFF</span>}
            </div>

            {isEvent && (
              <div className="mt-6 rounded-2xl bg-[#f5f8f3] p-4">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.15em] text-[#66806e]"><FiClock /> Offer ends in</div>
                <CountDown data={data} />
                {data.Finish_Date && <p className="mt-3 text-[11px] text-[#89938a]">Ends {new Date(data.Finish_Date).toLocaleDateString()}</p>}
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#3e4c42]">Availability</span>
                <span className={stock > 0 ? "font-semibold text-[#66806e]" : "font-semibold text-rose-600"}>{stock > 0 ? `${stock} available` : "Out of stock"}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]"><div className={`h-full rounded-full ${stock > 0 ? "bg-[#7b9a7e]" : "bg-rose-400"}`} style={{ width: stock > 0 ? `${Math.min(100, Math.max(8, stock))}%` : "0%" }} /></div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#89948b]">Quantity</p>
                <div className="inline-flex h-11 items-center rounded-full border border-[#e2e8e0] bg-[#fbfcfa] p-1">
                  <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-full text-[#536357] transition hover:bg-[#edf3ed] disabled:cursor-not-allowed disabled:opacity-35"><FiMinus /></button>
                  <span className="min-w-9 text-center text-sm font-extrabold text-[#26372d]">{quantity}</span>
                  <button type="button" disabled={quantity >= stock} onClick={() => setQuantity((value) => Math.min(stock, value + 1))} className="flex h-9 w-9 items-center justify-center rounded-full text-[#536357] transition hover:bg-[#edf3ed] disabled:cursor-not-allowed disabled:opacity-35"><FiPlus /></button>
                </div>
              </div>
              <p className="text-right text-[11px] leading-5 text-[#89938a]">Secure checkout<br />through Eshop</p>
            </div>

            <button type="button" disabled={stock < 1} onClick={addToCartHandler} className="mt-6 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#315c46] px-6 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(49,92,70,.16)] transition hover:-translate-y-0.5 hover:bg-[#244735] disabled:cursor-not-allowed disabled:bg-[#aab6aa]">
              <AiOutlineShoppingCart size={20} /> {stock > 0 ? "Add to cart" : "Currently unavailable"}
            </button>

            <div className="mt-7 border-t border-[#edf0eb] pt-6">
              <div className="flex items-center gap-3">
                <Link to={shop?._id ? `/shop/preview/${shop._id}` : "#"} className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#edf3ed] text-lg font-extrabold text-[#315c46]">
                  {shop?.avatar?.url ? <img src={shop.avatar.url} alt={shop.name || "Seller"} className="h-full w-full object-cover" /> : (shop?.name?.[0] || "S")}
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#89948b]">Sold by</p>
                  <Link to={shop?._id ? `/shop/preview/${shop._id}` : "#"} className="mt-0.5 block truncate text-sm font-extrabold text-[#29372e] hover:text-[#315c46]">{shop?.name || "Eshop seller"}</Link>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#7e897f]"><FiStar className="text-[#b18b55]" /> {averageShopRating} seller rating</p>
                </div>
                <button type="button" onClick={messageSeller} className="inline-flex items-center gap-2 rounded-full border border-[#dfe7de] px-4 py-2.5 text-xs font-bold text-[#315c46] transition hover:bg-[#f3f7f1]"><AiOutlineMessage /> Message</button>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-9 overflow-hidden rounded-[26px] border border-[#e6ebe4] bg-white shadow-[0_10px_32px_rgba(32,41,35,.04)]">
          <div className="flex gap-6 overflow-x-auto border-b border-[#edf0eb] px-5 sm:px-8">
            {tabs.map((tab) => (
              <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative shrink-0 py-5 text-xs font-extrabold transition sm:text-sm ${activeTab === tab.id ? "text-[#315c46]" : "text-[#8a948b] hover:text-[#536357]"}`}>
                {tab.label}
                {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#315c46]" />}
              </button>
            ))}
          </div>
          <div className="min-h-[170px] px-5 py-7 sm:px-8 sm:py-8">
            {activeTab === "details" && (
              <div className="max-w-4xl">
                <h2 className="font-display text-xl font-extrabold text-[#26372d]">{isEvent ? "About this offer" : "Product description"}</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#6f7c72]">{data.description || "No additional description has been provided."}</p>
                {isEvent && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {data.start_Date && <div className="flex items-center gap-3 rounded-xl bg-[#f6f8f4] p-4 text-xs text-[#536357]"><FiCalendar className="text-[#66806e]" /> Starts {new Date(data.start_Date).toLocaleDateString()}</div>}
                    {data.Finish_Date && <div className="flex items-center gap-3 rounded-xl bg-[#f6f8f4] p-4 text-xs text-[#536357]"><FiClock className="text-[#66806e]" /> Ends {new Date(data.Finish_Date).toLocaleDateString()}</div>}
                    {data.tags && <div className="flex items-center gap-3 rounded-xl bg-[#f6f8f4] p-4 text-xs text-[#536357] sm:col-span-2"><FiTag className="text-[#66806e]" /> {data.tags}</div>}
                  </div>
                )}
              </div>
            )}
            {activeTab === "reviews" && !isEvent && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-extrabold text-[#26372d]">Customer reviews</h2>
                {reviewCount ? data.reviews.map((review, index) => (
                  <article key={review._id || index} className="flex gap-3 border-b border-[#f0f2ee] pb-5 last:border-0">
                    <img src={review.user?.avatar?.url || ""} alt="" className="h-10 w-10 shrink-0 rounded-full bg-[#edf3ed] object-cover" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-[#29372e]">{review.user?.name || "Customer"}</p><Ratings rating={review.rating || 0} /></div>
                      <p className="mt-2 text-sm leading-6 text-[#718075]">{review.comment}</p>
                    </div>
                  </article>
                )) : <p className="rounded-xl bg-[#f6f8f4] p-5 text-sm text-[#7b867e]">No reviews yet. Be the first to share your experience.</p>}
              </div>
            )}
            {activeTab === "seller" && (
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex max-w-2xl items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#edf3ed] text-xl font-extrabold text-[#315c46]">{shop?.avatar?.url ? <img src={shop.avatar.url} alt={shop.name || "Seller"} className="h-full w-full object-cover" /> : (shop?.name?.[0] || "S")}</div>
                  <div><h2 className="font-display text-xl font-extrabold text-[#26372d]">{shop?.name || "Eshop seller"}</h2><p className="mt-1 text-xs text-[#7b867e]">Seller on Eshop Marketplace</p><p className="mt-3 text-sm leading-7 text-[#718075]">{shop?.description || "Visit this seller's shop to explore more listings."}</p></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-xl bg-[#f6f8f4] px-5 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#89948b]">Shop products</p><p className="mt-1 text-xl font-extrabold text-[#315c46]">{products.length}</p></div>
                  <div className="rounded-xl bg-[#f6f8f4] px-5 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#89948b]">Reviews</p><p className="mt-1 text-xl font-extrabold text-[#315c46]">{totalShopReviews}</p></div>
                  <Link to={shop?._id ? `/shop/preview/${shop._id}` : "/products"} className="inline-flex items-center gap-2 self-stretch rounded-xl bg-[#315c46] px-5 text-xs font-bold text-white transition hover:bg-[#244735]">Visit shop <FiArrowUpRight /></Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
