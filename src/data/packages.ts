export interface PricingRow {
  label: string;
  value: string;
}

export interface ItineraryDay {
  day: string;
  description: string;
}

export interface PackageContent {
  intro: string[];
  included?: string[];
  highlights?: string[];
  pricing?: PricingRow[];
  itinerary?: ItineraryDay[];
  requirements?: string[];
  hashtags?: string[];
  validUntil?: string;
}

export interface Package {
  slug: string;
  title: string;
  location: string;
  image: string;
  duration: string;
  gallery: string[];
  excerpt: string;
  tag: string;
  content: PackageContent;
}

export const packages: Package[] = [
  {
    slug: 'turkey', title: 'Discover Turkey', location: 'Istanbul · Cappadocia · Antalya',
    image: '/images/tour-turkey.webp', duration: '7–10 days',
    gallery: ['/images/tour-turkey.webp', '/images/turkey2.webp', '/images/turkey3.webp'],
    excerpt: 'History and modern life woven together — visa guidance, flights and full consultation for Nigerian travellers.',
    tag: 'Popular',
    content: {
      intro: [
        "There is something unforgettable about Turkey. Maybe it is the blend of history and modern life. Maybe it is the breathtaking architecture of Istanbul, the magical landscapes of Cappadocia, or the warmth of a culture that welcomes visitors from around the world.",
        "At Tee'Crown Consult Ltd, we understand that international travel begins long before you board a flight. It starts with proper guidance, reliable information, and a smooth visa process. That is why our team is committed to assisting individuals and families in Nigeria who are planning trips to Turkey.",
        "Whether you are planning a holiday, business trip, family visit, or simply looking to explore one of the world's most talked-about destinations, our team is available to guide you through the process professionally and responsibly.",
      ],
      included: [
        'Turkey visa application guidance',
        'Travel consultation',
        'Flight booking support',
        'General travel information and assistance',
      ],
      highlights: [
        'Sunrise hot-air balloon over Cappadocia',
        'The Blue Mosque, Hagia Sophia & Grand Bazaar',
        'Bosphorus cruise between two continents',
        'Relaxing on the Antalya Riviera',
      ],
    },
  },
  {
    slug: 'kenya', title: 'The Magic of Kenya', location: 'Nairobi · Maasai Mara · Diani',
    image: '/images/kenya1.webp', duration: '6–8 days',
    gallery: ['/images/kenya1.webp', '/images/kenya2.webp', '/images/kenya3.webp'],
    excerpt: 'Breathtaking savannahs, giraffes up close and pristine beaches. Fast Kenya eTA processing in 48–72 hours.',
    tag: 'Safari',
    content: {
      intro: [
        "Dreaming of an unforgettable getaway to Kenya? Whether it is exploring breathtaking savannahs, feeding giraffes up close, or relaxing on pristine beaches, Tee'Crown Consult Ltd has got you covered!",
        "Why Choose Kenya? Witness the Great Migration and Big Five safari. Explore white sandy beaches and turquoise waters. Experience vibrant culture, rich history and adventure.",
        "Don't let borders hold you back — your Kenyan adventure begins here!",
      ],
      pricing: [
        { label: 'eTA Processing', value: '48–72 hours' },
        { label: 'Visa Validity', value: '90 days' },
      ],
      included: [
        'Kenya eTA processing (48–72 hrs)',
        'Return flights & internal transfers',
        'Safari lodge accommodation',
        'Park fees & guided game drives',
      ],
      highlights: [
        'Big-Five game drives in the Maasai Mara',
        'Giraffe Centre & elephant orphanage in Nairobi',
        'White-sand beaches at Diani',
        'Authentic Maasai cultural experiences',
      ],
      requirements: [
        'International Passport',
        'Passport Photograph',
        'Other necessary documents',
      ],
    },
  },
  {
    slug: 'singapore', title: 'A Trip to Singapore', location: 'Marina Bay · Sentosa',
    image: '/images/tour-singapore.webp', duration: '5 days / 4 nights',
    gallery: ['/images/tour-singapore.webp', '/images/singapore2.webp', '/images/hero-dubai.webp'],
    excerpt: 'Gardens by the Bay, Universal Studios and skyline views — visa assistance and vacation planning included.',
    tag: 'City',
    content: {
      intro: [
        "Tee'Crown Consult Ltd currently provides travel support services for individuals and families interested in visiting Singapore for tourism, business, or vacation purposes.",
        "Singapore remains one of the most visited destinations for travellers looking to experience modern city attractions, cultural sites, shopping, and family-friendly locations such as Marina Bay Sands, Gardens by the Bay, Sentosa Island, and Universal Studios Singapore.",
      ],
      pricing: [
        { label: 'Package Price', value: '₦2,764,589 for 2 pax' },
        { label: 'Accommodation', value: '4 nights' },
        { label: 'Meals', value: 'Daily breakfast' },
        { label: 'Visa', value: 'Singapore e-visa' },
        { label: 'Sightseeing', value: 'SIC (Seat-in-Coach)' },
        { label: 'Transfers', value: 'Private Transfers' },
      ],
      validUntil: 'August 31, 2026',
      included: [
        'Singapore visa assistance',
        'Flight booking support',
        'Hotel reservation guidance',
        'Travel consultation',
        'Vacation planning',
      ],
      highlights: [
        'Gardens by the Bay & Supertree light show',
        'Marina Bay Sands SkyPark',
        'Universal Studios on Sentosa Island',
        'Night Safari experience',
      ],
      itinerary: [
        { day: 'Day 1', description: 'Arrival + Night Safari' },
        { day: 'Day 2', description: 'City Tour + Sentosa Island' },
        { day: 'Day 3', description: 'Gardens by the Bay + Shopping' },
        { day: 'Day 4', description: 'Free Day' },
        { day: 'Day 5', description: 'Departure' },
      ],
      hashtags: ['#SingaporeTravel', '#VisaAssistance', '#TravelConsultant', '#InternationalTravel'],
    },
  },
  {
    slug: 'luxury-water', title: 'Luxury on the Water', location: 'Lagos Lagoon',
    image: '/images/tour-luxury-water.webp', duration: 'Half or full day',
    gallery: ['/images/tour-luxury-water.webp', '/images/water1.webp', '/images/hero-beach.webp'],
    excerpt: 'Premium Lagos boat cruises for romantic escapes, celebrations and corporate retreats — crew, décor and catering.',
    tag: 'Local',
    content: {
      intro: [
        "Discover Lagos from a new perspective — calm waters, stunning skyline views, and an atmosphere designed for unforgettable moments.",
        "Tee'Crown Consult Limited delivers premium boat cruise experiences perfect for romantic escapes, birthdays, anniversaries, group celebrations, corporate retreats, and executive gatherings. With a luxury vessel, professional crew, full safety compliance, and optional décor, music, and catering add-ons, every detail is carefully curated for comfort, class, and enjoyment.",
        "This isn't just a cruise. It's a Tee'Crown experience. Limited prime slots available.",
      ],
      included: [
        'Private boat charter',
        'Life jackets & safety briefing',
        'Refreshments on board',
        'Custom décor & catering (add-on)',
      ],
      highlights: [
        'Private skyline cruise on Lagos Lagoon',
        'Sunset and celebration packages',
        'Professional captain & crew',
        'Optional décor, catering & DJ',
      ],
    },
  },
  {
    slug: 'honeymoon', title: 'Honeymoon Escapes', location: 'Made for two',
    image: '/images/tour-honeymoon.webp', duration: 'Tailored',
    gallery: ['/images/tour-honeymoon.webp', '/images/hero-beach.webp', '/images/tour-vacation.webp'],
    excerpt: 'For couples celebrating their love — airfare, boutique stays, sightseeing, fine dining and spa treatments.',
    tag: 'Romance',
    content: {
      intro: [
        "This package is designed for couples looking to celebrate their love in a truly special way. We take time to understand you as a couple and craft a romantic getaway around it.",
        "Think handpicked resorts, candlelit dinners and thoughtful surprises along the way — every detail arranged so you can simply be together.",
      ],
      included: [
        'Return airfare',
        'Boutique accommodation',
        'Sightseeing & dining',
        'Spa treatments',
      ],
      highlights: [
        'Handpicked romantic resorts',
        'Candlelit dinners & couple spa days',
        'Private sightseeing & excursions',
        'Thoughtful in-trip surprises',
      ],
    },
  },
  {
    slug: 'pilgrimage', title: 'Pilgrimage', location: 'Holy sites worldwide',
    image: '/images/pilgrimage1.webp', duration: 'Varies',
    gallery: ['/images/pilgrimage1.webp', '/images/pilgrimage2.webp', '/images/pilgrimage3.webp'],
    excerpt: 'Travel to a holy site with everything handled — airfare, accommodation and transport to and from the site.',
    tag: 'Faith',
    content: {
      intro: [
        "For travellers journeying to a holy site for religious purposes, we take care of the logistics so you can focus on the spiritual experience.",
        "From documentation to accommodation near the site, our team ensures a smooth, dignified and well-supported pilgrimage.",
      ],
      included: [
        'Return airfare',
        'Accommodation',
        'Transport to and from the site',
        'Dedicated coordinator',
      ],
      highlights: [
        'Guidance on pilgrimage documentation',
        'Accommodation close to the holy site',
        'Group and individual arrangements',
        'On-ground transport & support',
      ],
    },
  },
  {
    slug: 'medical', title: 'Medical Tourism', location: 'World-class hospitals worldwide',
    image: '/images/medical1.webp', duration: 'Tailored',
    gallery: ['/images/medical1.webp', '/images/medical2.webp', '/images/medical3.webp'],
    excerpt: 'Access affordable, world-class medical procedures abroad — with full travel, accommodation and hospital coordination.',
    tag: 'Wellness',
    content: {
      intro: [
        "Medical tourism opens the door to high-quality healthcare at a fraction of the cost. We connect you with accredited hospitals and specialists overseas, handling every step of the journey.",
        "From initial consultation to post-procedure recovery, our team ensures a seamless blend of medical care and comfortable travel — so you can focus on healing.",
      ],
      included: [
        'Medical visa assistance',
        'Return flights from Nigeria',
        'Hospital & accommodation booking',
        'In-country support & airport transfers',
      ],
      highlights: [
        'Access to accredited international hospitals',
        'Cost-effective treatment packages',
        'Pre-trip consultation & medical records coordination',
        'Post-procedure recovery accommodation',
      ],
    },
  },
  {
    slug: 'custom', title: 'Custom Itinerary', location: 'Anywhere you choose',
    image: '/images/tour-custom.webp', duration: 'Tailored',
    gallery: ['/images/tour-custom.webp', '/images/hero-travel-1.webp', '/images/hero-dubai.webp'],
    excerpt: 'No fixed plans — tell us your dream destination, and we will build a completely personalised trip around you.',
    tag: 'Bespoke',
    content: {
      intro: [
        "Not every trip fits a pre-made package — and that is exactly the point. A custom itinerary is for travellers who know what they want or simply want to explore what is possible.",
        "Tell us your destination, dates, group size and interests, and we will build a trip from scratch: flights, visas, accommodation, activities and ground support — designed around you.",
      ],
      included: [
        'Visa guidance & processing',
        'Return flights & internal transfers',
        'Hand-picked accommodation',
        '24/7 in-country support',
      ],
      highlights: [
        'Entirely personalised itinerary',
        'Choice of destination, season & duration',
        'Curated experiences matching your interests',
        'Dedicated trip coordinator from start to finish',
      ],
    },
  },
  {
    slug: 'vacation', title: 'Vacation Packages', location: 'Top destinations worldwide',
    image: '/images/tour-vacation.webp', duration: '5–14 days',
    gallery: ['/images/tour-vacation.webp', '/images/hero-beach.webp', '/images/hero-travel-3.webp'],
    excerpt: "Ready-to-book holiday getaways to the world's most beloved destinations — flights, hotels and tours included.",
    tag: 'Leisure',
    content: {
      intro: [
        "Sometimes you just need a holiday — the kind where every detail is taken care of before you even pack your bags. Our vacation packages are curated getaways to top destinations worldwide.",
        "From the beaches of the Maldives to the streets of Paris, we include flights, accommodation, daily itinerary and on-ground support so all you have to worry about is enjoying yourself.",
      ],
      included: [
        'Return airfare',
        'Hotel accommodation with breakfast',
        'Daily itinerary & tour suggestions',
        'Airport transfers & travel insurance',
      ],
      highlights: [
        'Curated destinations across continents',
        'Hassle-free booking with everything included',
        'Family-friendly and couples options',
        'Flexible add-ons for excursions & dining',
      ],
    },
  },
];
