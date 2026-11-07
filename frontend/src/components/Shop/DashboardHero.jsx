import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect, AiOutlineShopping, AiOutlineProduct } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";

const DashBoardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null);

  useEffect(() => {
    if (!seller?._id) return;
    dispatch(getAllOrdersOfShop(seller?._id));
    dispatch(getAllProductsShop(seller?._id));
    const orderData =
      orders && orders.filter((item) => item.status === "Delivered");
    setDeliveredOrder(orderData);
  }, [dispatch, seller?._id, orders]);

  const availableBalance = seller?.availableBalance?.toFixed(2) ?? "0.00";

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
      field: " ",
      flex: 1,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "$" + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="w-full bg-[#f6f8f5] p-6">
      <h3 className="text-[28px] font-bold font-Poppins pb-6 text-[#26372d]">Seller Dashboard</h3>
      
      {/* Stats Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Account Balance Card */}
        <div className="bg-[#315c46] rounded-2xl border border-white/15 p-6 text-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Available Balance</p>
              <h3 className="text-3xl font-bold">${availableBalance}</h3>
              <p className="text-emerald-100 text-xs mt-2">After 10% service charge</p>
              <Link to="/dashboard-withdraw-money" className="text-emerald-100 text-xs mt-3 inline-block hover:text-white transition-colors font-medium">
                Withdraw Money →
              </Link>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <AiOutlineMoneyCollect size={32} />
            </div>
          </div>
        </div>

        {/* All Orders Card */}
        <div className="bg-[#496c58] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold">{orders && orders.length}</h3>
              <Link to="/dashboard-orders" className="text-blue-100 text-xs mt-3 inline-block hover:text-white transition-colors font-medium">
                View Orders →
              </Link>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <AiOutlineShopping size={32} />
            </div>
          </div>
        </div>

        {/* All Products Card */}
        <div className="bg-[#a47c50] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Total Products</p>
              <h3 className="text-3xl font-bold">{products && products.length}</h3>
              <Link to="/dashboard-products" className="text-orange-100 text-xs mt-3 inline-block hover:text-white transition-colors font-medium">
                View Products →
              </Link>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <AiOutlineProduct size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
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
  );
};

export default DashBoardHero;
