'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Promises } from "../atoms/Promises";
import { Playfair_Display } from "next/font/google";

// Elegant serif similar to Claude Docs
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function MainBanner() {
  const textRef = useRef(null);
  const revealRef = useRef(null);
  const [fontStyle, setFontStyle] = useState({ fontSize: '4rem', lineHeight: '1.2rem' });

  // Animate logo text
  useEffect(() => {
    let outerTimer, innerTimer, typingInterval;

    outerTimer = setTimeout(() => {
      const source = textRef.current;
      const target = document.getElementById("navbarTextTarget");
      if (!source || !target) return;

      source.style.transition = "opacity 0.3s ease-out";
      source.style.opacity = "0";

      const clone = source.cloneNode(true);
      const sourceRect = source.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;

      Object.assign(clone.style, {
        position: "fixed",
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        margin: "0",
        zIndex: "9999",
        fontSize: isMobile ? "3rem" : "5rem",
        fontWeight: "bold",
        color: "white",
        transition: "all 1s ease-in-out",
        transformOrigin: "top left",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      });

      document.body.appendChild(clone);

      const targetRect = target.getBoundingClientRect();
      requestAnimationFrame(() => {
        Object.assign(clone.style, {
          left: `${targetRect.left}px`,
          top: `${targetRect.top}px`,
          opacity: "0.5",
          transform: "scale(0.6)",
        });
      });

      innerTimer = setTimeout(() => {
        target.style.opacity = "1";
        clone.remove();

        const phrase = "Håndlagde produkter fra vakre ville Nord-Norge";
        const container = revealRef.current;
        if (!container) return;

        container.innerHTML = "";

        const words = phrase.split(" ");
        words.forEach((word) => {
          const wordSpan = document.createElement("span");
          wordSpan.style.whiteSpace = "nowrap"; // keep the word on one line
          wordSpan.style.marginRight = "0.3em"; // space between words

          word.split("").forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.opacity = "0";
            span.style.transition = "opacity 0.3s ease";
            span.style.display = "inline-block";
            wordSpan.appendChild(span);
          });

          container.appendChild(wordSpan);
        });

        // Animate letters one by one
        let letterIndex = 0;
        const spans = container.querySelectorAll("span > span"); // all letters
        typingInterval = setInterval(() => {
          if (letterIndex < spans.length) {
            spans[letterIndex].style.opacity = "1";
            letterIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, isMobile ? 30 : 50);
      }, 1000);
    }, 2000);

    return () => {
      if (outerTimer) clearTimeout(outerTimer);
      if (innerTimer) clearTimeout(innerTimer);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, []);

  // Dynamic font size & vertical spacing
  useEffect(() => {
    const updateFont = () => {
      const width = window.innerWidth;

      const fontSize = Math.max(2.8, width / 370);

      let lineHeightMultiplier;
      if (width < 768) lineHeightMultiplier = 1.2; // smaller vertical spacing on small screens
      else if (width < 1600) lineHeightMultiplier = 1.45; // medium
      else lineHeightMultiplier = 1.6; // large

      const lineHeight = fontSize * lineHeightMultiplier;

      setFontStyle({ fontSize: `${fontSize}rem`, lineHeight: `${lineHeight}rem` });
    };

    updateFont();
    window.addEventListener("resize", updateFont);
    return () => window.removeEventListener("resize", updateFont);
  }, []);

  return (
    <div className="relative z-10">
      <div className="mainBanner-cover bg-cover bg-center w-full min-h-[50vw] sm:min-h-[40vw] relative flex flex-col items-center justify-center overflow-visible">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/norland-a7730.appspot.com/o/products%2Fe4f4bb0f-812f-4dfc-b87b-897a088d1687?alt=media&token=b54ead1b-cbfd-40bd-b9bf-6fe98425d39a"
          alt="Main Banner"
          fill
          priority
          className="object-cover z-0"
        />

        <h2
          ref={textRef}
          className="text-white mb-0 z-10 relative
                     text-6xl sm:text-8xl md:text-8xl
                     [@media(min-width:700px)and(max-width:1270px)]:text-[7rem]
                     [@media(min-width:2000px)]:text-[10rem]"
        >
          NORYA
        </h2>

        <div
          ref={revealRef}
          className={`${playfair.className} text-center p-4 z-20`}
          style={{
            color: '#cfbe20ff',
            fontWeight: "700",
            letterSpacing: "0.04em",
            fontSize: fontStyle.fontSize,
            lineHeight: fontStyle.lineHeight,
          }}
        ></div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
          <Promises />
        </div>
      </div>
    </div>
  );
}
