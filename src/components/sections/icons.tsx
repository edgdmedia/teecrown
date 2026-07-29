export const SVC_ICONS: Record<string, React.ReactNode> = {
  'Flight & Ticket Reservation': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15.5 3.5 11V7.8l2 .6 2.2 2 5-.2L9 3.2l2.6.5 5 6.7 3.6 1c.9.3 1.4.9 1.4 1.7 0 1.1-.9 2-2.2 2.4Z"/><path d="M6 20.5h12"/></svg>),
  'Visa Assistance': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="2.4"/><path d="M8.5 15.5c.7-1.6 2-2.4 3.5-2.4s2.8.8 3.5 2.4"/><path d="M8 18.5h8"/></svg>),
  'Student Visa Assistance': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8.5 12 4l9.5 4.5L12 13Z"/><path d="M6 10.6V15c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.4"/><path d="M21.5 8.5v5"/></svg>),
  'Travel Insurance': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5 5 6v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6Z"/><path d="m9.2 11.8 2 2 3.6-4"/></svg>),
};

export function SvcIcon({ title }: { title: string }) {
  return (
    <div className="tcc-svcicon" style={{ width: '58px', height: '58px', borderRadius: '14px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,206,112,0.12)', color: 'var(--color-primary)' }}>
      {SVC_ICONS[title] || <span>{title[0]}</span>}
    </div>
  );
}

export const REASON_ICONS: Record<string, React.ReactNode> = {
  'Proudly indigenous': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z"/></svg>),
  'End-to-end concierge': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>),
  'Fast, reliable visas': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-7.5Z"/></svg>),
  'People, not tickets': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M18 15.2c2 .7 3.4 2.4 3.4 4.8"/></svg>),
};

export function ReasonIcon({ title, size = 58 }: { title: string; size?: number }) {
  return (
    <div className="tcc-svcicon" style={{ width: `${size}px`, height: `${size}px`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,206,112,0.12)', color: 'var(--color-primary)' }}>
      {REASON_ICONS[title] || <span>{title[0]}</span>}
    </div>
  );
}

export const SVC_SVG: Record<string, React.ReactNode> = SVC_ICONS;
