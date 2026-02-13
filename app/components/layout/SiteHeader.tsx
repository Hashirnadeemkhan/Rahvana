"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Briefcase,
  Layers,
  Shield,
  Heart,
  Globe,
  Building2,
  Cpu,
  Activity,
  FileText,
  Layout,
  MessageSquare,
  Users,
  Star,
  FileUp,
  Map,
  ShieldCheck,
  Camera,
  Zap,
  Folder,
  HelpCircle,
  Lock,
  Settings,
  Tag,
  FileCheck,
  Moon,
  Sun,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "./MegaMenu";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/app/context/AuthContext";
import { useTheme } from "next-themes";

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
  isSignedIn?: boolean;
  onToggleAuth?: () => void;
  user?: User | null;
  profile?: UserProfile | null;
}

// --------------------------------------------------------------------------
//  Hydration-safe button – suppresses warnings for extension-injected attrs
// --------------------------------------------------------------------------
const HydrationSafeButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  },
) => {
  const { className, ...rest } = props;

  // Filter out problematic attributes that might be added by extensions
  const filteredRest = { ...rest };
  const extensionAttributes = ['fdprocessedid', 'data-extension', 'data-extension-id'];
  extensionAttributes.forEach(attr => {
    if (filteredRest[attr as keyof typeof filteredRest]) {
      delete filteredRest[attr as keyof typeof filteredRest];
    }
  });

  return (
    <button
      {...filteredRest}
      className={className}
      suppressHydrationWarning={true}
    />
  );
};

// --------------------------------------------------------------------------
//  Global clean-up – runs once, removes any extension-injected attrs
// --------------------------------------------------------------------------
const useExtensionCleanup = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove common attributes added by browser extensions
      const extensionAttrs = [
        "fdprocessedid",
        "data-extension",
        "data-extension-id",
        "_moz-generated-content-before",
        "_moz-generated-content-after"
      ];

      extensionAttrs.forEach(attr => {
        document
          .querySelectorAll(`[${attr}]`)
          .forEach((el) => el.removeAttribute(attr));
      });
    }, 0);
    return () => clearTimeout(timer);
  }, []);
};

/* -------------------------------------------------------------------------- */
/*  Hover-dropdown hook (unchanged)                                           */
/* -------------------------------------------------------------------------- */

// const useHoverDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const handleMouseEnter = () => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     setIsOpen(true);
//   };
//   const handleMouseLeave = () => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(() => setIsOpen(false), 1000);
//     // setIsOpen(false);
//   };

//   return { isOpen, handleMouseEnter, handleMouseLeave };
// };

/* -------------------------------------------------------------------------- */
/*  SiteHeader component                                                      */
/* -------------------------------------------------------------------------- */
export function SiteHeader({
  activeSection,
  onNavigate,
  isSignedIn = false,
  onToggleAuth,
  user,
}: HeaderProps = {}) {
  // Run cleanup once
  useExtensionCleanup();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menu: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 300);
  };

  const handleNav = (id: string, e?: React.MouseEvent) => {
    setIsMenuOpen(false);
    setActiveMenu(null);

    if (onNavigate) {
      if (e) e.preventDefault();
      onNavigate(id);
    } else {
      // Fallback: Use router navigation if no handler is provided (e.g., in layout.tsx)
      const routes: Record<string, string> = {
        home: "/?section=home",
        journeys: "/?section=journeys",
        "ir1-journey": "/?section=ir1-journey",
        services: "/?section=services",
        tools: "/?section=tools",
        pricing: "/pricing",
        dashboard: "/user-dashboard",
        mfa: "/mfa-setup",
        contact: "/#contact",
        passport: "/passport",
        "passport-guide": "/guides/passport-guide",
        "nikah-nama-guide": "/guides/nikah-nama-guide",
        "visa-strength-guide": "/guides/visa-strength-guide",
        "frc-guide": "/guides/frc-guide",
        "educational-certificates-us-visa": "/guides/educational-certificates-us-visa",
        pdf: "/pdf-processing",
        signature: "/signature-image-processing",
        iv: "/iv-tool",
        forms: "/visa-forms",
        checker: "/visa-checker",
        "document-vault": "/document-vault",
        "affidavit-support-calculator": "/affidavit-support-calculator",
        "visa-eligibility": "/visa-eligibility",
        "Book Appintment": "/book-appointment",
        "Police Verification": "/police-verification",
        "document-translation": "/document-translation",
        "221g-action-planner": "/221g-action-planner",
        "visa-case-strength-checker": "/visa-case-strength-checker",
        "view-security-questions": "/view-security-questions",
        "courier-registration": "/courier-registration",
        "custom-requirements": "/custom-requirements",
        "interview-prep": "/interview-prep",
        profile : "/profile",
        settings: "/settings",
        "marriage-proof-guide": "/guides/bona-marriage-guide"
      };

      const targetRoute = routes[id] || "/";
      router.push(targetRoute);
    }
  };

  const isActive = (id: string, href?: string) => {
    if (activeSection && activeSection === id) return true;
    if (href && pathname === href) return true;
    return false;
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-lg py-2"
          : "bg-background py-4"
      } border-b border-border`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Desktop navigation */}
      {/* ------------------------------------------------------------------ */}
      <div className="container mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <HydrationSafeButton
            className="md:hidden text-foreground p-1 hover:bg-muted rounded-md transition-colors"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </HydrationSafeButton>

          {/* Brand/Logo */}
          <Link
            href="/"
            onClick={(e) => handleNav("home", e)}
            className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="152 220 710 215"
              className="h-8 w-auto text-rahvana-primary fill-current"
            >
              <path d="M194.478302,411.482117C188.648972,398.666321 181.184067,387.211884 174.078979,375.556946C161.946335,355.654999 154.218430,334.429535 152.466766,310.927032C150.965759,290.787415 151.490814,271.069061 158.657028,251.953415C161.906097,243.286591 167.372574,236.333282 175.068100,231.098938C187.972153,222.321823 212.377777,222.515015 222.031631,242.165817C226.003326,250.250381 232.154404,254.994858 241.386230,255.103607C240.874603,257.700470 239.210571,257.303253 238.057617,257.539734C214.604111,262.350281 200.098267,276.975067 192.363480,299.065857C184.921768,320.319672 187.555267,352.132874 198.628662,372.172211C195.346085,360.736084 194.548477,349.072571 194.585556,337.231354C194.686203,305.091156 209.071442,282.030487 237.587112,267.388245C252.463837,259.749298 268.363953,254.738281 283.791870,248.515182C300.024750,241.967392 315.867065,234.607849 330.889893,225.571030C331.848022,224.994675 332.727417,224.133804 334.330139,224.642090C334.086884,229.016586 332.356110,232.995224 331.110291,237.029678C325.877838,253.974487 319.356995,270.258270 307.731262,284.109070C295.584656,298.580475 279.797791,306.307983 261.751282,310.259583C255.743668,311.575104 249.729248,312.898682 243.795959,314.506500C229.390137,318.410126 220.388382,329.212219 218.286926,343.947327C216.575470,355.947906 217.905655,367.798737 218.737152,379.737518C219.623474,392.463135 221.756760,405.206818 219.303925,418.003387C217.963852,424.994537 214.710114,430.344635 207.688766,433.006439C204.303909,434.289673 202.544754,433.679260 201.368622,430.074707C199.358749,423.914886 196.908096,417.898895 194.478302,411.482117z"></path>
              <path d="M347.022308,320.000671C347.016052,314.839264 347.105347,310.174835 346.965759,305.517273C346.865234,302.162506 348.128204,300.629364 351.628418,300.734467C356.786560,300.889313 361.960175,300.922363 367.113922,300.699646C370.973633,300.532806 372.427643,301.928192 372.368347,305.879303C372.186157,318.023376 372.301971,330.171936 372.301971,342.083649C373.283447,342.867767 373.819183,342.426117 374.318726,342.006836C383.782745,334.063324 394.575775,332.615875 406.196838,335.633057C415.899536,338.152130 422.744904,346.587646 423.310516,356.622040C424.267090,373.593201 423.737030,390.584991 423.953217,407.566589C423.995270,410.868988 423.022247,412.495087 419.405853,412.347473C414.084778,412.130249 408.740967,412.096069 403.421997,412.329346C399.633331,412.495514 398.561127,410.970825 398.606415,407.354187C398.766998,394.531891 398.675171,381.706299 398.663269,368.881958C398.653717,358.575378 395.399567,354.366302 387.286011,354.116821C377.843262,353.826508 372.628845,358.719452 372.391693,368.828339C372.122253,380.313904 372.349670,391.810638 372.318054,403.302399C372.289795,413.578827 373.113983,412.175079 363.109467,412.274994C359.445770,412.311584 355.772827,412.113037 352.119568,412.309662C348.129639,412.524414 346.894379,410.660309 346.908722,406.924530C346.998840,383.444702 346.970551,359.964386 346.985443,336.484253C346.988831,331.156372 347.007996,325.828522 347.022308,320.000671z"></path>
              <path d="M320.909363,412.311096C317.090668,412.315186 313.737823,412.059113 310.437317,412.365967C305.318787,412.841858 301.746216,411.882538 302.918549,404.615967C295.871124,410.791656 288.552673,413.763123 280.156006,414.249451C254.958969,415.708740 237.504608,396.636383 239.498611,370.735535C239.781265,367.064178 240.334641,363.492889 241.348862,359.967224C249.310272,332.292297 281.741791,328.266632 299.022125,340.520233C300.048828,341.248291 300.767242,342.583801 302.297913,342.519531C303.777649,335.660950 303.777649,335.661041 311.217407,335.661530C315.046356,335.661774 318.896240,335.913361 322.698822,335.596771C327.228424,335.219635 328.372986,337.188049 328.342041,341.407928C328.185883,362.715698 328.266510,384.025238 328.261688,405.334137C328.260132,412.186127 328.256805,412.186127 320.909363,412.311096M301.669952,365.008423C295.854095,354.320007 283.816345,350.650452 274.124878,356.611633C264.651733,362.438538 261.929047,377.159515 268.562775,386.684814C274.734344,395.546509 288.041443,397.276093 296.853241,389.902008C304.682800,383.349915 304.819550,374.753296 301.669952,365.008423z"></path>
              <path d="M605.060913,373.000000C605.062988,384.657990 604.973816,395.817139 605.115417,406.973328C605.163574,410.764404 603.888367,412.517792 599.916382,412.297821C596.098145,412.086365 592.258423,412.278320 588.428223,412.263885C581.340210,412.237213 581.340271,412.228333 580.396484,405.534912C578.652649,405.182587 577.723206,406.577301 576.587097,407.410583C564.256653,416.454071 551.032898,416.485992 537.883057,410.164795C525.372864,404.151062 519.815430,393.082336 518.661011,379.565979C517.650513,367.735138 519.446167,356.688538 527.285583,347.204102C539.560242,332.353760 562.272705,329.781647 577.620483,341.553528C578.269348,342.051208 578.930420,342.532898 579.531860,342.981750C579.975769,342.721405 580.485229,342.552582 580.478455,342.407898C580.185974,336.163940 583.752686,335.041809 589.019958,335.614197C592.147156,335.954010 595.341675,335.664795 598.505798,335.677979C604.895813,335.704559 605.023010,335.813751 605.037109,342.023712C605.060242,352.182434 605.053894,362.341248 605.060913,373.000000M560.688660,354.010437C551.697937,354.960571 545.673096,359.988037 543.586243,368.281647C541.270569,377.484711 544.135803,386.858582 550.601074,391.231262C557.524597,395.913879 567.137268,395.721375 574.094788,390.760834C580.548767,386.159302 583.183777,376.489594 580.517395,367.191528C578.133301,358.877991 571.864624,354.512573 560.688660,354.010437z"></path>
              <path d="M791.203979,365.000000C791.216858,379.151947 791.068298,392.806946 791.330078,406.454102C791.419312,411.109009 789.796753,412.746704 785.268616,412.344116C781.965149,412.050415 778.614258,412.285797 775.284485,412.293915C768.156677,412.311279 768.156677,412.313538 767.357422,405.215393C764.213135,407.193054 761.370483,409.448242 758.167908,410.920929C733.721130,422.162598 707.000671,405.737396 705.710083,378.830902C705.135010,366.839264 706.926270,355.504913 715.175415,346.176605C727.394165,332.359222 748.536804,330.064270 763.725403,340.652008C764.770203,341.380341 765.547607,342.627289 767.044250,342.615326C768.603943,335.673187 768.603943,335.673187 776.271057,335.669495C791.293762,335.662231 791.290283,335.662231 791.225891,350.515137C791.205688,355.176697 791.210022,359.838379 791.203979,365.000000M768.573364,376.996460C769.015320,373.435791 768.214661,370.040833 767.117615,366.707123C764.123230,357.607910 755.689209,352.825104 745.305481,354.289215C737.101746,355.445923 731.056091,363.018951 730.341125,373.034027C729.616272,383.187927 734.786743,391.471527 743.217041,393.662537C755.729126,396.914307 764.723938,391.261047 768.573364,376.996460z"></path>
              <path d="M697.327026,399.984680C697.339050,412.311646 697.339050,412.311615 685.404663,412.283051C670.974670,412.248474 670.964172,412.248535 670.934204,397.847595C670.912354,387.349304 670.950134,376.850830 670.910339,366.352631C670.877319,357.649750 667.768311,354.120880 660.178406,354.030457C651.960327,353.932495 646.475220,358.640869 646.328003,366.479462C646.090149,379.139923 646.175232,391.806488 646.130127,404.470490C646.102478,412.239929 646.107666,412.248108 638.147339,412.267700C633.814819,412.278351 629.479553,412.159454 625.150574,412.280670C622.015259,412.368408 620.641907,411.190186 620.652283,407.922607C620.723999,385.259857 620.724670,362.596588 620.651917,339.933838C620.641296,336.624023 622.086670,335.543457 625.194092,335.645996C629.355530,335.783325 633.524902,335.671936 637.690918,335.677185C645.251038,335.686707 645.251038,335.689728 646.772644,342.860565C652.933044,338.273254 659.430969,334.844513 667.182312,334.359741C685.805542,333.194977 696.572632,343.763824 697.123047,358.999908C697.610107,372.480835 697.291077,385.990845 697.327026,399.984680z"></path>
              <path d="M462.865234,349.315674C466.810211,360.099579 470.616516,370.517090 474.916962,382.287018C479.384949,370.264709 483.446716,359.611023 487.304840,348.884125C492.050720,335.688873 491.977295,335.663025 505.813934,335.672577C509.450104,335.675079 513.086243,335.672974 516.388855,335.672974C517.832825,337.670685 516.935730,339.029816 516.375854,340.352936C506.968994,362.584229 497.464996,384.774902 488.184998,407.058929C486.539337,411.010712 484.388458,412.776581 479.977966,412.379303C475.350067,411.962463 470.655884,412.190247 465.993652,412.284424C463.688049,412.331024 462.271484,411.462463 461.363007,409.333313C451.367401,385.906311 441.325592,362.499023 431.328247,339.072754C431.024841,338.361816 431.069000,337.502533 430.862396,336.117645C439.559174,335.296478 447.964783,335.637482 456.359894,335.899841C458.206085,335.957550 458.559937,337.773163 459.088776,339.116821C460.368408,342.367920 461.522064,345.668579 462.865234,349.315674z"></path>
            </svg>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {/* <Link
              href="/"
              onClick={(e) => handleNav("home", e)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isActive("home", "/")
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              Home
            </Link> */}

            {/* Explore Journeys */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMenuEnter("journeys")}
              onMouseLeave={handleMenuLeave}
            >
              <HydrationSafeButton
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeMenu === "journeys"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                Explore Journeys
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${activeMenu === "journeys" ? "rotate-180" : ""}`}
                />
              </HydrationSafeButton>
            </div>

            {/* Toolbox */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMenuEnter("tools")}
              onMouseLeave={handleMenuLeave}
            >
              <HydrationSafeButton
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeMenu === "tools"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                Toolbox
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${activeMenu === "tools" ? "rotate-180" : ""}`}
                />
              </HydrationSafeButton>
            </div>

            {/* Guides */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMenuEnter("guides")}
              onMouseLeave={handleMenuLeave}
            >
              <HydrationSafeButton
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeMenu === "guides"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                Guides
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${activeMenu === "guides" ? "rotate-180" : ""}`}
                />
              </HydrationSafeButton>
            </div>

            {/* Services */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMenuEnter("services")}
              onMouseLeave={handleMenuLeave}
            >
              <HydrationSafeButton
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeMenu === "services"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${activeMenu === "services" ? "rotate-180" : ""}`}
                />
              </HydrationSafeButton>
            </div>

            <Link
              href="/pricing"
              onClick={(e) => handleNav("pricing", e)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isActive("pricing", "/pricing")
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-primary"
              }`}
            >
              Pricing
            </Link>

            {/* {isSignedIn && (
              <Link
                href="/user-dashboard"
                onClick={(e) => handleNav("user-dashboard", e)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive("dashboard", "/user-dashboard")
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                }`}
              >
                Dashboard
              </Link>
            )} */}

            <Link
              href="/#contact"
              onClick={(e) => handleNav("contact", e)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isActive("contact", "/#contact")
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-primary"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* --- GLOBAL MEGAMENU PLACEMENT --- */}
        <div
          className="absolute top-full left-0 right-0 max-w-7xl mx-auto px-6 pb-10 pointer-events-none"
          onMouseEnter={() => {
            if (activeMenu && activeMenu !== "profile") {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }
          }}
          onMouseLeave={handleMenuLeave}
        >
          <div className="pointer-events-auto">
            <AnimatePresence>
              {activeMenu === "journeys" && (
                <MegaMenu
                  key="journeys"
                  isOpen={true}
                  showSearch={true}
                  tabs={[
                    {
                      id: "family",
                      label: "Family & Protection",
                      categories: [
                        {
                          label: "Spouse/Partner",
                          items: [
                            {
                              icon: <Heart className="h-5 w-5" />,
                              title: "IR-1 / CR-1",
                              description: "Spouse of U.S. Citizen",
                              href: "#",
                              badge: "Live",
                            },
                            {
                              icon: <Briefcase className="h-5 w-5" />,
                              title: "K-1",
                              description: "Fiancé(e) of U.S. Citizen",
                              href: "/visa-category/ir-category",
                              badge: "Soon",
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "K-3",
                              description: "Spouse (short-separation option)",
                              href: "#", // No live path
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "IR-5",
                              description: "Parent of U.S. Citizen (21+)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "IR-2 / CR-2",
                              description: "Child of U.S. Citizen",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "IR-3 / IR-4 (and Hague variants)",
                              description: "Intercountry Adoption",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Family Preferences",
                          items: [
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "F-1",
                              description:
                                "Adult Child (Unmarried) of U.S. Citizen",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "F-2A",
                              description: "Spouse/Child of Green Card Holder",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "F-2B",
                              description:
                                "Adult Child (Unmarried) of Green Card Holder",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "F-3",
                              description:
                                "Adult Child (Married) of U.S. Citizen",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "F-4",
                              description: "Sibling of U.S. Citizen",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Humanitarian",
                          items: [
                            {
                              icon: <ShieldCheck className="h-5 w-5" />,
                              title: "Refugee",
                              description: "Refugee (USRAP)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <ShieldCheck className="h-5 w-5" />,
                              title: "Asylum",
                              description: "Asylum (typically filed in U.S.)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <ShieldCheck className="h-5 w-5" />,
                              title: "Parole",
                              description: "Humanitarian Parole (case-by-case)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: "work",
                      label: "Work & Business",
                      categories: [
                        {
                          label: "Pro Work",
                          items: [
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "H-1B",
                              description:
                                "Specialty Job (Tech / Engineer / Analyst)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "L-1A / L-1B",
                              description:
                                "Company Transfer (Manager / Specialist)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Talent",
                          items: [
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "O-1A / O-1B",
                              description:
                                "Extraordinary Talent (Science / Business / Arts)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "O-2",
                              description: "Support Staff for O-1",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Sports/Arts",
                          items: [
                            {
                              icon: <Activity className="h-5 w-5" />,
                              title: "P-1 / P-2 / P-3",
                              description: "Athlete / Entertainer / Tour Group",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Trade / Investment",
                          items: [
                            {
                              icon: <Building2 className="h-5 w-5" />,
                              title: "E-1",
                              description: "Treaty Trader",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "E-2",
                              description: "Treaty Investor",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Culture / Faith",
                          items: [
                            {
                              icon: <Heart className="h-5 w-5" />,
                              title: "R-1",
                              description: "Religious Worker",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "Q-1",
                              description: "Cultural Exchange (Work + Culture)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Media",
                          items: [
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "I",
                              description: "Journalist / Media",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Seasonal (Conditional)",
                          items: [
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "H-2A",
                              description:
                                "Seasonal Agriculture (eligibility list applies)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "H-2B",
                              description:
                                "Seasonal Non-Agriculture (eligibility list applies)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Training",
                          items: [
                            {
                              icon: <Globe className="h-5 w-5" />,
                              title: "H-3",
                              description:
                                "Trainee / Special Education Exchange",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: "green-cards",
                      label: "Work Green Cards",
                      categories: [
                        {
                          label: "High Impact",
                          items: [
                            {
                              icon: <Star className="h-5 w-5" />,
                              title: "EB-1",
                              description: "Extraordinary Ability / Top Talent",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Advanced",
                          items: [
                            {
                              icon: <Cpu className="h-5 w-5" />,
                              title: "EB-2",
                              description:
                                "Advanced Degree / Exceptional Ability",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Briefcase className="h-5 w-5" />,
                              title: "EB-2 (NIW Path)",
                              description: "National Interest Waiver (NIW)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Career",
                          items: [
                            {
                              icon: <Users className="h-5 w-5" />,
                              title: "EB-3",
                              description: "Skilled Worker / Professional",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Special",
                          items: [
                            {
                              icon: <Users className="h-5 w-5" />,
                              title: "EB-4",
                              description: "Special Immigrants (varies)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Investment",
                          items: [
                            {
                              icon: <Users className="h-5 w-5" />,
                              title: "EB-5",
                              description: "Investor Green Card",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Lottery",
                          items: [
                            {
                              icon: <Users className="h-5 w-5" />,
                              title: "DV",
                              description: "Diversity Visa (DV Lottery)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: "students",
                      label: "Students & Visitors",
                      categories: [
                        {
                          label: "Visit",
                          items: [
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "B-2",
                              description: "Tourism / Family Visit",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "B-1",
                              description: "Business Visitor",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Study",
                          items: [
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "F-1",
                              description: "University / College Student",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "F-2",
                              description: "Student Dependent",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "M-1",
                              description: "Vocational / Technical Student",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "M-2",
                              description: "Vocational Dependent",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          label: "Exchange",
                          items: [
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "J-1",
                              description: "Exchange Visitor (Programs)",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                            {
                              icon: <Camera className="h-5 w-5" />,
                              title: "J-2",
                              description: "Exchange Dependent",
                              href: "#",
                              badge: "Soon",
                              disabled: true,
                            },
                          ],
                        },
                      ],
                    },
                  ]}
                  footerLink={{
                    label: "Explore all journeys",
                    href: "/visa-category/ir-category",
                  }}
                />
              )}
              {activeMenu === "tools" && (
                <MegaMenu
                  key="tools"
                  isOpen={true}
                  tabs={[
                    {
                      id: "ai-planning",
                      label: "AI & Planning",
                      items: [
                        {
                          icon: <ShieldCheck className="h-5 w-5" />,
                          title: "CasePulse AI",
                          description:
                            "Instant AI case strength score + gaps to fix before NVC/Interview.",
                          href: "/visa-case-strength-checker",
                          badge: "Live",
                        },
                        {
                          icon: <Map className="h-5 w-5" />,
                          title: "221(g) Rescue Planner",
                          description:
                            "Step-by-step next moves after 221(g) or Administrative Processing.",
                          href: "/221g-action-planner",
                          badge: "Live",
                        },
                        {
                          icon: <FileText className="h-5 w-5" />,
                          title: "VisaPath Finder",
                          description:
                            "Quick quiz that points you to the right visa path + next steps.",
                          href: "/visa-eligibility",
                          badge: "Live",
                        },
                        {
                          icon: <ShieldCheck className="h-5 w-5" />,
                          title: "InterviewIQ",
                          description:
                            "Prepare smarter and deliver confident answers when it matters most.",
                          href: "/interview-prep",
                          badge: "Live",
                        },
                      ],
                    },
                    {
                      id: "money-sponsorship",
                      label: "Money & Sponsorship",
                      items: [
                        {
                          icon: <Layout className="h-5 w-5" />,
                          title: "SponsorReady",
                          description:
                            "Auto-check income/assets and tell you what you still need.",
                          href: "/affidavit-support-calculator",
                        },
                      ],
                    },
                    {
                      id: "tracking",
                      label: "Tracking",
                      items: [
                        {
                          icon: <Search className="h-5 w-5" />,
                          title: "QueueWatch (IV Scheduling)",
                          description:
                            "Track interview scheduling movement and trends by category.",
                          href: "#",
                          disabled: true,
                        },
                        {
                          icon: <Search className="h-5 w-5" />,
                          title: "BulletinBuddy",
                          description:
                            "Check your priority date progress against the Visa Bulletin.",
                          href: "/visa-checker",
                          badge: "Live",
                          disabled: false,
                        },
                      ],
                    },
                    {
                      id: "docs-pdfs",
                      label: "Docs & PDFs",
                      items: [
                        {
                          icon: <Camera className="h-5 w-5" />,
                          title: "PhotoPass",
                          description:
                            "Make a compliant passport/visa photo in minutes.",
                          href: "/passport",
                          badge: "Live",
                        },
                        {
                          icon: <Layers className="h-5 w-5" />,
                          title: "PDF ToolKit",
                          description:
                            "Merge • compress • convert • edit — all in one toolkit.",
                          href: "/pdf-processing",
                          badge: "Live",
                        },
                        {
                          icon: <FileText className="h-5 w-5" />,
                          title: "SignSnap",
                          description:
                            "Create a clean digital signature for your forms.",
                          href: "/signature-image-processing",
                        },
                      ],
                    },
                    {
                      id: "forms-automation",
                      label: "Forms & Automation",
                      items: [
                        {
                          icon: <FileText className="h-5 w-5" />,
                          title: "FormForge Autofill",
                          description:
                            "Auto-fills your official form and generates a ready-to-upload PDF.",
                          href: "/visa-forms",
                        },
                        // {
                        //   icon: <Zap className="h-5 w-5" />,
                        //   title: "IV Tool",
                        //   description: "Immigrant Visa automation",
                        //   href: "/iv-tool",
                        // },
                      ],
                    },
                    {
                      id: "storage",
                      label: "Storage & Organization",
                      items: [
                        {
                          icon: <Folder className="h-5 w-5" />,
                          title: "Document Vault",
                          description:
                            "Organize docs + build shareable packets when the embassy asks.",
                          href: "/document-vault",
                        },
                      ],
                    },
                  ]}
                  footerLink={{ label: "View all tools", href: "/tools" }}
                />
              )}
              {activeMenu === "guides" && (
                <MegaMenu
                  key="guides"
                  isOpen={true}
                  tabs={[
                    {
                      id: "pakistan-docs",
                      label: "Pakistan Docs",
                      items: [
                        {
                          icon: <FileText className="h-5 w-5" />,
                          title: "PCC Playbook — Sindh",
                          description:
                            "Sindh police certificate guide: requirements, steps, timelines, and common mistakes.",
                          href: "/guides/police-verification", // Assuming this links to custom requirements or similar
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Playbook — Punjab",
                          description:
                            "Punjab police certificate guide (service coming soon).",
                          href: "/guides/police-verification",
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Playbook — KPK",
                          description:
                            "KPK police certificate guide (service coming soon).",
                          href: "/guides/police-verification",
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Playbook — Balochistan",
                          description:
                            "Balochistan police certificate guide (service coming soon).",
                          href: "/guides/police-verification",
                        },
                        {
                          icon: <Globe className="h-5 w-5" />,
                          title: "Passport Guide",
                          description:
                            "Complete guide to obtaining or renewing your Pakistani passport.",
                          href: "/guides/passport-guide",
                          badge: "Live",
                        },
                        {
                          icon: <Heart className="h-5 w-5" />,
                          title: "Nikah Nama Guide",
                          description:
                            "How to obtain, fill, and register your Nikah Nama and NADRA MRC.",
                          href: "/guides/nikah-nama-guide",
                          badge: "Live",
                        },
                        {
                          icon: <ShieldCheck className="h-5 w-5" />,
                          title: "Bona Fide Marriage Guide",
                          description:
                            "Complete guide to proving a genuine marriage for IR1/CR1 spousal visas.",
                          href: "/guides/bona-marriage-guide",
                          badge: "Live",
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Reference Guide",
                          description:
                            "Comprehensive overview of Police Character Certificates for all provinces.",
                          href: "/guides/police-certificate",
                          badge: "Live",
                        },
                        {
                          icon: <Globe className="h-5 w-5" />,
                          title: "FRC Guide",
                          description:
                            "Complete guide to obtaining your Family Registration Certificate (FRC).",
                          href: "/guides/frc-guide",
                          badge: "Live",
                        },
                        {
                          icon: <BookOpen className="h-5 w-5" />,
                          title: "Education Certificate Guide",
                          description:
                            "Attestation (HEC/IBCC), WES evaluation, and US student visa requirements.",
                          href: "/guides/educational-certificates-us-visa",
                          badge: "Live",
                        },
                      ],
                    },
                  
                    {
                      id: "embassy-logistics",
                      label: "Embassy Logistics",
                      items: [
                        {
                          icon: <Map className="h-5 w-5" />,
                          title: "Courier & Passport Delivery Guide",
                          description:
                            "Register, choose delivery options, and troubleshoot common courier issues.",
                          href: "/guides/courier-registration",
                        },
                      ],
                    },
                    {
                      id: "arrival-travel",
                      label: "Arrival & Travel",
                      items: [
                        {
                          icon: <FileCheck className="h-5 w-5" />,
                          title: "Customs & Declarations Guide",
                          description:
                            "What to declare, what to avoid, and common pitfalls when traveling.",
                          href: "/guides/custom-requirements", // Placeholder
                        },
                      ],
                    },
                  ]}
                  footerLink={{ label: "Browse all guides", href: "#" }}
                />
              )}
              {activeMenu === "services" && (
                <MegaMenu
                  key="services"
                  isOpen={true}
                  tabs={[
                    {
                      id: "expert-help",
                      label: "Expert Help",
                      items: [
                        {
                          icon: <MessageSquare className="h-5 w-5" />,
                          title: "Book a Consultation",
                          description:
                            "Book a call — your first consult is free.",
                          href: "/book-appointment",
                        },
                        {
                          icon: <Users className="h-5 w-5" />,
                          title: "Expert Case Review",
                          description:
                            "Human review of your documents + a tailored improvement plan.",
                          href: "#",
                          badge: "Soon",
                        },
                      ],
                    },
                    {
                      id: "pakistan-docs-services",
                      label: "Pakistan Docs",
                      items: [
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Filing Service — Sindh",
                          description:
                            "Done-for-you police certificate filing for Sindh.",
                          href: "#",
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Filing Service — Punjab (Coming Soon)",
                          description:
                            "Join the waitlist for done-for-you PCC filing in Punjab.",
                          href: "#",
                          badge: "Soon",
                          disabled: true,
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title: "PCC Filing Service — KPK (Coming Soon)",
                          description:
                            "Join the waitlist for done-for-you PCC filing in KPK.",
                          href: "#",
                          badge: "Soon",
                          disabled: true,
                        },
                        {
                          icon: <Shield className="h-5 w-5" />,
                          title:
                            "PCC Filing Service — Balochistan (Coming Soon)",
                          description:
                            "Join the waitlist for done-for-you PCC filing in Balochistan.",
                          href: "#",
                          badge: "Soon",
                          disabled: true,
                        },
                      ],
                    },
                    {
                      id: "medical",
                      label: "Medical",
                      items: [
                        {
                          icon: <Heart className="h-5 w-5" />,
                          title: "Book Medical Appointment",
                          description:
                            "Book your panel physician medical exam appointment.",
                          href: "#",
                          badge: "Soon",
                          disabled: true,
                        },
                      ],
                    },
                    {
                      id: "documents",
                      label: "Documents",
                      items: [
                        {
                          icon: <FileUp className="h-5 w-5" />,
                          title: "Urdu → English Translation",
                          description:
                            "Request certified translation + formatting for submission.",
                          href: "/document-translation",
                        },
                      ],
                    },
                  ]}
                  footerLink={{
                    label: "Explore all services",
                    href: "/services",
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side – Search + Login */}

        <div className="flex items-center gap-3">
          {/* Theme Toggle (Logged Out / Shared) */}
          <HydrationSafeButton
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-transparent hover:bg-primary/10 p-2 rounded-md relative text-muted-foreground hover:text-primary"
            aria-label="Toggle Theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2 left-2" />
          </HydrationSafeButton>

          <HydrationSafeButton
            variant="outline"
            size="icon"
            aria-label="Search"
            className="bg-transparent hover:bg-primary/10 p-2 rounded-md text-muted-foreground hover:text-primary"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </HydrationSafeButton>

          {/* LOGIN / PROFILE toggle */}
          {isSignedIn ? (
            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter("profile")}
              onMouseLeave={handleMenuLeave}
            >
              <HydrationSafeButton className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 text-primary hover:bg-primary/20 transition-all shadow-sm">
                <UserIcon className="h-5 w-5" />
              </HydrationSafeButton>

              <AnimatePresence>
                {activeMenu === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-72 max-h-[80vh] overflow-y-auto rounded-xl shadow-xl border border-border bg-card z-50 transform origin-top-right"
                  >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <h3 className="font-bold text-foreground">
                        {user?.user_metadata?.full_name ||
                          user?.user_metadata?.name ||
                          "Valued User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.email || "No email available"}
                      </p>
                    </div>

                    {/* Section 1 */}
                    <div className="py-2 border-b border-border">
                      <button
                        onClick={() => handleNav("dashboard")}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <Layout className="w-4 h-4" />
                        My Dashboard
                      </button>
                      <button
                        onClick={() => handleNav("profile")}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNav("document-vault")}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <Folder className="w-4 h-4" />
                        Document Vault
                      </button>
                      <button
                        onClick={() => handleNav("services")}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <Tag className="w-4 h-4" />
                        My Services
                      </button>
                      <button
                        onClick={() => {}} // Placeholder
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <Lock className="w-4 h-4" />
                        Portal Locker
                      </button>

                      <button
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <div className="relative w-4 h-4">
                          <Sun className="absolute w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                        <span>Switch Theme</span>
                      </button>
                    </div>

                    {/* Section 2 */}
                    <div className="py-2 border-b border-border">
                      <button
                        onClick={() => handleNav("settings")}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </button>
                      <button
                        onClick={() => handleNav("view-security-questions")}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Security & Login
                      </button>
                      <button
                        onClick={() => {}} // Placeholder
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors text-sm font-medium"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                      </button>
                    </div>

                    {/* Footer - Sign Out */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onToggleAuth?.();
                          setActiveMenu(null);
                        }}
                        className="flex items-center gap-3 w-full py-2.5 px-5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <HydrationSafeButton
              onClick={() => onToggleAuth?.()}
              className="font-semibold text-white bg-primary hover:bg-primary/90 shadow-md px-6 py-2 rounded-lg transition-all"
            >
              LOGIN
            </HydrationSafeButton>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Sidebar Overlay */}
      {/* ------------------------------------------------------------------ */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-100 h-screen md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar Content */}
          <div className="absolute top-0 left-0 bottom-0 w-70 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              {/* <Link
                href="/"
                onClick={(e) => handleNav("home", e)}
                className="flex items-center gap-2 group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-lg shadow-primary/20 text-white font-bold text-lg">
                  R
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  Rahvana
                </span>
              </Link> */}
              <Link
                href="/"
                onClick={(e) => handleNav("home", e)}
                className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="152 220 710 215"
                  className="h-8 w-auto text-rahvana-primary fill-current"
                >
                  <path d="M194.478302,411.482117C188.648972,398.666321 181.184067,387.211884 174.078979,375.556946C161.946335,355.654999 154.218430,334.429535 152.466766,310.927032C150.965759,290.787415 151.490814,271.069061 158.657028,251.953415C161.906097,243.286591 167.372574,236.333282 175.068100,231.098938C187.972153,222.321823 212.377777,222.515015 222.031631,242.165817C226.003326,250.250381 232.154404,254.994858 241.386230,255.103607C240.874603,257.700470 239.210571,257.303253 238.057617,257.539734C214.604111,262.350281 200.098267,276.975067 192.363480,299.065857C184.921768,320.319672 187.555267,352.132874 198.628662,372.172211C195.346085,360.736084 194.548477,349.072571 194.585556,337.231354C194.686203,305.091156 209.071442,282.030487 237.587112,267.388245C252.463837,259.749298 268.363953,254.738281 283.791870,248.515182C300.024750,241.967392 315.867065,234.607849 330.889893,225.571030C331.848022,224.994675 332.727417,224.133804 334.330139,224.642090C334.086884,229.016586 332.356110,232.995224 331.110291,237.029678C325.877838,253.974487 319.356995,270.258270 307.731262,284.109070C295.584656,298.580475 279.797791,306.307983 261.751282,310.259583C255.743668,311.575104 249.729248,312.898682 243.795959,314.506500C229.390137,318.410126 220.388382,329.212219 218.286926,343.947327C216.575470,355.947906 217.905655,367.798737 218.737152,379.737518C219.623474,392.463135 221.756760,405.206818 219.303925,418.003387C217.963852,424.994537 214.710114,430.344635 207.688766,433.006439C204.303909,434.289673 202.544754,433.679260 201.368622,430.074707C199.358749,423.914886 196.908096,417.898895 194.478302,411.482117z"></path>
                  <path d="M347.022308,320.000671C347.016052,314.839264 347.105347,310.174835 346.965759,305.517273C346.865234,302.162506 348.128204,300.629364 351.628418,300.734467C356.786560,300.889313 361.960175,300.922363 367.113922,300.699646C370.973633,300.532806 372.427643,301.928192 372.368347,305.879303C372.186157,318.023376 372.301971,330.171936 372.301971,342.083649C373.283447,342.867767 373.819183,342.426117 374.318726,342.006836C383.782745,334.063324 394.575775,332.615875 406.196838,335.633057C415.899536,338.152130 422.744904,346.587646 423.310516,356.622040C424.267090,373.593201 423.737030,390.584991 423.953217,407.566589C423.995270,410.868988 423.022247,412.495087 419.405853,412.347473C414.084778,412.130249 408.740967,412.096069 403.421997,412.329346C399.633331,412.495514 398.561127,410.970825 398.606415,407.354187C398.766998,394.531891 398.675171,381.706299 398.663269,368.881958C398.653717,358.575378 395.399567,354.366302 387.286011,354.116821C377.843262,353.826508 372.628845,358.719452 372.391693,368.828339C372.122253,380.313904 372.349670,391.810638 372.318054,403.302399C372.289795,413.578827 373.113983,412.175079 363.109467,412.274994C359.445770,412.311584 355.772827,412.113037 352.119568,412.309662C348.129639,412.524414 346.894379,410.660309 346.908722,406.924530C346.998840,383.444702 346.970551,359.964386 346.985443,336.484253C346.988831,331.156372 347.007996,325.828522 347.022308,320.000671z"></path>
                  <path d="M320.909363,412.311096C317.090668,412.315186 313.737823,412.059113 310.437317,412.365967C305.318787,412.841858 301.746216,411.882538 302.918549,404.615967C295.871124,410.791656 288.552673,413.763123 280.156006,414.249451C254.958969,415.708740 237.504608,396.636383 239.498611,370.735535C239.781265,367.064178 240.334641,363.492889 241.348862,359.967224C249.310272,332.292297 281.741791,328.266632 299.022125,340.520233C300.048828,341.248291 300.767242,342.583801 302.297913,342.519531C303.777649,335.660950 303.777649,335.661041 311.217407,335.661530C315.046356,335.661774 318.896240,335.913361 322.698822,335.596771C327.228424,335.219635 328.372986,337.188049 328.342041,341.407928C328.185883,362.715698 328.266510,384.025238 328.261688,405.334137C328.260132,412.186127 328.256805,412.186127 320.909363,412.311096M301.669952,365.008423C295.854095,354.320007 283.816345,350.650452 274.124878,356.611633C264.651733,362.438538 261.929047,377.159515 268.562775,386.684814C274.734344,395.546509 288.041443,397.276093 296.853241,389.902008C304.682800,383.349915 304.819550,374.753296 301.669952,365.008423z"></path>
                  <path d="M605.060913,373.000000C605.062988,384.657990 604.973816,395.817139 605.115417,406.973328C605.163574,410.764404 603.888367,412.517792 599.916382,412.297821C596.098145,412.086365 592.258423,412.278320 588.428223,412.263885C581.340210,412.237213 581.340271,412.228333 580.396484,405.534912C578.652649,405.182587 577.723206,406.577301 576.587097,407.410583C564.256653,416.454071 551.032898,416.485992 537.883057,410.164795C525.372864,404.151062 519.815430,393.082336 518.661011,379.565979C517.650513,367.735138 519.446167,356.688538 527.285583,347.204102C539.560242,332.353760 562.272705,329.781647 577.620483,341.553528C578.269348,342.051208 578.930420,342.532898 579.531860,342.981750C579.975769,342.721405 580.485229,342.552582 580.478455,342.407898C580.185974,336.163940 583.752686,335.041809 589.019958,335.614197C592.147156,335.954010 595.341675,335.664795 598.505798,335.677979C604.895813,335.704559 605.023010,335.813751 605.037109,342.023712C605.060242,352.182434 605.053894,362.341248 605.060913,373.000000M560.688660,354.010437C551.697937,354.960571 545.673096,359.988037 543.586243,368.281647C541.270569,377.484711 544.135803,386.858582 550.601074,391.231262C557.524597,395.913879 567.137268,395.721375 574.094788,390.760834C580.548767,386.159302 583.183777,376.489594 580.517395,367.191528C578.133301,358.877991 571.864624,354.512573 560.688660,354.010437z"></path>
                  <path d="M791.203979,365.000000C791.216858,379.151947 791.068298,392.806946 791.330078,406.454102C791.419312,411.109009 789.796753,412.746704 785.268616,412.344116C781.965149,412.050415 778.614258,412.285797 775.284485,412.293915C768.156677,412.311279 768.156677,412.313538 767.357422,405.215393C764.213135,407.193054 761.370483,409.448242 758.167908,410.920929C733.721130,422.162598 707.000671,405.737396 705.710083,378.830902C705.135010,366.839264 706.926270,355.504913 715.175415,346.176605C727.394165,332.359222 748.536804,330.064270 763.725403,340.652008C764.770203,341.380341 765.547607,342.627289 767.044250,342.615326C768.603943,335.673187 768.603943,335.673187 776.271057,335.669495C791.293762,335.662231 791.290283,335.662231 791.225891,350.515137C791.205688,355.176697 791.210022,359.838379 791.203979,365.000000M768.573364,376.996460C769.015320,373.435791 768.214661,370.040833 767.117615,366.707123C764.123230,357.607910 755.689209,352.825104 745.305481,354.289215C737.101746,355.445923 731.056091,363.018951 730.341125,373.034027C729.616272,383.187927 734.786743,391.471527 743.217041,393.662537C755.729126,396.914307 764.723938,391.261047 768.573364,376.996460z"></path>
                  <path d="M697.327026,399.984680C697.339050,412.311646 697.339050,412.311615 685.404663,412.283051C670.974670,412.248474 670.964172,412.248535 670.934204,397.847595C670.912354,387.349304 670.950134,376.850830 670.910339,366.352631C670.877319,357.649750 667.768311,354.120880 660.178406,354.030457C651.960327,353.932495 646.475220,358.640869 646.328003,366.479462C646.090149,379.139923 646.175232,391.806488 646.130127,404.470490C646.102478,412.239929 646.107666,412.248108 638.147339,412.267700C633.814819,412.278351 629.479553,412.159454 625.150574,412.280670C622.015259,412.368408 620.641907,411.190186 620.652283,407.922607C620.723999,385.259857 620.724670,362.596588 620.651917,339.933838C620.641296,336.624023 622.086670,335.543457 625.194092,335.645996C629.355530,335.783325 633.524902,335.671936 637.690918,335.677185C645.251038,335.686707 645.251038,335.689728 646.772644,342.860565C652.933044,338.273254 659.430969,334.844513 667.182312,334.359741C685.805542,333.194977 696.572632,343.763824 697.123047,358.999908C697.610107,372.480835 697.291077,385.990845 697.327026,399.984680z"></path>
                  <path d="M462.865234,349.315674C466.810211,360.099579 470.616516,370.517090 474.916962,382.287018C479.384949,370.264709 483.446716,359.611023 487.304840,348.884125C492.050720,335.688873 491.977295,335.663025 505.813934,335.672577C509.450104,335.675079 513.086243,335.672974 516.388855,335.672974C517.832825,337.670685 516.935730,339.029816 516.375854,340.352936C506.968994,362.584229 497.464996,384.774902 488.184998,407.058929C486.539337,411.010712 484.388458,412.776581 479.977966,412.379303C475.350067,411.962463 470.655884,412.190247 465.993652,412.284424C463.688049,412.331024 462.271484,411.462463 461.363007,409.333313C451.367401,385.906311 441.325592,362.499023 431.328247,339.072754C431.024841,338.361816 431.069000,337.502533 430.862396,336.117645C439.559174,335.296478 447.964783,335.637482 456.359894,335.899841C458.206085,335.957550 458.559937,337.773163 459.088776,339.116821C460.368408,342.367920 461.522064,345.668579 462.865234,349.315674z"></path>
                </svg>
              </Link>
              <HydrationSafeButton
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </HydrationSafeButton>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col px-4 gap-1">
                {/* <HydrationSafeButton
                  onClick={() => handleNav("home")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive("home", "/")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="font-bold">Home</span>
                </HydrationSafeButton> */}

                {/* Visa Category Section */}
                <div className="mt-2">
                  <HydrationSafeButton
                    onClick={() => {
                      const section = "visa";
                      setExpandedSections((prev) =>
                        prev.includes(section)
                          ? prev.filter((s) => s !== section)
                          : [...prev, section],
                      );
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 opacity-60" />
                      <span className="font-bold">Visa Category</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedSections.includes("visa") ? "rotate-180" : ""
                      }`}
                    />
                  </HydrationSafeButton>
                  {expandedSections.includes("visa") && (
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                      <HydrationSafeButton
                        onClick={() => handleNav("ir1-journey")}
                        className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${
                          isActive("ir1-journey")
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                      >
                        IR Category
                      </HydrationSafeButton>
                    </div>
                  )}
                </div>

                {/* Services Section */}
                <div className="mt-2">
                  <HydrationSafeButton
                    onClick={() => {
                      const section = "services";
                      setExpandedSections((prev) =>
                        prev.includes(section)
                          ? prev.filter((s) => s !== section)
                          : [...prev, section],
                      );
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 opacity-60" />
                      <span className="font-bold">Services</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedSections.includes("services")
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </HydrationSafeButton>
                  {expandedSections.includes("services") && (
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                      <HydrationSafeButton
                        onClick={() => handleNav("services")}
                        className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${
                          isActive("services")
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                      >
                        Consultancy
                      </HydrationSafeButton>
                    </div>
                  )}
                </div>

                {/* Tools Section */}
                <div className="mt-2">
                  <HydrationSafeButton
                    onClick={() => {
                      const section = "tools";
                      setExpandedSections((prev) =>
                        prev.includes(section)
                          ? prev.filter((s) => s !== section)
                          : [...prev, section],
                      );
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 opacity-60" />
                      <span className="font-bold">Tools</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedSections.includes("tools") ? "rotate-180" : ""
                      }`}
                    />
                  </HydrationSafeButton>
                  {expandedSections.includes("tools") && (
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-border pl-4">
                      {[
                        { id: "passport", label: "Passport Photo" },
                        { id: "pdf", label: "PDF Processing" },
                        { id: "signature", label: "Create Signature" },
                        { id: "iv", label: "IV Tool" },
                        { id: "forms", label: "Auto Form Filling" },
                        { id: "checker", label: "Visa Bulletin Checker" },
                        { id: "document-vault", label: "Document Vault" },
                        {
                          id: "visa-eligibility",
                          label: "Visa Eligibility Checker",
                        },
                        {
                          id: "affidavit-support-calculator",
                          label: "Affidavit Support Calculator",
                        },
                        {
                          id: "document-translation",
                          label: "Document Translation",
                        },
                      ].map((item) => (
                        <HydrationSafeButton
                          key={item.id}
                          onClick={() => handleNav(item.id)}
                          className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${
                            isActive(item.id)
                              ? "text-primary font-semibold bg-primary/5"
                              : "text-muted-foreground hover:text-primary hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </HydrationSafeButton>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Guides Section */}
                <div className="mt-2">
                  <HydrationSafeButton
                    onClick={() => {
                      const section = "guides";
                      setExpandedSections((prev) =>
                        prev.includes(section)
                          ? prev.filter((s) => s !== section)
                          : [...prev, section],
                      );
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 opacity-60" />
                      <span className="font-bold">Guides</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedSections.includes("guides") ? "rotate-180" : ""
                      }`}
                    />
                  </HydrationSafeButton>
                  {expandedSections.includes("guides") && (
                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                      {[
                        { id: "passport-guide", label: "Passport Guide" },
                        { id: "nikah-nama-guide", label: "Nikah Nama Guide" },
                        { id: "educational-certificates-us-visa", label: "Education Guide" },
                      ].map((item) => (
                        <HydrationSafeButton
                          key={item.id}
                          onClick={() => handleNav(item.id)}
                          className={`px-4 py-2 rounded-lg text-sm text-left transition-all ${
                            isActive(item.id)
                              ? "text-[#0d9488] font-semibold bg-[#0d9488]/5"
                              : "text-slate-500 hover:text-[#0d9488] hover:bg-slate-50"
                          }`}
                        >
                          {item.label}
                        </HydrationSafeButton>
                      ))}
                    </div>
                  )}
                </div>

                {/* <div className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">General</div> */}
                <HydrationSafeButton
                  onClick={() => handleNav("pricing")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive("pricing")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="font-bold">Pricing</span>
                </HydrationSafeButton>
                {isSignedIn && (
                  <>
                    <HydrationSafeButton
                      onClick={() => handleNav("dashboard")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive("dashboard", "/user-dashboard")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Layout className="w-5 h-5 opacity-60" />
                      <span className="font-bold">My Dashboard</span>
                    </HydrationSafeButton>
                    <HydrationSafeButton
                      onClick={() => handleNav("profile")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive("profile", "/profile")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <UserIcon className="w-5 h-5 opacity-60" />
                      <span className="font-bold">My Profile</span>
                    </HydrationSafeButton>
                    <HydrationSafeButton
                      onClick={() => handleNav("settings")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive("settings", "/settings")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Settings className="w-5 h-5 opacity-60" />
                      <span className="font-bold">Account Settings</span>
                    </HydrationSafeButton>
                  </>
                )}
                <HydrationSafeButton
                  onClick={() => handleNav("contact")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive("contact")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="font-bold">Contact</span>
                </HydrationSafeButton>
              </nav>
            </div>

            <div className="p-6 border-t bg-slate-50">
              <HydrationSafeButton
                onClick={() => {
                  onToggleAuth?.();
                  setIsMenuOpen(false);
                }}
                className="w-full py-4 rounded-xl bg-[#0d9488] text-white font-bold shadow-lg hover:bg-[#0f766e] transition-all"
              >
                {isSignedIn ? "Sign Out" : "Login"}
              </HydrationSafeButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
