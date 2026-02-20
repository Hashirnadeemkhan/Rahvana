"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  listUserJourneys, 
  deleteJourneyProgress, 
  JourneyProgressRecord 
} from "@/lib/journey/journeyProgressService";
import { 
  Briefcase, 
  ExternalLink, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Helper map for journey display names
const JOURNEY_NAMES: Record<string, string> = {
  ir1: "IR-1 Spouse Visa",
  ir5: "IR-5 Parents Visa",
  k1: "K-1 Fiancé Visa",
};

// Helper to get journey description
const JOURNEY_DESCRIPTIONS: Record<string, string> = {
  ir1: "Immigration journey for a spouse of a U.S. citizen.",
  ir5: "Immigration journey for Parents of U.S. citizens.",
  k1: "Immigration journey for a Fiancé of a U.S. citizen.",
};

const JOURNEY_ROUTES: Record<string, string> = {
  ir1: "/visa-category/ir-category/ir1-journey",
  ir5: "/visa-category/ir-category/ir5-journey",
  k1: "/visa-category/ir-category/k1-journey",
};

export default function MyJourneysPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [journeys, setJourneys] = useState<JourneyProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user?.id) {
      fetchJourneys();
    }
  }, [user, authLoading, router]);

  const fetchJourneys = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await listUserJourneys(user.id);
      setJourneys(data);
    } catch (error) {
      console.error("Error fetching journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (journeyId: string) => {
    if (!user?.id) return;
    if (!confirm("Are you sure you want to delete this journey? All progress will be lost forever.")) return;

    setDeletingId(journeyId);
    try {
      const success = await deleteJourneyProgress(user.id, journeyId);
      if (success) {
        setJourneys((prev) => prev.filter((j) => j.journey_id !== journeyId));
      }
    } catch (error) {
      console.error("Error deleting journey:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!user?.id || journeys.length === 0) return;
    if (!confirm(`Are you sure you want to delete ALL (${journeys.length}) journeys? This cannot be undone.`)) return;

    setLoading(true);
    try {
      for (const j of journeys) {
        await deleteJourneyProgress(user.id, j.journey_id);
      }
      setJourneys([]);
    } catch (error) {
      console.error("Error deleting all journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && journeys.length === 0)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading your journeys...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <Shield className="w-3 h-3" /> Certified Secure Portal
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Sync Active
                </div>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                My Immigration <br />
                <span className="text-rahvana-primary bg-linear-to-r from-rahvana-primary to-primary bg-clip-text text-transparent">Professional Journeys</span>
              </h1>
              <p className="text-slate-500 max-w-lg text-lg font-medium leading-relaxed">
                Your centralized command center for visa tracking. Every document, step, and milestone is synced in real-time.
              </p>
            </div>
            
            {journeys.length > 0 && (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-100 hover:bg-red-50"
                  onClick={handleDeleteAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
                <Button 
                  onClick={() => router.push("/visa-category/ir-category")}
                  className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Journey
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {journeys.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">No active journeys found</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  It looks like you haven&apos;t started any immigration journeys yet. 
                  Choose a visa category to begin your step-by-step guided process.
                </p>
                <Button 
                  size="lg"
                  onClick={() => router.push("/visa-category/ir-category")}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20"
                >
                  Explore Visa Categories <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {journeys.map((j, idx) => {
                  const progress = Math.round((j.completed_steps.length / 42) * 100);
                  const journeyName = JOURNEY_NAMES[j.journey_id] || j.journey_id.toUpperCase();
                  const description = JOURNEY_DESCRIPTIONS[j.journey_id] || "Active immigration track.";
                  const route = JOURNEY_ROUTES[j.journey_id] || "/";

                  return (
                    <motion.div
                      key={j.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <Card className="overflow-hidden border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer relative"
                        onClick={() => router.push(route)}
                      >
                        <div className="absolute top-0 right-0 p-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(j.journey_id); }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Journey"
                            disabled={deletingId === j.journey_id}
                          >
                            {deletingId === j.journey_id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <CardContent className="p-8">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Briefcase className="w-7 h-7 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors truncate pr-8">
                                {journeyName}
                              </h3>
                              <p className="text-slate-500 text-sm line-clamp-1 italic mt-1 font-medium">
                                {description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-bold">
                              <span className="text-slate-600 uppercase tracking-tighter flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> 
                                Last activity: {new Date(j.last_updated_at).toLocaleDateString()}
                              </span>
                              <span className="text-primary">{progress}%</span>
                            </div>
                            
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary via-primary to-rahvana-primary rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:40px_40px] animate-[slide_1s_linear_infinite]" />
                              </motion.div>
                            </div>
                          </div>

                          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 gap-4">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  {i}
                                </div>
                              ))}
                              <div className="w-8 h-8 rounded-full bg-primary/5 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">
                                +{j.completed_steps.length}
                              </div>
                            </div>
                            
                            <Button className="rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all font-bold px-6 border-transparent hover:bg-primary/90">
                              Resume Journey <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
          

        </div>
      </div>

      <style jsx global>{`
        @keyframes slide {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
      `}</style>
    </div>
  );
}
