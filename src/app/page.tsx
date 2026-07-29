"use client";

import { useState, useEffect } from "react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { ContactDrawer } from "@/components/layout/contact-drawer";
import { Hero } from "@/components/sections/hero";
import { StatsBand } from "@/components/sections/stats-band";
import { ServicesSection } from "@/components/sections/services-section";
import { StepsSection } from "@/components/sections/steps-section";
import { ToursSection } from "@/components/sections/tours-section";
import { WhySection } from "@/components/sections/why-section";
import { TestimonialsBand } from "@/components/sections/testimonials-band";
import { StoriesSection } from "@/components/sections/stories-section";
import { CtaBand } from "@/components/layout/cta-band";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [contact, setContact] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const openContact = () => setContact(true);

  return (
    <>
      <SiteNav current="Home" scrolled={scrolled} onContact={openContact} />
      <main>
        <Hero onContact={openContact} onExplore={() => {
          const el = document.querySelector('#tours');
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
        }} />
        <StatsBand />
        <ServicesSection onContact={openContact} />
        <StepsSection />
        <ToursSection />
        <WhySection />
        <TestimonialsBand />
        <StoriesSection />
        <CtaBand onContact={openContact} />
      </main>
      <SiteFooter onContact={openContact} />
      <WhatsAppFab />
      <ContactDrawer open={contact} onClose={() => setContact(false)} />
    </>
  );
}
