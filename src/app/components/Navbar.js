'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);

  // Show NORYA next to logo
  const [showNorya, setShowNorya] = useState(!isHomePage);

  // Dynamic logo size and NORYA text padding
  const [logoSize, setLogoSize] = useState(36);
  const [textPaddingRight, setTextPaddingRight] = useState(8);

  // Hide navbar on scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const updateSizes = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setLogoSize(36);
        setTextPaddingRight(8);
      } else if (w < 1600) {
        setLogoSize(48);
        setTextPaddingRight(10);
      } else {
        setLogoSize(44);
        setTextPaddingRight(12);
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // NORYA text animation once per hour
  useEffect(() => {
    if (isHomePage) {
      const lastAnim = localStorage.getItem("noryaAnimationTimestamp");
      const now = Date.now();
      const oneHour = 1000 * 60 * 60;

      if (!lastAnim || now - parseInt(lastAnim) > oneHour) {
        const timer = setTimeout(() => {
          setShowNorya(true);
          localStorage.setItem("noryaAnimationTimestamp", now.toString());
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setShowNorya(true);
      }
    }
  }, [isHomePage]);

  // Scroll effect: hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll <= 0) {
        setShowNavbar(true);
      } else if (currentScroll > lastScroll) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 text-white bg-transparent pt-4 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo + NORYA */}
          <Link
            href="/"
            className="group relative flex items-center m-0 transition-all"
          >
            {/* Hover background */}
            <span className="absolute inset-0 bg-yellow-400 rounded-full opacity-0 transition-all duration-300
                             group-hover:opacity-100 -z-10"></span>

            <div
              className="relative flex items-center justify-center z-10 transition-all duration-300
                         group-hover:pl-2 group-hover:pr-2 group-hover:pt-1 group-hover:pb-1"
              style={{
                width: `${logoSize}px`,
                height: `${logoSize}px`,
              }}
            >
              <img
                className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                src="/NORYA-logo.png"
                alt="NORYA Logo"
              />
            </div>

            {showNorya && (
              <span
                id="navbarTextTarget"
                className="text-2xl pl-2 font tracking-tight transition-all duration-300 opacity-100 z-10
                           group-hover:pl-4 group-hover:pr-4 group-hover:pt-1 group-hover:pb-1"
                style={{
                  lineHeight: `${logoSize}px`,
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  transform: 'translateY(2px)',
                }}
              >
                NORYA
              </span>
            )}
          </Link>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden z-50 relative focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 h-full m-0">
            {[
              { href: "/sellers", label: "Selgere" },
              { href: "/products", label: "Produkter" },
              { href: "/omoss", label: "Om oss" },
              { href: "#", label: "Favoritter", extra: "pt-2" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`hover:bg-yellow-100 hover:rounded-full px-3 py-2 m-0 h-full transition-all ${item.extra || ""} text-white`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/products/cart"
              className="hover:bg-yellow-100 hover:text-white hover:rounded-full h-full me-0 pr-4 pl-4 py-2 group transition-all"
            >
              <img className="w-5" src="/shoppingCartIcon.png" alt="Cart" />
            </Link>

            <Link
              href="/profile"
              className="group hover:bg-blue-600 hover:rounded-full h-full p-2 pl-2 pr-2 pt-[10px] transition-all"
            >
              <FontAwesomeIcon className="group-hover:invert pr-2 pl-2 pb-1 text-white" icon={faUser} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-blue-900 z-40 flex flex-col items-center text-white overflow-y-auto
                    transition-all duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Top Logo + NORYA */}
        <div className={`flex flex-col items-center justify-center mt-12 mb-16 transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          <img className="w-12 h-12 mb-6" src="/NORYA-logo.png" alt="NORYA Logo" />
          <span className="text-3xl font-semibold tracking-tight">NORYA</span>
        </div>

        {/* Links */}
        <div className={`flex flex-col space-y-4 text-center transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          {[
            { href: "/sellers", label: "Selgere" },
            { href: "/products", label: "Produkter" },
            { href: "/omoss", label: "Om oss" },
            { href: "#", label: "Favoritter" },
            { href: "/products/cart", label: "Cart" },
            { href: "/profile", label: "Profil" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white text-xl py-2 transition-all"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
