export interface Service {
  icon: string;
  image: string;
  title: string;
  description: string;
  details: string[];
}

export const services: Service[] = [
  { icon: '✈️', image: '/images/svc-flight.webp', title: 'Flight & Ticket Reservation', description: 'With access to multiple airlines, we hunt down the most competitive fares for your dates — saving you time and money.', details: ['Fare comparison across major and budget airlines', 'Group, corporate and family bookings', 'Date-flexibility advice to lower your fare', 'Rebooking and change support when plans shift'] },
  { icon: '🛂', image: '/images/svc-visa.webp', title: 'Visa Assistance', description: 'Our consultants demystify the requirements for your destination and make sure your application is complete and successful.', details: ['Document checklist tailored to your destination', 'Application review before you submit', 'Appointment and biometrics guidance', 'Support for tourist, business and family visas'] },
  { icon: '🎓', image: '/images/svc-student-visa.webp', title: 'Student Visa Assistance', description: 'We know the specifics of study-abroad visas and walk you through the whole application, from documentation to submission.', details: ['Proof-of-funds and sponsorship guidance', 'Admission and enrolment document support', 'Statement of purpose review', 'Pre-departure and travel planning'] },
  { icon: '🛡️', image: '/images/svc-insurance.webp', title: 'Travel Insurance', description: 'Match the right coverage to your trip and budget from a range of trusted policies — travel with total peace of mind.', details: ['Medical, trip-cancellation and baggage cover', 'Schengen-compliant policies for visa applications', 'Single-trip and multi-trip options', 'Clear guidance on what each policy covers'] },
];
