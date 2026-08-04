"use client";

import { useState, useEffect, ReactNode } from "react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { ContactDrawer } from "@/components/layout/contact-drawer";

interface PageShellProps {
  current: string;
  children: (props: { openContact: () => void }) => ReactNode;
}

export function PageShell({ current, children }: PageShellProps) {
  const [contact, setContact] = useState(false);
  const openContact = () => setContact(true);
  return (
    <>
      <SiteNav solid current={current} scrolled onContact={openContact} />
      <main>{typeof children === 'function' ? children({ openContact }) : children}</main>
      <SiteFooter onContact={openContact} />
      <WhatsAppFab />
      <ContactDrawer open={contact} onClose={() => setContact(false)} />
    </>
  );
}
