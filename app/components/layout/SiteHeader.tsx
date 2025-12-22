"use client";

import Link from "next/link";
import { Search, ChevronDown, FileText, Briefcase, Zap, ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  NavDropdown - Pure CSS hover dropdown (no state, no blinking)             */
/* -------------------------------------------------------------------------- */
interface DropdownItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface NavDropdownProps {
  label: string;
  menuLabel: string;
  items: DropdownItem[];
}

const NavDropdown = ({ label, menuLabel, items }: NavDropdownProps) => {
  return (
    <div className="relative group">
      {/* Trigger Button */}
      <button
        type="button"
        className="flex items-center gap-1.5 font-medium bg-transparent text-gray-700 hover:text-primary hover:bg-primary/10 group-hover:bg-primary group-hover:text-white px-3 py-2 rounded-md transition-colors duration-150"
        suppressHydrationWarning
      >
        {label}
        <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform duration-150" />
      </button>

      {/* Dropdown Menu - CSS only visibility */}
      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        <div className="rounded-lg shadow-lg border border-gray-200 w-64 bg-white p-2">
          <div className="font-semibold text-primary px-3 py-2 text-sm">
            {menuLabel}
          </div>
          <div className="h-px bg-gray-100 my-1" />

          {items.map((item) => (
            item.disabled ? (
              <div
                key={item.label}
                className="text-gray-400 cursor-not-allowed p-3 rounded-md text-sm"
              >
                {item.label}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-3 w-full text-gray-700 hover:text-primary p-3 rounded-md hover:bg-primary/10 transition-colors duration-150 group/item"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150" />
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  SiteHeader component                                                      */
/* -------------------------------------------------------------------------- */
export function SiteHeader() {
  const visaItems: DropdownItem[] = [
    {
      href: "/visa-category/ir-category",
      label: "IR Category",
      icon: <Briefcase className="h-4 w-4 text-primary/60 group-hover/item:text-primary" />,
    },
    {
      href: "#",
      label: "More coming soon...",
      icon: <></>,
      disabled: true,
    },
  ];

  const serviceItems: DropdownItem[] = [
    {
      href: "/services",
      label: "Consultancy",
      icon: <Zap className="h-4 w-4 text-primary/60 group-hover/item:text-primary" />,
    },
  ];

  const toolItems: DropdownItem[] = [
    { href: "/passport", label: "Passport Photo", icon: <FileText className="h-4 w-4 text-primary/60 group-hover/item:text-primary" /> },
    { href: "/pdf-processing", label: "PDF Processing", icon: <FileText className="h-4 w-4 text-primary/60 group-hover/item:text-primary" /> },
    { href: "/signature-image-processing", label: "Create Signature", icon: <FileText className="h-4 w-4 text-primary/60 group-hover/item:text-primary" /> },
    { href: "/iv-tool", label: "IV Tool", icon: <FileText className="h-4 w-4 text-primary/60 group-hover/item:text-primary" /> },
    { href: "/visa-forms", label: "Auto Form Filling", icon: <FileText className="h-4 w-4 text-primary/60 group-hover/item:text-primary" /> },
    { href: "/visa-checker", label: "Visa Bulletin Checker", icon: <FileText className="h-4 w-4 text-primary/60 group-hover/item:text-primary" /> },
    { href: "#", label: "More tools coming soon...", icon: <></>, disabled: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-white to-primary/10 backdrop-blur-lg shadow-md">
      {/* ------------------------------------------------------------------ */}
      {/* Desktop navigation */}
      {/* ------------------------------------------------------------------ */}
      <div className="container mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-lg font-bold bg-primary text-white shadow-md hover:bg-primary/90 transition-colors duration-150"
          >
            RAHVANA
          </Link>

          <nav className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors duration-150"
            >
              HOME
            </Link>

            {/* VISA CATEGORY */}
            <NavDropdown
              label="VISA CATEGORY"
              menuLabel="Explore Visas"
              items={visaItems}
            />

            {/* SERVICES */}
            <NavDropdown
              label="SERVICES"
              menuLabel="Our Services"
              items={serviceItems}
            />

            {/* TOOLS */}
            <NavDropdown
              label="TOOLS"
              menuLabel="Available Tools"
              items={toolItems}
            />

            <Link
              href="#contact"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors duration-150"
            >
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Right side – Search + Login */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="p-2 bg-transparent hover:bg-primary/10 rounded-md transition-colors duration-150"
            suppressHydrationWarning
          >
            <Search className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </button>

          <Link href="/signup">
            <button
              type="button"
              className="font-semibold text-white bg-primary hover:bg-primary/90 shadow-md px-4 py-2 rounded-md transition-colors duration-150"
              suppressHydrationWarning
            >
              LOGIN
            </button>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile navigation */}
      {/* ------------------------------------------------------------------ */}
      <div className="md:hidden container mx-auto px-4 pb-3 flex flex-wrap items-center gap-2 justify-center">
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1.5 font-medium bg-transparent text-gray-700 border rounded-md px-3 py-2"
            suppressHydrationWarning
          >
            TOOLS
            <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform duration-150" />
          </button>

          <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <div className="rounded-lg shadow-lg border border-gray-200 w-56 bg-white p-2">
              <div className="font-semibold text-primary px-3 py-2 text-sm">
                Available Tools
              </div>
              <div className="h-px bg-gray-100 my-1" />

              {[
                { href: "/passport", label: "Passport Photo" },
                { href: "/pdf-processing", label: "PDF Processing" },
                { href: "/signature-image-processing", label: "Create Signature" },
                { href: "/iv-tool", label: "IV Tool" },
                { href: "/visa-forms", label: "Auto Form Filling" },
                { href: "/visa-checker", label: "Visa Bulletin Checker" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary p-3 rounded-md hover:bg-primary/10 transition-colors duration-150"
                >
                  <FileText className="h-4 w-4 text-primary/60" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
