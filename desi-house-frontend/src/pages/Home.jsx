import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-[85vh] flex items-center justify-center bg-beige overflow-hidden">
        
        {/* Background Logo */}
        <img
          src="/logo.png"
          alt="Desi House Background"
          className="absolute opacity-10 w-[600px] md:w-[750px] lg:w-[900px]"
        />

        {/* Foreground Card */}
        <div className="relative bg-white p-10 rounded-2xl shadow-xl text-center max-w-xl z-10">
          <h1 className="text-5xl font-bold text-maroon mb-4">
            DESI HOUSE
          </h1>
          <p className="mb-6 text-lg text-dark">
            Timeless Ethnic Elegance for Modern India
          </p>

          {/* 🔥 Working Button */}
          <button
            onClick={() => navigate("/shop")}
            className="bg-maroon text-white px-8 py-3 rounded-full hover:bg-gold transition"
          >
            Shop New Collection
          </button>
        </div>
      </section>
    </>
  );
}
