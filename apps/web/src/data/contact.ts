export const contact = {
  phone: '08113860670',
  phoneIntl: '+2348113860670',
  wa: '2348113860670',
  email: 'info@teecrownconsult.org',
  address: '18B Emmanuel Street, Ojota, Kosofe, Lagos',
  social: {
    Facebook: 'https://www.facebook.com/teecrownconsultltd',
    Instagram: 'https://www.instagram.com/teecrownconsultltd/',
    X: 'https://x.com/TeeCrownConsult',
    YouTube: 'https://www.youtube.com/@teecrownconsult',
  },
};

export function waLink(msg?: string) {
  return `https://wa.me/${contact.wa}?text=${encodeURIComponent(msg || "Hello Tee'Crown Consult! I'd like to plan a trip.")}`;
}
