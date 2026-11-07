import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineTrackChanges, MdTrackChanges } from "react-icons/md";
import {
  deleteUserAddress,
  updateUserAddress,
  updateUserInfo,
} from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";
import { Country, State } from "country-state-city";
import { getUser } from "../../redux/actions/user";
import { getAllOrdersOfUser } from "../../redux/actions/order";
const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [dispatch, error, successMessage]);

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(getUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInfo({ name, email, password, phoneNumber }));
  };
  return (
    <div className="w-full">
      {/* profile Page */}
      {active === 1 && (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#f7f9f6] p-5 sm:flex-row sm:p-6">
            <div className="relative">
              <img src={user?.avatar?.url || "https://placehold.co/160x160/eaf1e9/315c46?text=You"} className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm" alt="Your profile"/>
              <label htmlFor="image" className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-[#315c46] text-white shadow-sm hover:bg-[#244735]"><AiOutlineCamera size={18}/><input type="file" id="image" accept="image/*" className="hidden" onChange={handleImage}/></label>
            </div>
            <div className="text-center sm:text-left"><p className="text-sm font-extrabold text-[#344238]">{user?.name}</p><p className="mt-1 text-xs text-[#87938a]">{user?.email}</p><p className="mt-2 text-[11px] text-[#9aa49c]">Choose the camera icon to update your profile photo.</p></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-2 block text-xs font-bold text-[#536157]">Full name</label><input type="text" className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm text-[#344238] outline-none transition focus:border-[#315c46] focus:ring-4 focus:ring-[#315c46]/10" required value={name||""} onChange={e=>setName(e.target.value)}/></div>
              <div><label className="mb-2 block text-xs font-bold text-[#536157]">Email address</label><input type="email" className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm text-[#344238] outline-none transition focus:border-[#315c46] focus:ring-4 focus:ring-[#315c46]/10" required value={email||""} onChange={e=>setEmail(e.target.value)}/></div>
              <div><label className="mb-2 block text-xs font-bold text-[#536157]">Phone number</label><input type="tel" className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm text-[#344238] outline-none transition focus:border-[#315c46] focus:ring-4 focus:ring-[#315c46]/10" value={phoneNumber||""} onChange={e=>setPhoneNumber(e.target.value)}/></div>
              <div><label className="mb-2 block text-xs font-bold text-[#536157]">Confirm with password</label><input type="password" className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm text-[#344238] outline-none transition focus:border-[#315c46] focus:ring-4 focus:ring-[#315c46]/10" placeholder="Enter password to save changes" value={password} onChange={e=>setPassword(e.target.value)}/></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0eb] pt-5"><p className="text-[11px] text-[#929d94]">Update your details and save when you're ready.</p><button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#315c46] px-7 text-sm font-extrabold text-white shadow-[0_7px_16px_rgba(49,92,70,.13)] transition hover:bg-[#244735]">Save changes</button></div>
          </form>
        </div>
      )}
      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {/* All Refund Orders */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {/* TrackAble  Orders */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}
      {/* TrackAble  Orders */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}
      {/*User Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user?._id) return;
    dispatch(getAllOrdersOfUser(user?._id));
  }, [dispatch, user?._id]);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
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
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};
const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user?._id) return;
    dispatch(getAllOrdersOfUser(user?._id));
  }, [dispatch, user?._id]);
  const eligibleOrders =
    orders && orders.filter((item) => item?.status === "Processing refund");
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
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

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};
const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user?._id) return;
    dispatch(getAllOrdersOfUser(user?._id));
  }, [dispatch, user?._id]);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
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
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};
const ChangePassword = () => {
 const [oldPassword,setOldPassword]=useState("");const [newPassword,setNewPassword]=useState("");const [confirmPassword,setConfirmPassword]=useState("");
 const handleChangePassword=async(e)=>{e.preventDefault();try{const res=await axios.put(`${server}/user/update-user-password`,{oldPassword,newPassword,confirmPassword},{withCredentials:true});toast.success(res.data.success||"Password updated successfully");setOldPassword("");setNewPassword("");setConfirmPassword("");}catch(error){toast.error(error.response?.data?.message||"Unable to update password");}};
 const fields=[["Current password",oldPassword,setOldPassword],["New password",newPassword,setNewPassword],["Confirm new password",confirmPassword,setConfirmPassword]];
 return <div className="mx-auto max-w-2xl"><div className="mb-6 rounded-2xl border border-[#e5ebe3] bg-[#f7f9f6] p-5"><div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0e8] text-[#315c46]"><RiLockPasswordLine size={21}/></div><h3 className="font-display text-lg font-extrabold text-[#2d3c32]">Keep your account secure</h3><p className="mt-1 text-sm leading-6 text-[#849087]">Choose a strong password you haven't used before. Your password is never displayed here.</p></div><form onSubmit={handleChangePassword} className="space-y-4">{fields.map(([label,value,setter])=><div key={label}><label className="mb-2 block text-xs font-bold text-[#536157]">{label}</label><input type="password" required minLength={6} autoComplete="new-password" value={value} onChange={e=>setter(e.target.value)} placeholder={label} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm text-[#344238] outline-none transition focus:border-[#315c46] focus:ring-4 focus:ring-[#315c46]/10"/></div>)}<div className="flex justify-end border-t border-[#edf0eb] pt-5"><button type="submit" className="h-11 rounded-xl bg-[#315c46] px-7 text-sm font-extrabold text-white transition hover:bg-[#244735]">Update password</button></div></form></div>;
};
const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];
  const handleDelete = (item) => {
    dispatch(deleteUserAddress(item._id));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress({
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        })
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };
  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} aria-required className="w-full">
                <div className="w-full block p-4">
                  {/* Selecting the Country */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Selecting the City */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        choose your city
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Address 01 */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  {/* Address 02 */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                  {/* ZipCode */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  {/* Address Type|default|,|Home|,|Office| */}
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Submit Button */}
                  <div className=" w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="w-full px-5">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-[25px] font-[600] text-[#000000] pb-2 ">
            My Address
          </h1>
          <div className={`${styles.button} !rounded-md`}>
            <span onClick={() => setOpen(true)} className="text-[#fff]">
              Add New
            </span>
          </div>
        </div>
        <br />
        <br />
        {user &&
          user.addresses.map((item, index) => (
            <div
              className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow-sm justify-between pr-10"
              key={index}
            >
              <div className="flex items-center">
                <h1 className="font-[600] pl-5">{item.addressType} </h1>
              </div>
              <div className="pl-8 flex items-center">
                <h6>
                  {item.address1}+{item.address2}
                </h6>
              </div>
              <div className="pl-8 flex items-center">
                <h6>{user && user.phoneNumber}</h6>
              </div>
              <div className="m-w-[10%] items-center justify-between pl-8">
                <AiOutlineDelete
                  size={25}
                  className="cursor-pointer"
                  onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          ))}
        {user && user?.addresses.length === 0 && (
          <h5 className="text-center pt-8 text-[18px]">
            You don't have any saved addresses!
          </h5>
        )}
      </div>
    </div>
  );
};
export default ProfileContent;
