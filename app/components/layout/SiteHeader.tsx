"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, FileText, Briefcase, Zap, ArrowRight } from "lucide-react";

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
  isSignedIn?: boolean;
  onToggleAuth?: () => void;
}

// --------------------------------------------------------------------------
//  Hydration-safe button – suppresses warnings for extension-injected attrs
// --------------------------------------------------------------------------
const HydrationSafeButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }
) => {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={className}
      // <-- THIS IS THE KEY LINE
      suppressHydrationWarning={true}
    />
  );
};

// --------------------------------------------------------------------------
//  Global clean-up – runs once, removes any fdprocessedid attrs
// --------------------------------------------------------------------------
const useExtensionCleanup = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      document
        .querySelectorAll("[fdprocessedid]")
        .forEach((el) => el.removeAttribute("fdprocessedid"));
    }, 0);
    return () => clearTimeout(timer);
  }, []);
};

// --------------------------------------------------------------------------
//  Hover-dropdown hook (unchanged)
// --------------------------------------------------------------------------
const useHoverDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 800);
  };

  return { isOpen, handleMouseEnter, handleMouseLeave };
};

// --------------------------------------------------------------------------
//  SiteHeader component
// --------------------------------------------------------------------------
export function SiteHeader({ activeSection, onNavigate, isSignedIn = false, onToggleAuth }: HeaderProps = {}) {
  // Run cleanup once
  useExtensionCleanup();
  const router = useRouter();

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const visaMenu = useHoverDropdown();
  const serviceMenu = useHoverDropdown();
  const toolsMenu = useHoverDropdown();

  const handleNav = (id: string, e?: React.MouseEvent) => {
    setIsMenuOpen(false);

    if (onNavigate) {
      if (e) e.preventDefault();
      onNavigate(id);
    } else {
      // Fallback: Use router navigation if no handler is provided (e.g., in layout.tsx)
      const routes: Record<string, string> = {
        'home': '/?section=home',
        'journeys': '/?section=journeys',
        'ir1-journey': '/?section=ir1-journey',
        'services': '/?section=services',
        'tools': '/?section=tools',
        'pricing': '/pricing',
        'dashboard': '/dashboard',
        'contact': '/contact',
        'passport': '/passport',
        'pdf': '/pdf-processing',
        'signature': '/signature-image-processing',
        'iv': '/iv-tool',
        'forms': '/visa-forms',
        'checker': '/visa-checker',
        'document-vault': '/document-vault',
        'affidavit-support-calculator': '/affidavit-support-calculator'
      };

      const targetRoute = routes[id] || '/';
      router.push(targetRoute);
    }
  };

  const isActive = (id: string, href?: string) => {
    if (activeSection && activeSection === id) return true;
    if (href && pathname === href) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-white to-primary/10 backdrop-blur-lg shadow-md">
      {/* ------------------------------------------------------------------ */}
      {/* Desktop navigation */}
      {/* ------------------------------------------------------------------ */}
      <div className="container mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button
                className="md:hidden text-slate-800 p-1 hover:bg-slate-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <a
                href="#"
                className="text-2xl font-bold text-white bg-primary/90 px-4 py-2 rounded-md no-underline flex items-center gap-2"
                onClick={(e) => { e.preventDefault(); handleNav('home'); }}
            >
                Rahvana
            </a>

          <nav className="hidden md:flex items-center gap-3 ml-4">
            <Link
              href="/"
              onClick={(e) => handleNav('home', e)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary ${
                isActive('home', '/') ? 'text-primary' : 'text-gray-700'
              }`}
            >
              Home
            </Link>

            {/* ---------- VISA CATEGORY ---------- */}
            <div
              className="relative"
              onMouseEnter={visaMenu.handleMouseEnter}
              onMouseLeave={visaMenu.handleMouseLeave}
            >
              <DropdownMenu open={visaMenu.isOpen}>
                <DropdownMenuTrigger asChild>
                  <HydrationSafeButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleNav('journeys', e)}
                    className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium bg-transparent hover:text-primary transition-all group hover:bg-primary/10 data-[state=open]:bg-primary data-[state=open]:text-white ${
                      isActive('journeys') || isActive('ir1-journey') || pathname.startsWith('/visa-category') ? 'text-primary' : 'text-gray-700'
                    }`}
                  >
                    Visa Category
                    <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </HydrationSafeButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="rounded-lg shadow-lg border border-gray-200 w-64 mt-2 bg-white p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  onMouseEnter={visaMenu.handleMouseEnter}
                  onMouseLeave={visaMenu.handleMouseLeave}
                >
                  <DropdownMenuLabel className="font-semibold text-primary px-3 py-2 text-sm">
                    Explore Visas
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/visa-category/ir-category"
                      onClick={(e) => handleNav('ir1-journey', e)}
                      className={`flex items-center justify-between gap-3 w-full p-3 rounded-md hover:bg-primary/8 transition-all group ${
                        isActive('ir1-journey', '/visa-category/ir-category') ? 'text-primary bg-primary/5' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className={`h-4 w-4 ${isActive('ir1-journey', '/visa-category/ir-category') ? 'text-primary' : 'text-primary/60'} group-hover:text-primary`} />
                        <span className="text-sm font-medium">IR Category</span>
                      </div>
                      <ArrowRight className={`h-3.5 w-3.5 transition-all ${isActive('ir1-journey', '/visa-category/ir-category') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed p-3 rounded-md text-sm">
                    More coming soon...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ---------- SERVICES ---------- */}
            <div
              className="relative"
              onMouseEnter={serviceMenu.handleMouseEnter}
              onMouseLeave={serviceMenu.handleMouseLeave}
            >
              <DropdownMenu open={serviceMenu.isOpen}>
                <DropdownMenuTrigger asChild>
                  <HydrationSafeButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleNav('services', e)}
                    className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium bg-transparent hover:text-primary transition-all group hover:bg-primary/10 border-gray-300 data-[state=open]:bg-primary data-[state=open]:text-white ${
                      isActive('services', '/services') ? 'text-primary' : 'text-gray-700'
                    }`}
                  >
                    Services
                    <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </HydrationSafeButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="rounded-lg shadow-lg border border-gray-200 w-64 mt-2 bg-white p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  onMouseEnter={serviceMenu.handleMouseEnter}
                  onMouseLeave={serviceMenu.handleMouseLeave}
                >
                  <DropdownMenuLabel className="font-semibold text-primary px-3 py-2 text-sm">
                    Our Services
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/services"
                      onClick={(e) => handleNav('services', e)}
                      className={`flex items-center justify-between gap-3 w-full p-3 rounded-md hover:bg-primary/8 transition-all group ${
                        isActive('services', '/services') ? 'text-primary bg-primary/5' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Zap className={`h-4 w-4 ${isActive('services', '/services') ? 'text-primary' : 'text-primary/60'} group-hover:text-primary`} />
                        <span className="text-sm font-medium">Consultancy</span>
                      </div>
                      <ArrowRight className={`h-3.5 w-3.5 transition-all ${isActive('services', '/services') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ---------- TOOLS ---------- */}
            <div
              className="relative"
              onMouseEnter={toolsMenu.handleMouseEnter}
              onMouseLeave={toolsMenu.handleMouseLeave}
            >
              <DropdownMenu open={toolsMenu.isOpen}>
                <DropdownMenuTrigger asChild>
                  <HydrationSafeButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleNav('tools', e)}
                    className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium bg-transparent hover:text-primary transition-all group hover:bg-primary/10 ${isActive('tools') ? 'border-primary' : 'border-transparent'} data-[state=open]:bg-primary data-[state=open]:text-white ${
                      isActive('tools') || pathname.startsWith('/passport') || pathname.startsWith('/pdf') ? 'text-primary' : 'text-gray-700'
                    }`}
                  >
                    Tools
                    <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </HydrationSafeButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="rounded-lg shadow-lg border border-gray-200 w-64 mt-2 bg-white p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  onMouseEnter={toolsMenu.handleMouseEnter}
                  onMouseLeave={toolsMenu.handleMouseLeave}
                >
                  <DropdownMenuLabel className="font-semibold text-primary px-3 py-2 text-sm">
                    Available Tools
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />

                  {/* ---- Tool links (merged from both HEAD and main) ---- */}
                  {[
                    { href: "/passport", label: "Passport Photo", id: 'passport' },
                    { href: "/pdf-processing", label: "PDF Processing", id: 'pdf' },
                    { href: "/signature-image-processing", label: "Create Signature", id: 'signature' },
                    { href: "/iv-tool", label: "IV Tool", id: 'iv' },
                    { href: "/visa-forms", label: "Auto Form Filling", id: 'forms' },
                    { href: "/visa-checker", label: "Visa Bulletin Checker", id: 'checker' },
                    { href: "/document-vault", label: "Document Vault", id: 'document-vault' },
                    { href: "/affidavit-support-calculator", label: "Affidavit Support Calculator", id: 'affidavit-support-calculator' },
                  ].map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        onClick={(e) => handleNav(item.id, e)}
                        className={`flex items-center justify-between gap-3 w-full p-3 rounded-md hover:bg-primary/8 transition-all group ${
                          isActive(item.id, item.href) ? 'text-primary bg-primary/5' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className={`h-4 w-4 ${isActive(item.id, item.href) ? 'text-primary' : 'text-primary/60'} group-hover:text-primary`} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ArrowRight className={`h-3.5 w-3.5 transition-all ${isActive(item.id, item.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed p-3 rounded-md text-sm">
                    More tools coming soon...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link
              href="/pricing"
              onClick={(e) => handleNav('pricing', e)}
              className={`rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-all hover:text-primary ${
                isActive('pricing', '/pricing') ? 'text-primary' : 'text-gray-700'
              }`}
            >
              Pricing
            </Link>

            {isSignedIn && (
              <Link
                href="/dashboard"
                onClick={(e) => handleNav('dashboard', e)}
                className={`rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-all hover:text-primary ${
                  isActive('dashboard', '/dashboard') ? 'text-primary' : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/contact"
              onClick={(e) => handleNav('contact', e)}
              className={`rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-all hover:text-primary ${
                isActive('contact', '/contact') ? 'text-primary' : 'text-gray-700'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right side – Search + Login */}
        <div className="flex items-center gap-3">
          <HydrationSafeButton
            variant="outline"
            size="icon"
            aria-label="Search"
            className="bg-transparent hover:bg-primary/10 p-2 rounded-md"
          >
            <Search className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </HydrationSafeButton>

          {/* LOGIN / SIGN OUT toggle */}
          <button
            onClick={() => onToggleAuth?.()}
            className="font-semibold text-white bg-primary hover:bg-primary/90 shadow-md px-4 py-2 rounded-lg transition-all"
          >
            {isSignedIn ? 'SIGN OUT' : 'LOGIN'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Sidebar Overlay */}
      {/* ------------------------------------------------------------------ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] h-screen md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar Content */}
            <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl" role="img" aria-label="passport">🛂</span>
                        <span className="text-xl font-bold text-[#0d9488]">Rahvana</span>
                    </div>
                    <button
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="flex flex-col px-4 gap-1">
                        <button
                            onClick={() => handleNav('home')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive('home', '/') ? 'bg-[#0d9488]/10 text-[#0d9488]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="font-bold">Home</span>
                        </button>

                        {/* Visa Category Section */}
                        <div className="mt-2">
                            <button
                                onClick={() => {
                                    const section = 'visa';
                                    setExpandedSections(prev =>
                                        prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
                                    );
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 opacity-60" />
                                    <span className="font-bold">Visa Category</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('visa') ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.includes('visa') && (
                                <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                                    <button
                                        onClick={() => handleNav('ir1-journey')}
                                        className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${isActive('ir1-journey') ? 'text-[#0d9488] font-semibold bg-[#0d9488]/5' : 'text-slate-500 hover:text-[#0d9488] hover:bg-slate-50'}`}
                                    >
                                        IR Category
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Services Section */}
                        <div className="mt-2">
                            <button
                                onClick={() => {
                                    const section = 'services';
                                    setExpandedSections(prev =>
                                        prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
                                    );
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 opacity-60" />
                                    <span className="font-bold">Services</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('services') ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.includes('services') && (
                                <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                                    <button
                                        onClick={() => handleNav('services')}
                                        className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${isActive('services') ? 'text-[#0d9488] font-semibold bg-[#0d9488]/5' : 'text-slate-500 hover:text-[#0d9488] hover:bg-slate-50'}`}
                                    >
                                        Consultancy
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tools Section */}
                        <div className="mt-2">
                            <button
                                onClick={() => {
                                    const section = 'tools';
                                    setExpandedSections(prev =>
                                        prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
                                    );
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 opacity-60" />
                                    <span className="font-bold">Tools</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes('tools') ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.includes('tools') && (
                                <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                                    {[
                                        { id: 'passport', label: "Passport Photo" },
                                        { id: 'pdf', label: "PDF Processing" },
                                        { id: 'signature', label: "Create Signature" },
                                        { id: 'iv', label: "IV Tool" },
                                        { id: 'forms', label: "Auto Form Filling" },
                                        { id: 'checker', label: "Visa Bulletin Checker" },
                                        { id: 'document-vault', label: "Document Vault" },
                                        { id: 'affidavit-support-calculator', label: "Affidavit Support Calculator" },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleNav(item.id)}
                                            className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${isActive(item.id) ? 'text-[#0d9488] font-semibold bg-[#0d9488]/5' : 'text-slate-500 hover:text-[#0d9488] hover:bg-slate-50'}`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* <div className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">General</div> */}
                        <button
                            onClick={() => handleNav('pricing')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive('pricing') ? 'bg-[#0d9488]/10 text-[#0d9488]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="font-bold">Pricing</span>
                        </button>
                        {isSignedIn && (
                            <button
                                onClick={() => handleNav('dashboard')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive('dashboard') ? 'bg-[#0d9488]/10 text-[#0d9488]' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="font-bold">Dashboard</span>
                            </button>
                        )}
                        <button
                            onClick={() => handleNav('contact')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive('contact') ? 'bg-[#0d9488]/10 text-[#0d9488]' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="font-bold">Contact</span>
                        </button>
                    </nav>
                </div>

                <div className="p-6 border-t bg-slate-50">
                    <button
                        onClick={() => { onToggleAuth?.(); setIsMenuOpen(false); }}
                        className="w-full py-4 rounded-xl bg-[#0d9488] text-white font-bold shadow-lg hover:bg-[#0f766e] transition-all"
                    >
                        {isSignedIn ? 'Sign Out' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </header>
  );
}
