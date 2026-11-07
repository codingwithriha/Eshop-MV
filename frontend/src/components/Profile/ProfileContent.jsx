import React, { useEffect, useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbAddressBook } from "react-icons/tb";
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
 const [open,setOpen]=useState(false),[country,setCountry]=useState(""),[city,setCity]=useState(""),[zipCode,setZipCode]=useState(""),[address1,setAddress1]=useState(""),[address2,setAddress2]=useState(""),[addressType,setAddressType]=useState("");
 const {user}=useSelector(s=>s.user),dispatch=useDispatch();const types=["Default","Home","Office"];
 const reset=()=>{setCountry("");setCity("");setZipCode("");setAddress1("");setAddress2("");setAddressType("");};
 const handleSubmit=e=>{e.preventDefault();if(!country||!city||!addressType){toast.error("Please fill all required fields");return;}dispatch(updateUserAddress({country,city,address1,address2,zipCode,addressType}));setOpen(false);reset();};
 return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-lg font-extrabold text-[#2d3c32]">Saved addresses</h3><p className="mt-1 text-sm text-[#87938a]">Manage where your orders should be delivered.</p></div><button type="button" onClick={()=>setOpen(true)} className="rounded-xl bg-[#315c46] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#244735]">+ Add new address</button></div>
 {user?.addresses?.length?<div className="grid grid-cols-1 gap-3 md:grid-cols-2">{user.addresses.map(item=><article key={item._id} className="rounded-2xl border border-[#e5ebe3] bg-white p-5"><div className="flex justify-between gap-3"><div><span className="rounded-full bg-[#edf3ed] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#315c46]">{item.addressType}</span><p className="mt-3 text-sm font-bold text-[#344238]">{item.address1}</p>{item.address2&&<p className="mt-1 text-sm text-[#78857b]">{item.address2}</p>}<p className="mt-2 text-xs text-[#87938a]">{item.city}, {item.country} {item.zipCode}</p><p className="mt-1 text-xs text-[#87938a]">{user.phoneNumber}</p></div><button type="button" onClick={()=>dispatch(deleteUserAddress(item._id))} aria-label="Delete address" className="rounded-lg p-2 text-[#9a6b60] hover:bg-[#fbf1ee]"><AiOutlineDelete size={19}/></button></div></article>)}</div>:<div className="rounded-2xl border border-dashed border-[#dce5da] bg-[#fafbf9] px-5 py-12 text-center"><TbAddressBook size={28} className="mx-auto text-[#315c46]"/><h4 className="mt-3 font-display font-extrabold text-[#344238]">No saved addresses yet</h4><p className="mt-1 text-sm text-[#87938a]">Add an address to make checkout quicker.</p></div>}
 {open&&<div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#17231b]/45 p-4 backdrop-blur-[2px]" onClick={()=>setOpen(false)}><div onClick={e=>e.stopPropagation()} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl sm:p-7"><div className="mb-6 flex justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#91a096]">Delivery details</p><h3 className="mt-1 font-display text-xl font-extrabold text-[#2d3c32]">Add a new address</h3></div><button type="button" onClick={()=>setOpen(false)} className="rounded-full border border-[#e7ece5] p-2"><RxCross1/></button></div><form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
 <div><label className="mb-2 block text-xs font-bold text-[#536157]">Country *</label><select required value={country} onChange={e=>{setCountry(e.target.value);setCity("");}} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-3 text-sm"><option value="">Choose country</option>{Country.getAllCountries().map(x=><option key={x.isoCode} value={x.isoCode}>{x.name}</option>)}</select></div>
 <div><label className="mb-2 block text-xs font-bold text-[#536157]">State / city *</label><select required value={city} onChange={e=>setCity(e.target.value)} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-3 text-sm"><option value="">Choose state / city</option>{State.getStatesOfCountry(country).map(x=><option key={x.isoCode} value={x.isoCode}>{x.name}</option>)}</select></div>
 <div className="sm:col-span-2"><label className="mb-2 block text-xs font-bold text-[#536157]">Address line 1 *</label><input required value={address1} onChange={e=>setAddress1(e.target.value)} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm"/></div>
 <div className="sm:col-span-2"><label className="mb-2 block text-xs font-bold text-[#536157]">Address line 2</label><input value={address2} onChange={e=>setAddress2(e.target.value)} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm"/></div>
 <div><label className="mb-2 block text-xs font-bold text-[#536157]">Postal code *</label><input required value={zipCode} onChange={e=>setZipCode(e.target.value)} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-4 text-sm"/></div>
 <div><label className="mb-2 block text-xs font-bold text-[#536157]">Address type *</label><select required value={addressType} onChange={e=>setAddressType(e.target.value)} className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#fbfcfa] px-3 text-sm"><option value="">Choose type</option>{types.map(x=><option key={x}>{x}</option>)}</select></div>
 <div className="flex justify-end gap-3 border-t border-[#edf0eb] pt-4 sm:col-span-2"><button type="button" onClick={()=>{setOpen(false);reset();}} className="rounded-xl border border-[#e3e9e1] px-5 py-3 text-sm font-bold text-[#657369]">Cancel</button><button type="submit" className="rounded-xl bg-[#315c46] px-6 py-3 text-sm font-extrabold text-white">Save address</button></div></form></div></div>}
 </div>;
};

export default ProfileContent;
