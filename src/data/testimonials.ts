export interface Testimonial {
  rating: number;
  name: string;
  title: string;
  text: string;
}

export const testimonials: Testimonial[] = [
  { rating: 5, name: 'Carlos Tevez', title: 'Corporate Client', text: 'Booking a corporate retreat through Tee\'Crown Consult was a fantastic decision. The team-building activities, accommodations and flawless organisation exceeded our expectations.' },
  { rating: 5, name: 'Maya Kalisu', title: 'Solo Traveller', text: 'As a solo traveller, safety was my top concern, and they went above and beyond to make sure I felt secure throughout. My trip was unforgettable.' },
  { rating: 5, name: 'Alex Ofure', title: 'Satisfied Customer', text: 'Tee\'Crown Consult made my travel experience seamless and enjoyable. Their attention to detail and commitment to customer satisfaction is truly remarkable.' },
];
