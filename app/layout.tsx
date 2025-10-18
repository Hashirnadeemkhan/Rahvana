import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from './components/site-header';


export const metadata: Metadata = {
  title: 'Immigration Assistant',
  description: 'Automate immigration form filling',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <SiteHeader />
        {children}
      </body>
    </html>
  );
}