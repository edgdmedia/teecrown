"use client";

import { useState, useEffect } from "react";
import { waLink } from "@/data/contact";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1000); return () => clearTimeout(t); }, []);
  return (
    <a href={waLink()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp" style={{
      position: 'fixed', right: '22px', bottom: '22px', zIndex: 90,
      width: '58px', height: '58px', borderRadius: '50%', background: '#25D366',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px',
      boxShadow: '0 8px 24px rgba(37,211,102,0.45)', textDecoration: 'none',
      transform: show ? 'scale(1)' : 'scale(0)', transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
    }} className="tcc-fab">💬</a>
  );
}
