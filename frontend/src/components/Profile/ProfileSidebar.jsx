import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { server } from "../../server";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TbAddressBook } from "react-icons/tb";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";

const ProfileSideBar = ({ active, setActive }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch({ type: "LogoutSuccess" });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };
  return (
    <div className="w-ful bg-white border border-[#e7ebe5] shadow-sm rounded-2xl p-4 pt-8">
      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(1);
        }}
      >
        <RxPerson size={20} color={active === 1 ? "#315c46" : ""} />
        <span
          className={`pl-3 ${
            active == 1 ? "text-[#315c46]" : ""
          } 800px:block  hidden`}
        >
          Profile
        </span>
      </div>
      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(2);
        }}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 2 ? "text-[red]" : ""
          }  800px:block  hidden`}
        >
          Orders
        </span>
      </div>
      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(3);
        }}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 3 ? "text-[red]" : ""
          }  800px:block hidden `}
        >
          ReFunds
        </span>
      </div>
      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(4) || navigate("/inbox");
        }}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 4 ? "text-[red]" : ""
          }  800px:block  hidden`}
        >
          Inbox
        </span>
      </div>

      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(5);
        }}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 5 ? "text-[red]" : ""
          } 800px:block  hidden `}
        >
          Track Order
        </span>
      </div>
      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(6);
        }}
      >
        <RiLockPasswordFill size={20} color={active === 6 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 6 ? "text-[red]" : ""
          }  800px:block  hidden`}
        >
          Change Password
        </span>
      </div>
      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(7);
        }}
      >
        <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 7 ? "text-[red]" : ""
          } 800px:block  hidden `}
        >
          Address
        </span>
      </div>
      {user && user.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className="w-full flex cursor-pointer items-center mb-8 "
            onClick={() => {
              setActive(7);
            }}
          >
            <MdOutlineAdminPanelSettings
              size={20}
              color={active === 8 ? "red" : ""}
            />
            <span
              className={`pl-3 ${
                active == 8 ? "text-[red]" : ""
              } 800px:block  hidden `}
            >
              Admin DashBoard
            </span>
          </div>
        </Link>
      )}

      <div
        className="w-full flex cursor-pointer items-center mb-8 "
        onClick={() => {
          setActive(8) || logOutHandler();
        }}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active == 8 ? "text-[red]" : ""
          } 800px:block  hidden`}
        >
          LogOut
        </span>
      </div>
    </div>
  );
};

export default ProfileSideBar;
