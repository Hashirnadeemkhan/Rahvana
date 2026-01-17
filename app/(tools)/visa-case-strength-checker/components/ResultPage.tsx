'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface RiskFlag {
  flagCode: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  pointsDeducted: number;
  explanation: string;
  improvementSuggestions: string;
  improvementPriority?: number;
}

interface ResultData {
  sessionId: string;
  overallScore: number;
  riskLevel: 'STRONG' | 'MODERATE' | 'WEAK' | 'PENDING';
  riskFlags: RiskFlag[];
  summaryReasons: string[];
  improvementSuggestions: string[];
  completedAt?: string;
  totalPossiblePoints?: number;
  totalDeductedPoints?: number;
}

interface ResultPageProps {
  sessionId?: string;
  onRestart: () => void;
}

export function ResultPage({ sessionId, onRestart }: ResultPageProps) {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/visa-checker/results/${sessionId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }
      
      setResultData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Analyzing your case...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Session not found
          </h3>
          <p className="text-slate-600 mb-6">
            Your assessment session could not be loaded. Please restart.
          </p>
          <Button onClick={onRestart}>Restart Assessment</Button>
        </CardContent>
      </Card>
    );
  }  

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Results</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={fetchResults} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!resultData) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'STRONG': return 'text-green-600 bg-green-50 border-green-200';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'WEAK': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High Priority';
      case 2: return 'Medium Priority';
      case 3: return 'Low Priority';
      default: return 'Low Priority';
    }
  };

  // Group risk flags by priority (using severity as proxy if priority not available)
  const groupedFlags = {
    high: resultData.riskFlags.filter(f => f.severity === 'HIGH'),
    medium: resultData.riskFlags.filter(f => f.severity === 'MEDIUM'),
    low: resultData.riskFlags.filter(f => f.severity === 'LOW')
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Case Strength Analysis Complete</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Your visa case has been analyzed. Here&apos;s your detailed assessment with actionable insights.
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Assessment</span>
            <Badge className={`${getRiskColor(resultData.riskLevel)} text-lg px-4 py-2`}>
              {resultData.riskLevel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Overall Score</span>
              <span className="text-2xl font-bold text-slate-900">
                {Math.round(resultData.overallScore)}/100
              </span>
            </div>
            <Progress 
              value={resultData.overallScore} 
              className="h-3" 
              indicatorClassName={
                resultData.overallScore >= 80 ? 'bg-green-500' :
                resultData.overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }
            />
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg">
            <ul className="list-disc pl-5 space-y-1">
              {resultData.summaryReasons?.map((reason, idx) => (
                <li key={idx} className="text-slate-700">{reason}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-sm text-slate-500">
            Completed on {resultData.completedAt ? new Date(resultData.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions Section */}
      {resultData.improvementSuggestions && resultData.improvementSuggestions.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Improvement Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {resultData.improvementSuggestions.map((suggestion, idx) => (
                <li key={idx} className="text-slate-700">{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Risk Flags by Priority */}
      <div className="space-y-6">
        {/* High Priority Issues */}
        {groupedFlags.high.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                High Priority Issues (Must Address)
              </CardTitle>
              <p className="text-red-700 text-sm">
                These are critical issues that significantly impact your case strength
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedFlags.high.map((flag, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{formatFlagCode(flag.flagCode)}</h4>
                    </div>
                    <p className="text-slate-700 mb-2">{flag.explanation}</p>
                    <div className="flex items-center gap-2 text-sm text-red-700">
                      <Info className="h-4 w-4" />
                      <span>Action needed: {flag.improvementSuggestions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medium Priority Issues */}
        {groupedFlags.medium.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Medium Priority Issues (Should Address)
              </CardTitle>
              <p className="text-yellow-700 text-sm">
                These issues should be addressed to strengthen your case
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedFlags.medium.map((flag, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{formatFlagCode(flag.flagCode)}</h4>
                    </div>
                    <p className="text-slate-700 mb-2">{flag.explanation}</p>
                    <div className="flex items-center gap-2 text-sm text-yellow-700">
                      <Info className="h-4 w-4" />
                      <span>Consider: {flag.improvementSuggestions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Priority Issues */}
        {groupedFlags.low.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Info className="h-5 w-5" />
                Low Priority Improvements (Nice to Have)
              </CardTitle>
              <p className="text-blue-700 text-sm">
                These minor improvements can enhance your case strength
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedFlags.low.map((flag, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{formatFlagCode(flag.flagCode)}</h4>
                      </div>
                    <p className="text-slate-700 mb-2">{flag.explanation}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Info className="h-4 w-4" />
                      <span>Suggestion: {flag.improvementSuggestions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button 
          onClick={onRestart}
          variant="outline"
          className="border-teal-600 text-teal-600 hover:bg-teal-50"
        >
          Assess Another Case
        </Button>
        {/* <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          Save Results
        </Button> */}
      </div>
    </div>
  );
}

// Helper function to format flag codes into readable text
function formatFlagCode(code: string): string {
  return code
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}