"use client";

import React from 'react';
import { useAuth } from "@/app/context/AuthContext";
import { useWizard } from './hooks/useWizard';
import { roadmapData } from './data/roadmap';
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user } = useAuth();
    const { state, isLoaded } = useWizard();
    const router = useRouter();

    const isSignedIn = !!user;

    const handleContinue = () => {
        router.push('/?section=ir1-journey');
    };
// export default function DashboardPage() {
//   const { user, signOut, isLoading } = useAuth();
//   const router = useRouter();

    const handleNavigate = (section: string) => {
        router.push(`/?section=${section}`);
    };

    const handleToggleAuth = () => {
        // In a real app, this might redirect to login/signup
        router.push('/login');
    };

    const getTotalSteps = () => {
        return roadmapData.stages.reduce((acc, stage) => acc + stage.steps.length, 0);
    };

    if (!isLoaded) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const totalSteps = getTotalSteps();
    const completed = state.completedSteps.size;
    const progress = totalSteps === 0 ? 0 : Math.round((completed / totalSteps) * 100);

    return (
        <section id="dashboard" className="block">
            <div className="max-w-[1400px] mx-auto px-6 py-[60px]">
                <h1 className="text-[40px] font-bold mb-4">Your Dashboard</h1>
                <p className="text-slate-500 text-lg mb-12">Track your active journeys and access recommended tools.</p>

                {!isSignedIn && (
                    <div id="guest-dashboard-msg">
                        <div className="bg-[#f59e0b]/5 border-2 border-[#f59e0b]/20 p-8 rounded-xl text-center">
                            <h4 className="text-xl font-bold mb-2">👋 Sign in to access your dashboard</h4>
                            <p className="text-slate-500 mb-6">Track journeys, save progress across devices, and get personalized recommendations.</p>
                            <button 
                                className="px-6 py-3 rounded-lg bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors shadow-sm"
                                onClick={handleToggleAuth}
                            >
                                Sign In Free
                            </button>
                        </div>
                    </div>
                )}

                {isSignedIn && (
                    <div id="signed-in-dashboard">
                        {/* Video Placeholder: Getting Started */}
                        <div className="bg-secondary text-white rounded-xl p-10 mb-10">
                            <h4 className="text-lg font-bold mb-3">📹 Getting Started with Rahvana (3 min)</h4>
                            <ul className="space-y-2 mb-4">
                                <li className="flex gap-2 text-sm"><span className="text-amber-500">▸</span> <strong>Goals:</strong> Understand the 5 stages, set realistic expectations, feel supported</li>
                                <li className="flex gap-2 text-sm"><span className="text-amber-500">▸</span> <strong>Target:</strong> Both petitioner and beneficiary</li>
                                <li className="flex gap-2 text-sm"><span className="text-amber-500">▸</span> <strong>Topics:</strong> Timeline overview, cost breakdown, common mistakes to avoid, emotional support for separated couples</li>
                            </ul>
                            <button className="px-6 py-3 rounded-lg border-2 border-white text-white font-bold cursor-not-allowed bg-[#ffffff33]">
                                ▶ Play Video (Placeholder)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                            <div className="lg:col-span-2">
                                <h3 className="text-xl font-bold mb-5">Your Active Journeys</h3>
                                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                    <h4 className="text-lg font-bold mb-2">🇺🇸 IR-1/CR-1 Spouse Visa</h4>
                                    <p className="text-slate-500 text-sm mb-3">Started Dec 21, 2025</p>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#0d9488] to-[#10b981] transition-all duration-500" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[13px] mb-6">
                                        <span className="font-semibold text-slate-800">{completed} of {totalSteps} steps</span>
                                        <span className="text-slate-500">{progress}% Complete</span>
                                    </div>
                                    <button 
                                        className=" px-8 py-3 rounded-lg bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors shadow-lg"
                                        onClick={handleContinue}
                                    >
                                        Continue Journey →
                                    </button>
                                </div>

                                <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm opacity-60">
                                    <h4 className="font-bold mb-2">➕ Start Another Journey</h4>
                                    <p className="text-slate-500 text-sm mb-3">IR-5 Parents, K-1 Fiancé, and more coming soon.</p>
                                    <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-400 font-bold border border-slate-200 cursor-not-allowed" disabled>
                                        Coming Soon
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-5">Tools You May Need Next</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <ToolCard 
                                        title="Passport Photo Tool"
                                        description="You'll need 2x2 photos for Stage I and II."
                                        icon="📸"
                                        badge="free"
                                    />
                                    <ToolCard 
                                        title="I-864 Calculator"
                                        description="Calculate income requirements early."
                                        icon="💰"
                                        badge="free"
                                    />
                                    <ToolCard 
                                        title="Interview Prep"
                                        description="Start preparing early with 50+ questions."
                                        icon="🎯"
                                        badge="premium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xl font-bold mb-5">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <button 
                                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-all group"
                                    onClick={() => handleNavigate('ir1-journey')}
                                >
                                    <h4 className="text-lg font-bold mb-1 group-hover:text-[#0d9488] transition-colors">📋 Open IR-1 Wizard</h4>
                                    <p className="text-sm text-slate-500">Continue your journey</p>
                                </button>
                                <button 
                                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-all group"
                                    onClick={() => handleNavigate('tools')}
                                >
                                    <h4 className="text-lg font-bold mb-1 group-hover:text-[#0d9488] transition-colors">🛠️ Browse Tools</h4>
                                    <p className="text-sm text-slate-500">Document prep & planning</p>
                                </button>
                                <button 
                                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-all group"
                                    onClick={() => handleNavigate('pricing')}
                                >
                                    <h4 className="text-lg font-bold mb-1 group-hover:text-[#0d9488] transition-colors">⭐ View Premium</h4>
                                    <p className="text-sm text-slate-500">Unlock all features</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function ToolCard({ title, description, icon, badge, onClick }: { title: string; description: string; icon: string; badge: 'free' | 'premium'; onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-start text-left group"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg transition-transform group-hover:scale-110 duration-200">{icon}</span>
                <h4 className="font-bold text-slate-800 text-[15px] transition-colors group-hover:text-[#0d9488]">{title}</h4>
            </div>
            <p className="text-slate-500 text-[13px] mb-4 leading-normal">{description}</p>
            <div className="mt-auto">
                {badge === 'free' ? (
                    <span className="px-3 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-[11px] font-bold">
                        Free
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-full bg-[var(--premium-bg)] text-[var(--premium-text)] text-[11px] font-bold">
                        ⭐ Premium
                    </span>
                )}
            </div>
        </div>
    );
}
