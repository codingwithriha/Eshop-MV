import React, { useEffect } from "react";
import styles from "../../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfAdmin } from "../../../redux/actions/order";
import Loader from "../../../components/Layout/Loader";
import { getAllSellers } from "../../../redux/actions/seller";
const AdminDashBoardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders, isLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart.reduce((acc, item) => acc + item?.qty, 0),
        total: `$${item.totalPrice}`,
        status: item.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });
  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);
  const adminBalance = adminEarning?.toFixed(2);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <main className="min-w-0 flex-1 bg-[#f6f8f5] p-5 sm:p-7">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#66806e]">Platform overview</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-.04em] text-[#202923]">Good to see you, Admin.</h1><p className="mt-2 text-sm text-[#7b867e]">Here is what is happening across your marketplace.</p></div><span className="rounded-full border border-[#e1e8df] bg-white px-4 py-2 text-xs font-semibold text-[#718076]">Live overview</span></div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            <div className="min-h-[150px] rounded-2xl border border-[#e7ebe5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Total Earning
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                ${adminBalance}
              </h5>
            </div>
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Seller
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {sellers && sellers?.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-[2] text-[#315c46]">View Sellers</h5>
              </Link>
            </div>
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Orders
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {adminOrders && adminOrders?.length}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-[2] text-[#315c46]">View Orders</h5>
              </Link>
            </div>
          </div>
          <br />

          <section className="mt-5 w-full rounded-2xl border border-[#e7ebe5] bg-white p-3 shadow-sm"><div className="px-3 pb-3 pt-2"><h2 className="font-display text-lg font-extrabold text-[#26372d]">Recent orders</h2><p className="mt-1 text-xs text-[#879188]">Latest marketplace transactions</p></div>
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashBoardMain;
