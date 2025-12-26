import React, { useState } from 'react';

interface HeaderProps {
    activeSection: string;
    onNavigate: (section: string) => void;
    isSignedIn: boolean;
    onToggleAuth: () => void;
}


export function Header({ activeSection, onNavigate, isSignedIn, onToggleAuth }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { id: 'home', label: 'Home' },
        { id: 'journeys', label: 'Visa Category' },
        { id: 'tools', label: 'Tools' },
        { id: 'pricing', label: 'Pricing' },
    ];

    if (isSignedIn) {
        menuItems.push({ id: 'dashboard', label: 'Dashboard' });
    }

    return (
        <>
            <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-[100] shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
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
                            className="text-2xl font-bold text-[#0d9488] no-underline flex items-center gap-2"
                            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                        >
                            <span role="img" aria-label="passport">🛂</span> Rahvana
                        </a>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {menuItems.map((item) => (
                            <a 
                                key={item.id}
                                href="#" 
                                onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                                className={`text-[15px] font-medium no-underline transition-colors hover:text-[#0d9488] ${
                                    activeSection === item.id ? 'text-[#0d9488]' : 'text-slate-800'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <button 
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer text-[13px] font-medium transition-all hover:border-[#0d9488] hover:bg-[#ebf5f4] text-slate-800 whitespace-nowrap"
                        onClick={onToggleAuth}
                    >
                        {isSignedIn ? 'View as Guest' : 'View as Signed-In'}
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 z-[110] bg-black/50 transition-opacity duration-300 md:hidden ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside 
                className={`fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[120] shadow-xl transition-transform duration-300 md:hidden flex flex-col ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                    <span className="text-xl font-bold text-[#0d9488] flex items-center gap-2">
                        <span role="img" aria-label="passport">🛂</span> Rahvana
                    </span>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-slate-500 p-1 hover:bg-slate-50 rounded-md transition-colors"
                        aria-label="Close menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <nav className="p-4 flex flex-col gap-2 overflow-y-auto flex-grow">
                    {menuItems.map((item) => (
                        <a 
                            key={item.id}
                            href="#" 
                            className={`p-3 rounded-lg text-slate-800 no-underline font-medium transition-colors hover:bg-slate-50 ${
                                activeSection === item.id ? 'bg-[#ebf5f4] text-[#0d9488]' : ''
                            }`}
                            onClick={(e) => { 
                                e.preventDefault(); 
                                onNavigate(item.id);
                                setIsMenuOpen(false);
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button 
                        className="w-full px-4 py-3 bg-[#0d9488] text-white rounded-lg font-bold shadow-md hover:bg-[#0f766e] transition-colors"
                        onClick={() => {
                            onToggleAuth();
                            setIsMenuOpen(false);
                        }}
                    >
                        {isSignedIn ? 'Switch to Guest Mode' : 'Sign In Now'}
                    </button>
                </div>
            </aside>
        </>
    );
}
