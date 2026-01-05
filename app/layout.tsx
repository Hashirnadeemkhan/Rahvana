import type { Metadata } from 'next';
import './globals.css';
import { ClientHeader } from './components/layout/ClientHeader';
import { AuthProvider } from './context/AuthContext';
import { ClientWidgets } from './components/layout/ClientWidgets';
import Footer from './components/layout/Footer';


export const metadata: Metadata = {
  title: 'Immigration Assistant',
  description: 'Automate immigration form filling',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className='bg-background'>
        <AuthProvider>
          <ClientHeader />
          {children}
        <ClientWidgets />

<Footer />
        </AuthProvider>
      </body>
    </html>
  );
}