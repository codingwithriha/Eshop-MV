import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";

const ShopAllRefunds = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={10} />
    <div className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 800px:ml-[330px]">
      <AllRefundOrders />
    </div>
  </div>
);
export default ShopAllRefunds;
