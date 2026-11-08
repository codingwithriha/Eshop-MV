import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreateEvent from "../../components/Shop/CreateEvent";

const ShopCreateEvents = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={6} />
    <main className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 px-4 py-7 800px:ml-[330px] sm:px-7">
      <CreateEvent />
    </main>
  </div>
);
export default ShopCreateEvents;
