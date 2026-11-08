import React from "react";
import {AiOutlineLogin,AiOutlineMessage} from "react-icons/ai";
import {RiLockPasswordLine} from "react-icons/ri";
import {MdOutlineAdminPanelSettings,MdOutlineTrackChanges} from "react-icons/md";
import {TbAddressBook} from "react-icons/tb";
import {HiOutlineReceiptRefund,HiOutlineShoppingBag} from "react-icons/hi";
import {RxPerson} from "react-icons/rx";
import {Link,useNavigate} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";
import {server} from "../../server";
const ProfileSideBar=({active,setActive})=>{
 const {user}=useSelector(s=>s.user),navigate=useNavigate(),dispatch=useDispatch();
 const logout=async()=>{try{const res=await axios.get(`${server}/user/logout`,{withCredentials:true});toast.success(res.data.message);dispatch({type:"LogoutSuccess"});navigate("/login");}catch(e){toast.error(e.response?.data?.message||"Logout failed");}};
 const items=[{id:1,label:"Profile",icon:RxPerson},{id:2,label:"Orders",icon:HiOutlineShoppingBag},{id:3,label:"Refunds",icon:HiOutlineReceiptRefund},{id:4,label:"Inbox",icon:AiOutlineMessage,action:()=>navigate("/inbox")},{id:5,label:"Track order",icon:MdOutlineTrackChanges},{id:6,label:"Change password",icon:RiLockPasswordLine},{id:7,label:"Address book",icon:TbAddressBook}];
 return <aside className="rounded-[22px] border border-[#e5ebe3] bg-white p-3 shadow-[0_5px_24px_rgba(35,52,40,.035)] sm:p-4"><p className="px-3 pb-3 pt-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#9aa69d]">Account menu</p><nav className="space-y-1">{items.map(({id,label,icon:Icon,action})=><button key={id} type="button" onClick={()=>{setActive(id);action?.();}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all ${active===id?"bg-[#315c46] text-white shadow-[0_7px_16px_rgba(49,92,70,.14)]":"text-[#657369] hover:bg-[#f1f5f0] hover:text-[#315c46]"}`}><Icon size={19}/><span className="hidden 800px:block">{label}</span></button>)}{user?.role==="Admin"&&<Link to="/admin/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#657369] transition hover:bg-[#f1f5f0] hover:text-[#315c46]"><MdOutlineAdminPanelSettings size={19}/><span className="hidden 800px:block">Admin dashboard</span></Link>}<button type="button" onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-xl border-t border-[#edf0eb] px-3 py-4 text-left text-sm font-semibold text-[#9a6b60] transition hover:bg-[#fbf4f1] hover:text-[#a34f42]"><AiOutlineLogin size={19}/><span className="hidden 800px:block">Log out</span></button></nav></aside>;
};
export default ProfileSideBar;