import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { getSeller } from "../../redux/actions/seller";
import { FiCreditCard, FiDollarSign, FiPlus, FiTrash2, FiX, FiShield, FiArrowUpRight } from "react-icons/fi";

const field = "mt-1.5 w-full rounded-xl border border-[#e2e9e1] bg-white px-3.5 py-3 text-sm text-[#344238] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#789581] focus:ring-4 focus:ring-[#edf3ed]";
const emptyBank = { bankName: "", bankCountry: "", bankSwiftCode: "", bankAccountNumber: "", bankHolderName: "", bankAddress: "" };

const WithdrawMoney = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [modal, setModal] = useState("");
  const [amount, setAmount] = useState("50");
  const [bankInfo, setBankInfo] = useState(emptyBank);
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const balance = Number(seller?.availableBalance || 0);
  const bank = seller?.withdrawMethod;

  const saveBank = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      await axios.put(server + "/shop/update-payment-methods", { withdrawMethod: bankInfo }, { withCredentials: true });
      await dispatch(getSeller()); setModal(""); setBankInfo(emptyBank); toast.success("Payout method saved.");
    } catch (error) { toast.error(error.response?.data?.message || "Unable to save bank details."); }
    finally { setSaving(false); }
  };
  const removeBank = async () => {
    if (!window.confirm("Remove your saved payout method?")) return;
    try { await axios.delete(server + "/shop/delete-withdraw-methods", { withCredentials: true }); await dispatch(getSeller()); toast.success("Payout method removed."); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to remove payout method."); }
  };
  const requestPayout = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 50 || value > balance) return toast.error("Enter an amount of at least $50 and no more than your available balance.");
    if (!bank) return toast.error("Add a payout method first.");
    setRequesting(true);
    try { await axios.post(server + "/withdraw/create-withdraw-request", { amount: value }, { withCredentials: true }); await dispatch(getSeller()); setModal(""); toast.success("Withdrawal request submitted."); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to submit withdrawal request."); }
    finally { setRequesting(false); }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#f6f8f5] px-4 py-7 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8a988d]">Finance · Payouts</p><h1 className="mt-2 font-display text-2xl font-extrabold text-[#26372d] sm:text-3xl">Withdrawals</h1><p className="mt-2 text-sm text-[#78857b]">Manage your payout details and request a transfer of your available earnings.</p></div>
        <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#294c39,#52765d_65%,#789078)] p-6 text-white shadow-[0_12px_32px_rgba(41,76,57,.16)] sm:p-8">
          <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full border border-white/10"/><div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold text-white/75"><FiDollarSign/> Available balance</div><p className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{"$" + balance.toFixed(2)}</p><p className="mt-3 text-xs text-white/70">Your current withdrawable shop balance.</p></div><button onClick={() => balance < 50 ? toast.error("You need at least $50 available.") : setModal("withdraw")} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#315c46] hover:bg-[#edf3ed]">Request withdrawal <FiArrowUpRight/></button></div>
        </section>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[#edf0ec] pb-5"><div><h2 className="text-base font-bold text-[#29372e]">Payout method</h2><p className="mt-1 text-xs text-[#879188]">Bank account where your withdrawals are sent.</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#315c46]"><FiCreditCard size={19}/></span></div>
            {bank ? <div className="mt-5 rounded-xl border border-[#e6ebe4] bg-[#f8faf7] p-4"><div className="flex justify-between gap-3"><div><p className="text-sm font-extrabold text-[#344238]">{bank.bankName || "Bank account"}</p><p className="mt-1 text-xs text-[#879188]">{bank.bankCountry || ""}</p></div><span className="h-fit rounded-full bg-[#edf4ed] px-2.5 py-1 text-[10px] font-bold text-[#315c46]">Saved</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div><p className="text-[10px] font-bold uppercase text-[#9aa49c]">Account holder</p><p className="mt-1 text-sm font-semibold text-[#536157]">{bank.bankHolderName || "—"}</p></div><div><p className="text-[10px] font-bold uppercase text-[#9aa49c]">Account number</p><p className="mt-1 text-sm font-semibold text-[#536157]">{"•••• •••• " + String(bank.bankAccountNumber || "").slice(-4)}</p></div><div><p className="text-[10px] font-bold uppercase text-[#9aa49c]">SWIFT code</p><p className="mt-1 text-sm font-semibold text-[#536157]">{bank.bankSwiftCode || "—"}</p></div><div><p className="text-[10px] font-bold uppercase text-[#9aa49c]">Bank address</p><p className="mt-1 text-sm font-semibold text-[#536157]">{bank.bankAddress || "—"}</p></div></div><div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-[#e8ede6] pt-4"><button onClick={() => { setBankInfo({ ...emptyBank, ...bank, bankAccountNumber: "" }); setModal("bank"); }} className="rounded-xl border border-[#dfe8de] px-4 py-2.5 text-xs font-bold text-[#315c46] hover:bg-[#edf3ed]">Update details</button><button onClick={removeBank} className="inline-flex items-center gap-2 rounded-xl border border-[#f0dfda] px-4 py-2.5 text-xs font-bold text-[#a45e52] hover:bg-[#fff5f2]"><FiTrash2/> Remove</button></div></div> : <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-[#dce6da] bg-[#f8faf7] px-5 py-10 text-center"><FiCreditCard size={25} className="text-[#52765d]"/><h3 className="mt-3 text-sm font-bold text-[#344238]">No payout method added</h3><p className="mt-1 text-xs text-[#879188]">Add your bank details to request a withdrawal.</p><button onClick={() => setModal("bank")} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#315c46] px-4 py-2.5 text-xs font-bold text-white"><FiPlus/> Add bank account</button></div>}
          </section>
          <aside className="h-fit rounded-2xl border border-[#e6ebe4] bg-white p-5 shadow-[0_5px_24px_rgba(35,52,40,.04)]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#a17a4f]"><FiShield size={19}/></span><h3 className="mt-4 text-sm font-bold text-[#344238]">Payout information</h3><ul className="mt-3 space-y-3 text-xs leading-5 text-[#78857b]"><li>• Minimum withdrawal request: $50.</li><li>• Requests cannot exceed your available balance.</li><li>• Check your bank details before submitting.</li></ul></aside>
        </div>
      </div>
      {modal && <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#17231b]/50 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(""); }}><section className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex justify-between border-b border-[#edf0ec] px-6 py-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a988d]">Payout settings</p><h2 className="mt-1 text-xl font-extrabold text-[#26372d]">{modal === "bank" ? "Bank account details" : "Request a withdrawal"}</h2></div><button onClick={() => setModal("")} className="rounded-lg p-2 text-[#78857b] hover:bg-[#f1f4f0]"><FiX/></button></div>
        {modal === "bank" ? <form onSubmit={saveBank} className="space-y-4 px-6 py-5"><div className="grid gap-4 sm:grid-cols-2">{[["bankName","Bank name"],["bankCountry","Bank country"],["bankHolderName","Account holder name"],["bankSwiftCode","SWIFT code"],["bankAccountNumber","Account number"],["bankAddress","Bank address"]].map(([key,label]) => <label key={key} className="block text-xs font-bold text-[#536157]">{label}<input required value={bankInfo[key] || ""} onChange={(e) => setBankInfo((current) => ({ ...current, [key]: e.target.value }))} className={field} placeholder={"Enter " + label.toLowerCase()}/></label>)}</div><div className="flex justify-end border-t border-[#edf0ec] pt-4"><button disabled={saving} className="rounded-xl bg-[#315c46] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving..." : "Save payout method"}</button></div></form> : <div className="px-6 py-5"><p className="text-sm text-[#78857b]">Available balance: <strong className="text-[#344238]">{"$" + balance.toFixed(2)}</strong></p><label className="mt-5 block text-xs font-bold text-[#536157]">Withdrawal amount<input type="number" min="50" max={balance} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={field}/></label><p className="mt-2 text-[10px] text-[#9aa49c]">Minimum request is $50. Your saved payout method will be used.</p><button disabled={requesting || !bank} onClick={requestPayout} className="mt-5 w-full rounded-xl bg-[#315c46] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{requesting ? "Submitting..." : bank ? "Submit withdrawal request" : "Add a payout method first"}</button></div>}
      </section></div>}
    </main>
  );
};
export default WithdrawMoney;
