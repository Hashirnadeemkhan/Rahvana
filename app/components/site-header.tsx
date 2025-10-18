
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-gradient-to-r from-blue-50 via-white to-blue-50 backdrop-blur-lg shadow-md">
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
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-all"
            >
              HOME
            </Link>

            {/* Visa Category dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Link href={"/visa-category"}><Button
                  variant="outline"
                  size="sm"
                  className="font-medium bg-transparent text-gray-700 hover:text-blue-600 hover:bg-blue-100 border-gray-300 data-[state=open]:bg-blue-600 data-[state=open]:text-white transition-all"
                >
                  VISA CATEGORY 
                </Button>
              </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-xl shadow-xl border border-gray-200">
                <DropdownMenuLabel className="font-semibold text-blue-700">Explore Visas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#ir-category" className="text-gray-600 hover:text-blue-600">IR Category</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>More coming soon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Service dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium bg-transparent text-gray-700 hover:text-blue-600 hover:bg-blue-100 border-gray-300 data-[state=open]:bg-blue-600 data-[state=open]:text-white transition-all"
                >
                  SERVICE 
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-xl shadow-xl border border-gray-200">
                <DropdownMenuLabel className="font-semibold text-blue-700">Services</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#consultancy" className="text-gray-600 hover:text-blue-600">Consultancy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>More coming soon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="#contact"
              className="rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-all"
            >
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Right: Search + Login */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Search"
            className="bg-transparent hover:bg-blue-100 transition-all"
          >
            <Search className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </Button>
          <Button className="font-semibold text-white shadow-md hover:bg-primary/90  transition-all">
            LOGIN
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden container mx-auto px-4 pb-3 flex flex-wrap items-center gap-2 justify-center">
        <Link
          href="/"
          className="border rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all"
        >
          HOME
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="font-medium bg-transparent text-gray-700">
              VISA CATEGORY ↓
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="#ir-category" className="text-gray-600 hover:text-blue-600">IR Category</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>More coming soon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="font-medium bg-transparent text-gray-700">
              SERVICE ↓
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="#consultancy" className="text-gray-600 hover:text-blue-600">Consultancy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>More coming soon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="#contact"
          className="border rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all"
        >
          CONTACT
        </Link>
      </div>
    </header>
  )
}
