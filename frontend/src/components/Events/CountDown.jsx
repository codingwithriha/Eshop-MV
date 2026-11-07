import React, { useEffect, useState } from "react";

const getTimeLeft = (finishDate) => {
  const difference = new Date(finishDate).getTime() - Date.now();
  if (!finishDate || Number.isNaN(difference) || difference <= 0) return null;
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(data?.Finish_Date));

  useEffect(() => {
    setTimeLeft(getTimeLeft(data?.Finish_Date));
    const timer = setInterval(() => setTimeLeft(getTimeLeft(data?.Finish_Date)), 1000);
    return () => clearInterval(timer);
  }, [data?.Finish_Date]);

  if (!timeLeft) return <span className="text-sm font-semibold text-[#a47c50]">Offer ended</span>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(timeLeft).map(([unit,value]) => (
        <span key={unit} className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
          <strong className="block font-display text-lg leading-none text-[#315c46]">{String(value).padStart(2,"0")}</strong>
          <small className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-[#879188]">{unit}</small>
        </span>
      ))}
    </div>
  );
};

export default CountDown;
