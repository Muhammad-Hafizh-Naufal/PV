"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const base = pathname === "/" ? "" : "/";
  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > 260 && current > previous && !open);
      previous = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  return (
    <header className={`site-header ${hidden ? "nav-hidden" : ""}`}>
      <div className="nav-inner">
        <Link
          className="wordmark"
          href="/"
          aria-label="Hafizh home"
          onClick={() => setOpen(false)}
        >
          hafizh<span>.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href={`${base}#work`}>Work</a>
          <a href={`${base}#about`}>About</a>
          <a href={`${base}#experience`}>Experience</a>
        </nav>
        <a className="nav-contact" href={`${base}#contact`}>
          Let’s talk <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle icon-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {["Work", "About", "Experience", "Contact"].map((item) => (
            <a
              key={item}
              href={`${base}#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              {item}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
