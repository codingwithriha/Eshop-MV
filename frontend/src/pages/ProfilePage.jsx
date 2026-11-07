import React,{useState} from "react";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import {useSelector} from "react-redux";
import {FiUser,FiShieldCheck} from "react-icons/fi";
const ProfilePage=()=>{
 const {loading,user}=useSelector(s=>s.user);const [active,setActive]=useState(1);
 return <div className="min-h-screen bg-[#f6f8f5]">{loading||!user?._id?<Loader/>:<><Header/><main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
  <div className="mb-7 overflow-hidden rounded-[26px] bg-[#315c46] p-6 text-white shadow-[0_14px_34px_rgba(49,92,70,.13)] sm:p-8"><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/60">Your account</p><h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back, {user.name?.split(" ")[0]||"there"}</h1><p className="mt-2 max-w-xl text-sm text-white/75">Manage your personal details, orders and saved delivery addresses in one place.</p></div><div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3"><img src={user.avatar?.url||"https://placehold.co/80x80/eaf1e9/315c46?text=You"} alt="Profile" className="h-12 w-12 rounded-full border-2 border-white/30 object-cover"/><div><p className="text-sm font-bold">{user.name}</p><p className="text-[11px] text-white/65">{user.email}</p></div><FiShieldCheck className="ml-2 text-[#d9bd91]" size={20}/></div></div></div>
  <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]"><aside className="min-w-0"><ProfileSideBar active={active} setActive={setActive}/></aside><section className="min-h-[520px] min-w-0 rounded-[22px] border border-[#e5ebe3] bg-white p-4 shadow-[0_5px_24px_rgba(35,52,40,.035)] sm:p-6 lg:p-8"><div className="mb-6 border-b border-[#edf0eb] pb-5"><p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#94a097]">Account centre</p><h2 className="mt-1 font-display text-xl font-extrabold text-[#26372d]">{({1:"Personal information",2:"Your orders",3:"Refund requests",4:"Inbox",5:"Track an order",6:"Security settings",7:"Saved addresses"})[active]||"Your account"}</h2><p className="mt-1 text-xs text-[#87938a]">Your information is kept together so you can manage it easily.</p></div><ProfileContent active={active}/></section></div>
 </main></>}</div>;
};
export default ProfilePage;