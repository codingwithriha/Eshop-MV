import React, { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import { backend_url } from "../../server";
import Ratings from "../Products/Ratings";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);
  const allReviews =
    products && products.map((product) => product.reviews).flat();

  const [active, setActive] = useState(1);
  return (
    <div className="w-full">
      {/* Toggle Part  */}
      <div className="flex w-full items-center justify-between pr-[20px]">
        <div className="w-full flex">
          <div onClick={() => setActive(1)} className="flex items-center">
            <h5
              className={`${
                active == 1 ? "text-red-500" : "text-[#333]"
              } font-[600] text-[20px] cursor-pointer mr-4`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`${
                active == 2 ? "text-red-500" : "text-[#333]"
              } font-[600] text-[20px] cursor-pointer mr-4`}
            >
              Running Events
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`${
                active == 3 ? "text-red-500" : "text-[#333]"
              } font-[600] text-[20px] cursor-pointer mr-4`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          <Link to="/dashboard">
            <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
              <span className="text-[#fff] capitalize">Go to Dashboard</span>
            </div>
          </Link>
        </div>
      </div>
      <br />
      {/* Toggle Content Part  */}

      {active == 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div className="w-full flex my-4">
                <img
                  src={`${item.user.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-2">{item?.user?.name}</h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {item.createdAt}
                  </p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};
export default ShopProfileData;
