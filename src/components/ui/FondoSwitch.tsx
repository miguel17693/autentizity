"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyFondo, clearFondo } from "@/lib/fondo";

/**
 * Keeps the `?color=blanco` preview in sync on client-side navigation and
 * removes it when leaving the public site (e.g. going to /admin), since <html>
 * survives navigations between layouts.
 */
export default function FondoSwitch() {
  const pathname = usePathname();

  useEffect(() => {
    applyFondo();
  }, [pathname]);

  useEffect(() => clearFondo, []);

  return null;
}
