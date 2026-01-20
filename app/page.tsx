"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
// import { Header } from './test/components/Header';
import { Wizard } from './test/components/Wizard';
import { Dashboard } from './test/components/Dashboard';
import { HomeSection, VisaCategorySection, ToolsSection, PricingSection, IR1JourneyDetail } from './test/components/StaticSections';
import { useWizard } from './(main)/dashboard/hooks/useWizard';
import GetInTouch from '@/app/components/HomePage/GetInTouch';



export default function HomePage() {
    return (
        <Suspense fallback={<div className='flex items-center justify-center h-screen'>Loading...</div>}>
            <HomePageContent />
        </Suspense>
    );
}

function HomePageContent() {
    const [activeSection, setActiveSection] = useState('home');
    const searchParams = useSearchParams();
    
    // Listen for section changes in URL
    useEffect(() => {
        const section = searchParams.get('section');
        if (section) {
            setActiveSection(section);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchParams]);
    const [isSignedIn, setIsSignedIn] = useState(false);
        
        // Lifted wizard state to share with Dashboard
        const { state, actions, isLoaded } = useWizard();
    
        const handleNavigate = (section: string) => {
            setActiveSection(section);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    
        const handleToggleAuth = () => {
            setIsSignedIn(!isSignedIn);
        };
    
        const handleStartJourney = () => {
            if (!isSignedIn) {
                handleToggleAuth();
            }
            setActiveSection('ir1-journey');
        };
    
        // Auto-redirect to dashboard on login if explicitly toggled there?
        // The original app didn't do this, just showed the link. We'll keep it simple.
    
        return (
            <div className="min-h-screen bg-background font-sans text-slate-800">
                {/* <Header 
                    activeSection={activeSection} 
                    onNavigate={handleNavigate}
                    isSignedIn={isSignedIn}
                    onToggleAuth={handleToggleAuth}
                /> */}
    
                <main className="min-h-[calc(100vh-200px)]">
                    {activeSection === 'home' && (
                        <>
                            <HomeSection onNavigate={handleNavigate} isSignedIn={isSignedIn} />
                            <GetInTouch />
                        </>
                    )}
    
                    {activeSection === 'journeys' && (
                        <VisaCategorySection onNavigate={handleNavigate} />
                    )}
    
                    {activeSection === 'ir1-journey' && (
                        <IR1JourneyDetail isSignedIn={isSignedIn} onToggleAuth={handleToggleAuth} onStart={handleStartJourney}>
                            <Wizard state={state} actions={actions} isLoaded={isLoaded} />
                        </IR1JourneyDetail>
                    )}
    
                    {activeSection === 'tools' && (
                        <ToolsSection />
                    )}
    
                    {activeSection === 'pricing' && (
                        <PricingSection />
                    )}
    
                    {activeSection === 'dashboard' && (
                        <Dashboard 
                            state={state} 
                            isSignedIn={isSignedIn} 
                            onContinue={() => handleNavigate('ir1-journey')}
                            onNavigate={handleNavigate}
                            onToggleAuth={handleToggleAuth}
                        />
                    )}
                </main>
    
                {/* <Footer /> */}
            </div>
        
    // <div className="min-h-screen flex flex-col bg-white text-gray-800">
      
      

    //   {/* Main Content */}
    //   <main className="flex-1">
    //     {/* Tagline Section */}
    //     <section className="container mx-auto px-6 py-16 md:py-24">
    //       <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-md rounded-2xl p-8 md:p-12 text-center space-y-4">
    //         <h2 className="text-2xl md:text-3xl font-bold text-primary/90 tracking-wide">
    //           INFORMATION AND SERVICES TO MAKE YOUR GLOBAL TRAVEL CONVENIENT
    //         </h2>
    //         <p className="text-gray-600 leading-relaxed">
    //           Explore step-by-step visa guidance, documentation support, and expert consultancy for your global
    //           journey. Simplify your travel process with Rahvana — your trusted visa partner.
    //         </p>
    //         <div className="flex justify-center pt-4">
    //           <button className="px-6 py-3 rounded-lg bg-primary/90 text-white font-semibold shadow-md hover:bg-primary/100 transition-all">
    //             Get Started
    //           </button>
    //         </div>
    //       </div>
    //     </section>

      

    //     {/* Additional Info Section (Optional - adds visual balance) */}
    //     <section className="container mx-auto px-6 py-16 md:py-24">
    //       <div className="grid md:grid-cols-3 gap-8">
    //         <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
    //           <h3 className="text-lg font-semibold text-primary/90 mb-2">Easy Navigation</h3>
    //           <p className="text-gray-600 text-sm leading-relaxed">
    //             Clean and simple interface designed to help you find visa information quickly.
    //           </p>
    //         </div>
    //         <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
    //           <h3 className="text-lg font-semibold text-primary/90 mb-2">Verified Data</h3>
    //           <p className="text-gray-600 text-sm leading-relaxed">
    //             All visa and service details are regularly verified for accuracy and reliability.
    //           </p>
    //         </div>
    //         <div className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
    //           <h3 className="text-lg font-semibold text-primary/90 mb-2">Step-by-Step Help</h3>
    //           <p className="text-gray-600 text-sm leading-relaxed">
    //             Follow simple instructions and video guides to complete your forms with confidence.
    //           </p>
    //         </div>
        
   
    //       </div>
    //     </section>
    //   </main>

    //   {/* Footer */}
    //   <footer className="border-t border-blue-200 bg-white/70 backdrop-blur py-8">
    //     <div className="container mx-auto px-6 text-center text-sm text-gray-600">
    //       <p>© {new Date().getFullYear()} <span className="font-semibold text-primary/90">Rahvana</span>. All rights reserved.</p>
    //       <p className="mt-2 text-xs text-gray-500">Designed to simplify your global travel experience.</p>
    //     </div>
    //   </footer>
    // </div>
  );
}
