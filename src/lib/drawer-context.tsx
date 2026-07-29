"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DrawerCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<DrawerCtx>({ open: false, setOpen: () => {} });

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export function useDrawer() {
  return useContext(Ctx);
}
