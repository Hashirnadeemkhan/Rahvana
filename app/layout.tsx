import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from './components/site-header';
import { AuthProvider } from './context/AuthContext';
import { FloatingChatWidget } from './components/floating-chat-widget';


export const metadata: Metadata = {
  title: 'Immigration Assistant',
  description: 'Automate immigration form filling',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteHeader />
          {children}
        <FloatingChatWidget />

        </AuthProvider>
      </body>
    </html>
  );
}