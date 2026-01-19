"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Clock,
  Eye,
  Plus,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import { ElementType } from "react";

type RiskLevel = "STRONG" | "MODERATE" | "WEAK" | "PENDING";
type CaseType = "Spouse";

interface UserCase {
  sessionId: string;
  userEmail: string;
  userName: string;
  caseType: CaseType;
  overallScore: number | null;
  riskLevel: RiskLevel;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const RiskLevelBadge = ({
  riskLevel,
  score,
}: {
  riskLevel: RiskLevel;
  score: number | null;
}) => {
  const riskConfig: Record<
    RiskLevel,
    { color: string; icon: ElementType; label: string }
  > = {
    STRONG: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Strong",
    },
    MODERATE: {
      color: "bg-yellow-100 text-yellow-800",
      icon: AlertTriangle,
      label: "Moderate",
    },
    WEAK: {
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
      label: "Weak",
    },
    PENDING: {
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
      label: "Pending",
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {score !== null ? `${config.label} (${Math.round(score)})` : config.label}
    </span>
  );
};

export default function MyCases() {
  const [cases, setCases] = useState<UserCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // fetch user cases
  useEffect(() => {
    const fetchUserCases = async () => {
      try {
        setLoading(true);
        const userEmail = 'guest@example.com';
        
        const response = await fetch(
          `/api/visa-checker/results?email=${encodeURIComponent(userEmail)}`
        );
        
        const data = await response.json();

        if (response.ok) {
          setCases(data);
        } else {
          setError(data.error || "Failed to fetch cases");
          setCases([]);
        }
      } catch (error) {
        console.error("Error fetching user cases:", error);
        setError("Failed to load cases");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCases();
  }, []);

  // pagination calculations
  const totalPages = Math.max(1, Math.ceil(cases.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCases = cases.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCaseTypeLabel = (caseType: CaseType) => {
    switch (caseType) {
      case "Spouse":
        return "IR-1/CR-1 Spouse Visa";
      default:
        return caseType;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary/90">
            My Visa Cases
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage all your visa case assessments
          </p>
        </header>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">All Cases</h2>
          <Button
            onClick={() => (window.location.href = "/visa-case-strength-checker")}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Error Loading Cases
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90"
            >
              Try Again
            </Button>
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No cases found
            </h3>
            <p className="text-gray-500">
              You haven&apos;t submitted any visa case assessments yet.
            </p>
            <div className="mt-6">
              <Button
                onClick={() =>
                  (window.location.href = "/visa-case-strength-checker")
                }
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Your First Assessment
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Type</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentCases.map((userCase) => (
                    <TableRow key={userCase.sessionId} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-primary/80 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {getCaseTypeLabel(userCase.caseType)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">
                            {formatDate(userCase.createdAt)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <RiskLevelBadge 
                          riskLevel={userCase.riskLevel} 
                          score={userCase.overallScore}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/visa-case-strength-checker/result?sessionId=${userCase.sessionId}`)
                          }
                          className="text-primary cursor-pointer hover:text-primary/90"
                          disabled={!userCase.completed}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {userCase.completed ? "View Details" : "Incomplete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {/* Pagination - only show if there are cases and multiple pages */}
                {cases.length > 0 && totalPages > 1 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="w-full flex justify-center py-4">
                        <Pagination
                          currentPage={currentPage}
                          totalItems={cases.length}
                          itemsPerPage={ITEMS_PER_PAGE}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}