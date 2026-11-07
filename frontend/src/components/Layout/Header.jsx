import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { useSelector } from "react-redux";
import { backend_url } from "../../server";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const { wishlist } = useSelector((state) => state.wishlist);
  const handleSearchChange = (e) => {
    e.preventDefault();
    const term = e.target.value;
    setSearchTerm(term);
    const filterProductData =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filterProductData);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleSuggestionClick = () => {
    setSearchTerm("");
    setSearchData([]);
  };

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[60px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt="home-logo"
                className="h-[45px] cursor-pointer hover:scale-105 transition-transform"
              />
            </Link>
          </div>
          {/* Search Box Working */}
          <div className="w-[45%] relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[45px] w-full px-4 pl-12 border border-[#e1e8df] rounded-full focus:outline-none focus:border-[#315c46] focus:ring-2 focus:ring-[#315c46]/10 transition-all"
              />
              <AiOutlineSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-white shadow-xl rounded-lg z-[9] p-4 mt-2 border border-gray-100">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link
                        to={`/product/${i._id}`}
                        key={index}
                        onClick={handleSuggestionClick}
                      >
                        <div className="w-full flex items-center py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                          <img
                            src={i.images[0].url}
                            className="w-[50px] h-[50px] rounded-lg object-cover mr-4"
                            alt={i.name}
                          />
                          <h1 className="text-gray-700 font-medium">{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
            {/* ending searchBox styling */}
          </div>
          {/* Styling for seller button */}
          <div className={`${styles.button} !bg-[#315c46] !rounded-full !h-[45px] !px-6 hover:shadow-lg hover:shadow-[#315c46]/20 transition-all`}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-white flex items-center font-semibold">
                {isSeller ? "DASHBOARD" : "CREATE SHOP"}
                <IoIosArrowForward className="ml-2" />
              </h1>
            </Link>
          </div>
          {/* ending styling for selling button */}
        </div>
      </div>
      {/* styling for fixed navbar  only for big screen*/}
      <div
        className={`${
          active === true ? "shadow-lg fixed top-0 left-0 z-50 bg-[#315c46]/95 backdrop-blur-md" : null
        } transition-all duration-300 hidden 800px:flex items-center justify-between w-full bg-[#315c46] h-[70px]`}
      >
        <div
          className={`${styles.section} ${styles.normalFlex} relative justify-between`}
        >
          {/* Categeories Dropdown */}
          <div
            onClick={() => {
              setDropDown(!dropDown);
            }}
          >
            <div className="relative h-[50px] w-[280px] hidden 1000px:block">
              <BiMenuAltLeft className="absolute top-3 left-2 text-white" size={30} />
              <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white/10 text-white text-lg font-sans font-[500] select-none rounded-lg hover:bg-white/20 transition-all">
                All Categories
              </button>
              {/* dropdown Arrow |Type| */}
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer text-white"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
              {/* Complete Categories DropDown  */}
            </div>
          </div>
          {/* Staring navItems styling */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          {/* Speacial Icons */}
          <div className={`${styles.normalFlex} gap-6`}>
            {/* Wishlist Clicking */}
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer group"
                onClick={() => setOpenWishlist(!openWishlist)}
              >
                <AiOutlineHeart size={28} color="rgb(255 255 255)" className="group-hover:scale-110 transition-transform" />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-red-500 w-5 h-5 flex items-center justify-center text-white font-bold text-xs">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </div>
            {/* Shoping Cart clicking */}
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer group"
                onClick={() => setOpenCart(!openCart)}
              >
                <AiOutlineShoppingCart size={28} color="rgb(255 255 255)" className="group-hover:scale-110 transition-transform" />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-red-500 w-5 h-5 flex items-center justify-center text-white font-bold text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
            {/* Profile Picture styling */}
            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer group">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      className="h-[40px] w-[40px] rounded-full border-2 border-white/50 hover:border-white transition-all"
                      src={`${user?.avatar?.url}`}
                      alt="profile"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <div className="h-[40px] w-[40px] rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                      <AiOutlineUser size={24} color="white" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
            {/* OpenCart  Fixed Positend PopUp*/}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
            {/* Wishlist  Fixed Positend PopUp*/}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>
      {/* Header for small screens */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt="home-logo"
                className="mt-3 cursor-pointer"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px] cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span className="absolute  right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4  p-0 m-0 text-white font-monospace text-center  font-[12px] leading-tight ">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* OpenCart  Fixed Positend PopUp*/}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
          {/* Wishlist  Fixed Positend PopUp*/}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>
        {/* sidebar menu */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px] cursor-pointer"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute   right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="my-8 w-[98%] m-auto h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i, index) => {
                      return (
                        <Link to={`/product/${i._id}`} key={index}>
                          <div className="flex items-center">
                            <img
                              src={`${i.images[0]?.url}`}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
                  <h1 className="text-white flex items-center">
                    {isSeller ? "DASHBOARD" : "CREATE SHOP"}
                    <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />
              <div className="flex w-full justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#0008]"
                    >
                      Login/
                    </Link>
                    <Link to="/signup" className="text-[18px] text-[#0008]">
                      SignUp
                    </Link>
                  </>
                ) : (
                  <>
                    <div>
                      <Link to={"/profile"}>
                        <img
                          src={`${user?.avatar?.url}`}
                          alt=""
                          className="w-[60px] h-[60px] rounded-full border-[3px] border-[#3ddad2]"
                        />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
