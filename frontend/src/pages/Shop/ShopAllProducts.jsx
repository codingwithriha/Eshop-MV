import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllProducts from "../../components/Shop/AllProducts";

const ShopAllProducts = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={3} />
    <div className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 800px:ml-[330px]">
      <AllProducts />
    </div>
  </div>
);
export default ShopAllProducts;
