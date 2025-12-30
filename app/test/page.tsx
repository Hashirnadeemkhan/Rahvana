"use client";

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Wizard } from './components/Wizard';
import { Dashboard } from './components/Dashboard';
import { VisaCategorySection, ToolsSection, PricingSection, IR1JourneyDetail } from './components/StaticSections';
import { useWizard } from '../(main)/dashboard/hooks/useWizard';

export default function Page() {
    const [activeSection, setActiveSection] = useState('home');
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
        <div className="min-h-screen bg-white font-sans text-slate-800">
            <Header 
                activeSection={activeSection} 
                onNavigate={handleNavigate}
                isSignedIn={isSignedIn}
                onToggleAuth={handleToggleAuth}
            />

            <main className="min-h-[calc(100vh-200px)]">
                {/* {activeSection === 'home' && (
                    <HomeSection onNavigate={handleNavigate} />
                )} */}

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
    );
}