import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect, AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning = adminOrders && adminOrders.reduce((acc, item) => acc + item.totalPrice * .10, 0);
  const adminBalance = adminEarning?.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
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
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: "$" + item?.totalPrice,
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-[#f6f8f5] p-6">
          <h3 className="text-[28px] font-bold font-Poppins pb-6 text-[#26372d]">Dashboard Overview</h3>
          
          {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Earnings Card */}
            <div className="bg-[#315c46] rounded-2xl border border-white/15 p-6 text-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Earnings</p>
                  <h3 className="text-3xl font-bold">${adminBalance}</h3>
                  <p className="text-blue-100 text-xs mt-2">10% commission from all orders</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <AiOutlineMoneyCollect size={32} />
                </div>
              </div>
            </div>

            {/* All Sellers Card */}
            <div className="bg-[#496c58] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Total Sellers</p>
                  <h3 className="text-3xl font-bold">{sellers && sellers.length}</h3>
                  <Link to="/admin-sellers" className="text-purple-100 text-xs mt-2 inline-block hover:text-white transition-colors">
                    View all sellers →
                  </Link>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <AiOutlineUser size={32} />
                </div>
              </div>
            </div>

            {/* All Orders Card */}
            <div className="bg-[#a47c50] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium mb-1">Total Orders</p>
                  <h3 className="text-3xl font-bold">{adminOrders && adminOrders.length}</h3>
                  <Link to="/admin-orders" className="text-pink-100 text-xs mt-2 inline-block hover:text-white transition-colors">
                    View all orders →
                  </Link>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <AiOutlineShopping size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Latest Orders Table */}
          <div className="bg-white rounded-2xl border border-[#e7ebe5] shadow-sm p-6">
            <h3 className="text-[22px] font-bold font-Poppins pb-4 text-gray-800">Latest Orders</h3>
            <div className="w-full min-h-[45vh]">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
                autoHeight
                sx={{
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f3f4f6',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 600,
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
