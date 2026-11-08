import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={8} />
    <main className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 p-3 sm:p-5 800px:ml-[330px]">
      <DashboardMessages />
    </main>
  </div>
);
export default ShopInboxPage;
