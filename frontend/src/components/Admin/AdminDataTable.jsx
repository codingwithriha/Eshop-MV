import React, { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FiSearch } from "react-icons/fi";

const AdminDataTable = ({ rows = [], columns = [], searchFields = [], emptyTitle = "Nothing here yet", emptyText = "Records will appear here when available." }) => {
 const [query,setQuery]=useState("");
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return rows;return rows.filter(row=>searchFields.some(key=>String(row[key]??"").toLowerCase().includes(q)));},[rows,query,searchFields]);
 return <div className="w-full">
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0ec] px-4 py-4 sm:px-5">
   <div><h2 className="text-sm font-extrabold text-[#344238]">Records</h2><p className="mt-1 text-[11px] text-[#929d94]">{filtered.length} {filtered.length===1?"record":"records"} found</p></div>
   <label className="flex w-full items-center gap-2 rounded-xl border border-[#e5ebe3] bg-[#f8faf7] px-3 py-2.5 sm:w-72"><FiSearch className="shrink-0 text-[#89968c]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..." className="w-full bg-transparent text-xs text-[#344238] outline-none placeholder:text-[#a0aaa3]"/></label>
  </div>
  <div className="w-full px-2 py-2 sm:px-4">
   {filtered.length ? <DataGrid autoHeight rows={filtered} columns={columns} pageSize={10} rowsPerPageOptions={[10,25,50]} disableSelectionOnClick getRowHeight={()=>64} sx={{border:0,color:"#45564a","& .MuiDataGrid-columnHeaders":{backgroundColor:"#f7f9f6",borderBottom:"1px solid #e8ede6",color:"#6e7c71",fontSize:11,fontWeight:800},"& .MuiDataGrid-cell":{borderBottom:"1px solid #f0f2ef",fontSize:12,outline:"none"},"& .MuiDataGrid-row:hover":{backgroundColor:"#f8faf7"},"& .MuiDataGrid-footerContainer":{borderTop:"1px solid #edf0ec"},"& .MuiDataGrid-columnSeparator":{color:"#e5ebe3"}}}/> : <div className="px-5 py-14 text-center"><p className="text-sm font-bold text-[#344238]">{query?"No matching records":emptyTitle}</p><p className="mt-1 text-xs text-[#929d94]">{query?"Try another search term":emptyText}</p></div>}
  </div>
 </div>;
};
export default AdminDataTable;
