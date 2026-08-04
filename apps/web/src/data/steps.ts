export interface Step {
  n: string;
  title: string;
  text: string;
}

export const steps: Step[] = [
  { n: '01', title: 'Tell us your dream', text: 'Share your destination, dates and budget over WhatsApp or the enquiry form. No detail is too small.' },
  { n: '02', title: 'We craft the plan', text: 'Our team designs a tailored itinerary — flights, stays, visas and experiences — and sends you a clear quote.' },
  { n: '03', title: 'Travel worry-free', text: 'Everything booked and documented. You pack; we handle logistics and stay on call throughout your journey.' },
];
