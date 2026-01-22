"use client";

import React, { useState, useRef } from 'react';
import { Send, MessageSquare, Instagram, Linkedin, Twitter, Youtube, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';

export default function GetInTouch() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');
        setErrorMessage("");

        const formData = new FormData(event.currentTarget);
        
        try {
            const result = await submitContactForm(formData);
            if (result.success) {
                setStatus('success');
                formRef.current?.reset();
            } else {
                setStatus('error');
                setErrorMessage(result.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus('error');
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="relative bg-white overflow-hidden py-20 font-sans" id="contact" suppressHydrationWarning>
            {/* Texture overlay - matching opacity from original */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: "url('assets/images/footer-texture.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                aria-hidden="true"
            ></div>

            <div className="relative z-10 max-w-[1200px] mx-auto px-5">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f6f6] text-[#0d7377] text-sm font-medium rounded-full mb-5">
                        <MessageSquare size={16} />
                        Let&#39;s Connect
                    </span>
                    <h2 className="text-4xl font-bold text-[#24292e] mb-4">Get in Touch</h2>
                    <p className="text-lg text-[#586069]">
                        Have questions or need support? We&#39;re here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Social Column */}
                    <div>
                        <h3 className="text-xl font-semibold text-[#24292e] mb-6">Follow Us</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <SocialCard 
                                icon={<Instagram size={20} />} 
                                label="Instagram" 
                                href="#" 
                                ariaLabel="Follow us on Instagram"
                            />
                            <SocialCard 
                                icon={<Linkedin size={20} />} 
                                label="LinkedIn" 
                                href="#" 
                                ariaLabel="Connect on LinkedIn"
                            />
                            <SocialCard 
                                icon={<Twitter size={20} />} 
                                label="X (Twitter)" 
                                href="#" 
                                ariaLabel="Follow us on X"
                            />
                            <SocialCard 
                                icon={<Youtube size={20} />} 
                                label="YouTube" 
                                href="#" 
                                ariaLabel="Subscribe on YouTube"
                            />
                        </div>
                    </div>

                    {/* Contact Form Wrapper */}
                    <div>
                        <h3 className="text-xl font-semibold text-[#24292e] mb-6">Send a Message</h3>
                        
                        {status === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                                <CheckCircle2 size={20} className="shrink-0" />
                                <p className="text-sm font-medium">Thank you! Your message has been sent successfully. We&#39;ll get back to you soon.</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-sm font-medium">{errorMessage}</p>
                            </div>
                        )}

                        <form 
                            className="flex flex-col gap-4" 
                            id="contactForm" 
                            onSubmit={handleSubmit}
                            ref={formRef}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-[#24292e]">First Name</label>
                                    <input 
                                        type="text" 
                                        id="firstName" 
                                        name="firstName" 
                                        placeholder="John" 
                                        required 
                                        disabled={isSubmitting}
                                        className="p-3 border border-[#e1e4e8] rounded-lg text-base bg-[#fafbfc] focus:bg-white focus:outline-none focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10 transition-all disabled:opacity-60"
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-[#24292e]">Last Name</label>
                                    <input 
                                        type="text" 
                                        id="lastName" 
                                        name="lastName" 
                                        placeholder="Doe" 
                                        required 
                                        disabled={isSubmitting}
                                        className="p-3 border border-[#e1e4e8] rounded-lg text-base bg-[#fafbfc] focus:bg-white focus:outline-none focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10 transition-all disabled:opacity-60"
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-[#24292e]">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="john@example.com" 
                                    required 
                                    disabled={isSubmitting}
                                    className="p-3 border border-[#e1e4e8] rounded-lg text-base bg-[#fafbfc] focus:bg-white focus:outline-none focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10 transition-all disabled:opacity-60"
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-sm font-medium text-[#24292e]">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    placeholder="How can we help you?" 
                                    required 
                                    disabled={isSubmitting}
                                    className="p-3 border border-[#e1e4e8] rounded-lg text-base bg-[#fafbfc] min-h-28 resize-y focus:bg-white focus:outline-none focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10 transition-all disabled:opacity-60"
                                    suppressHydrationWarning
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="self-start inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0d7377] text-white font-semibold rounded-lg hover:bg-[#14a0a6] hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                                suppressHydrationWarning
                            >
                                {isSubmitting ? (
                                    <>
                                        Sending...
                                        <Loader2 size={18} className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SocialCard({ icon, label, href, ariaLabel }: { icon: React.ReactNode, label: string, href: string, ariaLabel: string }) {
    return (
        <a 
            href={href} 
            className="flex items-center gap-3 p-4 bg-[#fafbfc] border border-[#e1e4e8] rounded-xl text-[#24292e] no-underline transition-all hover:border-[#0d7377] hover:-translate-y-0.5 hover:shadow-md group"
            aria-label={ariaLabel}
        >
            <div className="flex items-center justify-center w-10 h-10 bg-[#e8f6f6] text-[#0d7377] rounded-lg shrink-0 group-hover:bg-[#0d7377] group-hover:text-white transition-colors">
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </a>
    );
}
