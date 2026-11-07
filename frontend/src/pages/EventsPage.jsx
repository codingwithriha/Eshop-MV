import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import Footer from "../components/Layout/Footer";

const EventsPage = () => {
  const { allEvents = [], isLoading } = useSelector((state) => state.events || {});
  const events = Array.isArray(allEvents) ? allEvents.filter((event) => event && event._id) : [];

  return (
    <>
      <Header activeHeading={4} />
      <main className="min-h-[65vh] bg-[#f7f8f5] py-10 sm:py-14">
        <div className="store-section">
          <div className="mb-8 max-w-2xl">
            <span className="store-eyebrow">Limited-time opportunities</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-.05em] text-[#202923] sm:text-4xl">Events & special offers</h1>
            <p className="mt-3 text-sm leading-7 text-[#758078]">Discover exclusive event pricing and offers from marketplace sellers.</p>
          </div>

          {isLoading ? (
            <div className="py-16"><Loader /></div>
          ) : events.length > 0 ? (
            <div className="grid gap-7">
              {events.map((event) => <EventCard key={event._id} data={event} />)}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#d8e1d7] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf2ec] text-2xl">✦</div>
              <h2 className="mt-5 font-display text-xl font-extrabold text-[#26352b]">No events available right now</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b867e]">New offers will appear here when sellers publish their next event. Check back soon.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventsPage;
