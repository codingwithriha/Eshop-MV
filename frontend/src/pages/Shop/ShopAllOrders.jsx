import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllOrders from "../../components/Shop/AllOrders";

const ShopAllOrders = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <div className="flex w-full">
      <div className="w-[80px] shrink-0 800px:w-[330px]"><DashboardSideBar active={2}/></div>
      <div className="min-w-0 flex-1"><AllOrders /></div>
    </div>
  </div>
);
export default ShopAllOrders;
