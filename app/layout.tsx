import type { Metadata } from "next";
import "./globals.css";
import { ClientHeader } from "./components/layout/ClientHeader";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import { ClientWidgets } from "./components/layout/ClientWidgets";
import Footer from "./components/layout/Footer";

export const metadata: Metadata = {
  title: "Immigration Assistant",
  description: "Automate immigration form filling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-background">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientHeader />
            {children}
            <ClientWidgets />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
