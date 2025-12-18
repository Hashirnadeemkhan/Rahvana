import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from './components/layout/SiteHeader';
import { AuthProvider } from './context/AuthContext';
import { ClientWidgets } from './components/layout/ClientWidgets';


export const metadata: Metadata = {
  title: 'Immigration Assistant',
  description: 'Automate immigration form filling',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SiteHeader />
          {children}
        <ClientWidgets />

        </AuthProvider>
      </body>
    </html>
  );
}