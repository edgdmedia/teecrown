"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/data/contact";
import { Eyebrow } from "@/components/ui/eyebrow";

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ContactDrawer({ open, onClose }: ContactDrawerProps) {
  const [sent, setSent] = useState(false);
  useEffect(() => { if (open) setSent(false); }, [open]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,11,36,0.55)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end', animation: 'tccFadeIn .3s ease' }} onClick={onClose}>
      <div style={{ width: '460px', maxWidth: '100%', height: '100%', background: '#fff', padding: '40px', overflowY: 'auto', position: 'relative', animation: 'tccIn .35s cubic-bezier(.22,.61,.36,1)' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '30px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', width: '40px', height: '40px', borderRadius: '50%', lineHeight: 1, transition: 'all .2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-alt)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text)'; }}
        >&times;</button>

        <div style={{ marginBottom: '20px' }}>
          <Eyebrow>Book your trip</Eyebrow>
          <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontSize: '26px', fontWeight: 700, margin: 0 }}>Let&apos;s start planning</h3>
          <p style={{ color: 'var(--color-text)', fontSize: '14.5px', lineHeight: 1.6, marginTop: '8px' }}>
            Prefer to chat? <a href={waLink()} target="_blank" rel="noopener" style={{ color: 'var(--color-accent-dark)', fontWeight: 600 }}>Message us on WhatsApp &rarr;</a>
          </p>
        </div>

        {sent ? (
          <div style={{ padding: '26px', background: 'var(--tcc-success-bg)', borderRadius: 'var(--radius)', color: 'var(--tcc-success-fg)', textAlign: 'center' }}>
            <div style={{ fontSize: '34px', marginBottom: '8px' }}>&#10004;&#65039;</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Thank you! Our team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-primary)' }}>Name</label>
              <input required placeholder="Your full name" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--color-text)', background: '#fff', outline: 'none', transition: 'border-color .3s ease' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-primary)' }}>Phone</label>
                <input type="tel" placeholder="080..." style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--color-text)', background: '#fff', outline: 'none', transition: 'border-color .3s ease' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-primary)' }}>Email</label>
                <input type="email" required placeholder="you@email.com" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--color-text)', background: '#fff', outline: 'none', transition: 'border-color .3s ease' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-primary)' }}>Which service?</label>
              <select style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--color-text)', background: '#fff', outline: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%2354595F\' d=\'M6 8 0 0h12z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: '40px' }}>
                <option>Flight &amp; Ticket Reservation</option>
                <option>Visa Assistance</option>
                <option>Student Visa Assistance</option>
                <option>Travel Insurance</option>
                <option>Tour Package</option>
                <option>Custom Itinerary</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-primary)' }}>Tell us about your trip</label>
              <textarea placeholder="Destination, dates, number of travellers, budget..." style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--color-text)', background: '#fff', outline: 'none', minHeight: '100px', resize: 'vertical', transition: 'border-color .3s ease' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-primary)' }}>Where did you hear about us?</label>
              <select style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-primary)', fontSize: '14px', color: 'var(--color-text)', background: '#fff', outline: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%2354595F\' d=\'M6 8 0 0h12z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: '40px' }}>
                <option>Google</option>
                <option>Social Media</option>
                <option>Family and Friends</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
            </div>
            <Button variant="accent" type="submit" style={{ width: '100%' }}>Send my request</Button>
          </form>
        )}
      </div>
    </div>
  );
}
