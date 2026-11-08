import React from "react";
import { useSelector } from "react-redux";
import {
  FiUser,
  FiShield,
  FiLock,
  FiGlobe,
  FiDatabase,
  FiCheckCircle,
} from "react-icons/fi";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSideBar";

const InfoCard = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-6">
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2ec] text-[#315c46]">
        <Icon size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-bold text-[#29372e]">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-[#7b887e]">{description}</p>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  </section>
);

const Detail = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-b border-[#eef1ed] py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium text-[#839087]">{label}</span>
    <span className="break-all text-sm font-semibold text-[#344238]">{value || "Not available"}</span>
  </div>
);

const AdminSettingsPage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <AdminHeader />
      <div className="flex w-full">
        <div className="w-[76px] shrink-0 800px:w-[330px]">
          <AdminSidebar active={8} />
        </div>

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">System</p>
                <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#26372d] sm:text-3xl">Settings</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#78857b]">Review your administrator account and the current marketplace environment.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dce8dc] bg-[#edf5ed] px-3 py-2 text-xs font-bold text-[#315c46]">
                <FiCheckCircle size={14} /> Admin access active
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
              <InfoCard icon={FiUser} title="Administrator profile" description="Account details for the administrator currently signed in.">
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f7f9f6] p-4">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="Administrator" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#315c46] text-lg font-bold text-white">
                      {(user?.name || "A").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#29372e]">{user?.name || "Administrator"}</p>
                    <p className="truncate text-xs text-[#839087]">{user?.email || "No email available"}</p>
                  </div>
                </div>
                <Detail label="Full name" value={user?.name} />
                <Detail label="Email address" value={user?.email} />
                <Detail label="Account role" value={user?.role || "Admin"} />
                <Detail label="Account ID" value={user?._id} />
              </InfoCard>

              <div className="space-y-5">
                <InfoCard icon={FiShield} title="Access & permissions" description="Your current account is recognised as a platform administrator.">
                  <div className="flex items-center justify-between rounded-xl border border-[#e6eee5] bg-[#f7faf6] p-3">
                    <div>
                      <p className="text-xs font-bold text-[#344238]">Administrator role</p>
                      <p className="mt-1 text-[11px] text-[#839087]">Protected admin area</p>
                    </div>
                    <span className="rounded-full bg-[#e4efe4] px-2.5 py-1 text-[10px] font-bold text-[#315c46]">Verified</span>
                  </div>
                </InfoCard>

                <InfoCard icon={FiLock} title="Account security" description="Keep your administrator account protected.">
                  <ul className="space-y-3 text-xs leading-5 text-[#69776d]">
                    <li className="flex gap-2"><FiCheckCircle className="mt-0.5 shrink-0 text-[#568265]" /> Use a unique, strong password.</li>
                    <li className="flex gap-2"><FiCheckCircle className="mt-0.5 shrink-0 text-[#568265]" /> Never share your administrator credentials.</li>
                    <li className="flex gap-2"><FiCheckCircle className="mt-0.5 shrink-0 text-[#568265]" /> Sign out when using a shared device.</li>
                  </ul>
                </InfoCard>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <InfoCard icon={FiGlobe} title="Marketplace" description="Core storefront and marketplace features are managed through their respective admin sections.">
                <p className="text-xs leading-5 text-[#69776d]">Manage customers, sellers, products, events, orders and withdrawal requests from the sidebar.</p>
              </InfoCard>
              <InfoCard icon={FiDatabase} title="System configuration" description="Environment and server configuration are managed outside this dashboard.">
                <p className="text-xs leading-5 text-[#69776d]">To avoid accidental changes, database credentials, payment keys and server settings are not editable from this page.</p>
              </InfoCard>
            </div>

            <p className="mt-6 text-center text-[11px] text-[#9aa49c]">Eshop-MV Administration · Settings</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
