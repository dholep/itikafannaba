"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    JsBarcode?: any;
  }
}

export default function Barcode({ value }: { value: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.JsBarcode) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  useEffect(() => {
    if (!ready || !svgRef.current || !window.JsBarcode) return;
    try {
      window.JsBarcode(svgRef.current, value, {
        format: "CODE128",
        displayValue: true,
        fontSize: 14,
        height: 80,
        margin: 0,
      });
    } catch {}
  }, [ready, value]);
  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", maxWidth: 360 }}
      aria-label="Barcode peserta"
    />
  );
}
