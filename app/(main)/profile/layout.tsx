import { ReactNode } from 'react';

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/profile" 
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    My Profile
                  </a>
                </li>
                <li>
                  <a 
                    href="/settings" 
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a 
                    href="/user-dashboard" 
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    Dashboard
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
