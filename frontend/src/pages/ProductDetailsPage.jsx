import React, { useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEvent = searchParams.has("isEvent");
  const { allProducts = [] } = useSelector((state) => state.products || {});
  const { allEvents = [] } = useSelector((state) => state.events || {});

  const data = useMemo(() => {
    const collection = isEvent ? allEvents : allProducts;
    return Array.isArray(collection) ? collection.find((item) => item?._id === id) || null : null;
  }, [allProducts, allEvents, id, isEvent]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id, isEvent]);

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <ProductDetails data={data} />
      {!isEvent && data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
