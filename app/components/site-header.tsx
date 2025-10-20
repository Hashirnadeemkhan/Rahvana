"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, FileText } from "lucide-react"

export function SiteHeader() {
  // Hover delay fix — common for both menus
  const useHoverDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsOpen(true)
    }

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 800)
    }

    return { isOpen, setIsOpen, handleMouseEnter, handleMouseLeave }
  }

  const visaMenu = useHoverDropdown()
  const serviceMenu = useHoverDropdown()

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-white to-primary/10 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Left: Brand and primary nav */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-lg font-bold bg-primary text-white shadow-md hover:bg-primary/90 transition-all duration-200"
          >
            RAHVANA
          </Link>

          <nav className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 text-gray-700 hover:text-primary transition-all"
            >
              HOME
            </Link>

            {/* ===== VISA CATEGORY (Hover Dropdown) ===== */}
            <div className="relative" onMouseEnter={visaMenu.handleMouseEnter} onMouseLeave={visaMenu.handleMouseLeave}>
              <DropdownMenu open={visaMenu.isOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 font-medium bg-transparent text-gray-700 hover:text-primary hover:bg-primary/10 data-[state=open]:bg-primary data-[state=open]:text-white transition-all group"
                  >
                    VISA CATEGORY
                    <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className=" shadow-xl border border-gray-200 w-56 mt-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  onMouseEnter={visaMenu.handleMouseEnter}
                  onMouseLeave={visaMenu.handleMouseLeave}
                >
                  <DropdownMenuLabel className="font-semibold text-primary">Explore Visas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/visa-category/ir-category"
                      className="flex items-center justify-between w-full text-gray-600 hover:text-primary p-2 rounded transition-all hover:bg-primary/10"
                    >
                      IR Category
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed">
                    More coming soon...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ===== SERVICE (Hover Dropdown) ===== */}
            <div
              className="relative"
              onMouseEnter={serviceMenu.handleMouseEnter}
              onMouseLeave={serviceMenu.handleMouseLeave}
            >
              <DropdownMenu open={serviceMenu.isOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 font-medium bg-transparent text-gray-700 hover:text-primary hover:bg-primary/10 border-gray-300 data-[state=open]:bg-primary data-[state=open]:text-white transition-all group"
                  >
                    SERVICES
                    <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="rounded-xl shadow-xl border border-gray-200 w-56 mt-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  onMouseEnter={serviceMenu.handleMouseEnter}
                  onMouseLeave={serviceMenu.handleMouseLeave}
                >
                  <DropdownMenuLabel className="font-semibold text-primary">Our Services</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/services"
                      className="flex items-center justify-between w-full text-gray-600 hover:text-primary p-2 rounded transition-all hover:bg-primary/10"
                    >
                      Consultancy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed">
                    More coming soon...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link
              href="#contact"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/10 text-gray-700 hover:text-primary transition-all"
            >
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Right: Search + PDF Processing + Login */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <Button
            variant="outline"
            size="icon"
            aria-label="Search"
            className="bg-transparent hover:bg-primary/10 transition-all"
          >
            <Search className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </Button>

          {/* PDF Processing Button */}
          <Link href="/pdf-processing">
            <Button className="flex items-center gap-2 font-semibold bg-primary text-white shadow-md hover:bg-primary/90 transition-all">
              <FileText className="h-4 w-4" />
              PDF Processing
            </Button>
          </Link>

          {/* Login Button */}
          <Button className="font-semibold text-white shadow-md hover:bg-primary/90 transition-all">
            LOGIN
          </Button>
        </div>
      </div>

      {/* ===== MOBILE NAVIGATION ===== */}
      <div className="md:hidden container mx-auto px-4 pb-3 flex flex-wrap items-center gap-2 justify-center">
        <Link
          href="/"
          className="border rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-all"
        >
          HOME
        </Link>

        {/* Mobile Visa Dropdown - click based */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 font-medium bg-transparent text-gray-700 border rounded-md px-3 py-2"
            >
              VISA CATEGORY
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/visa-category/ir-category" className="text-gray-600 hover:text-primary">
                IR Category
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>More coming soon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Service Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 font-medium bg-transparent text-gray-700 border rounded-md px-3 py-2"
            >
              SERVICES
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/services" className="text-gray-600 hover:text-primary">
                Consultancy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>More coming soon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="#contact"
          className="border rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-all"
        >
          CONTACT
        </Link>
      </div>
    </header>
  )
}
