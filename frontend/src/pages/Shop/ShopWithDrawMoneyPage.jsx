import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";

const ShopWithDrawMoneyPage = () => (
  <div className="min-h-screen bg-[#f6f8f5]">
    <DashboardHeader />
    <DashboardSideBar active={7} />
    <main className="ml-[80px] min-h-[calc(100vh-76px)] min-w-0 800px:ml-[330px]">
      <WithdrawMoney />
    </main>
  </div>
);
export default ShopWithDrawMoneyPage;
