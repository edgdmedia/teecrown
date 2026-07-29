export function IncludeIcon({ text }: { text: string }) {
  const t = text.toLowerCase();
  let icon: React.ReactNode;

  if (/visa|eta|passport/.test(t)) icon = <VisaIcon />;
  else if (/flight|airfare|return.*flight|airline/.test(t)) icon = <FlightIcon />;
  else if (/hotel|accommodation|boutique/.test(t)) icon = <HotelIcon />;
  else if (/transfer|airport|transport|car|coach/.test(t)) icon = <TransferIcon />;
  else if (/park fee|ticket|entrance/.test(t)) icon = <TicketIcon />;
  else if (/guide|tour.*guide/.test(t)) icon = <GuideIcon />;
  else if (/meal|dining|breakfast|catering|refreshment/.test(t)) icon = <DiningIcon />;
  else if (/spa|massage/.test(t)) icon = <SpaIcon />;
  else if (/insurance/.test(t)) icon = <ShieldIcon />;
  else if (/safety|life jacket|briefing/.test(t)) icon = <SafetyIcon />;
  else if (/decor|décor/.test(t)) icon = <DecorIcon />;
  else if (/coordinator|support|dedicated/.test(t)) icon = <SupportIcon />;
  else if (/charter|boat|yacht|cruise/.test(t)) icon = <BoatIcon />;
  else if (/itinerary|sightseeing/.test(t)) icon = <SightseeingIcon />;
  else if (/consultation|medical/.test(t)) icon = <MedicalIcon />;
  else icon = <CheckIcon />;

  return (
    <span style={{ flex: '0 0 auto', width: '22px', height: '22px', color: 'var(--color-accent-dark)' }}>
      {icon}
    </span>
  );
}

function VisaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
      <path d="M3 7v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
      <path d="M3 7h18" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
function FlightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 2 3 1 1 3 2-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}
function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" />
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <path d="M7 13h2" />
      <path d="M15 13h2" />
      <path d="M7 17h2" />
      <path d="M15 17h2" />
      <path d="M3 21h18" />
    </svg>
  );
}
function TransferIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
      <path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
      <path d="M5 17H3V9l3-5h8l3 5h2a2 2 0 0 1 2 2v6h-2" />
      <path d="M9 16V9h6v7" />
      <path d="m14 9-3 4h2l-1 2" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13a3 3 0 0 0 3 3" />
    </svg>
  );
}
function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z" />
      <path d="M2 12h20" />
    </svg>
  );
}
function DiningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M6 2v6a2 2 0 0 0 4 0V2" />
      <path d="M6 8h4" />
      <path d="M16 2v18" />
      <path d="M16 6a3 3 0 0 1 0 6" />
    </svg>
  );
}
function SpaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M12 22c-4-3-8-6-8-11a8 8 0 0 1 8-7 8 8 0 0 1 8 7c0 5-4 8-8 11z" />
      <path d="M12 22v0" />
      <path d="M12 4v0" />
      <path d="M9 8.5c1.5 1 2.5 2 3 3.5.5-1.5 1.5-2.5 3-3.5" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function SafetyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
function DecorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M12 3a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6z" />
      <circle cx="12" cy="9" r="2" />
      <path d="M3 21h18" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M22 16.9v1.1a2 2 0 0 1-2 2h-2.5" />
      <path d="M6.5 20H4a2 2 0 0 1-2-2v-1.1" />
      <path d="M16 20h-4" />
      <path d="M6 17a4 4 0 0 1-4-4v-1a8.5 8.5 0 0 1 17 0v1a4 4 0 0 1-4 4H6Z" />
    </svg>
  );
}
function BoatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M2 16s3-3 10-3 10 3 10 3" />
      <path d="M4 20h16" />
      <path d="M12 4v7" />
      <path d="M8 10h8" />
      <path d="M3 16v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}
function SightseeingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}
function MedicalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
