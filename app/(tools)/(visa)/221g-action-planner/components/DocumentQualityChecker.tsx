import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Eye,
  Upload
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'missing' | 'in-progress' | 'ready' | 'submitted';
  filePath?: string;
}

interface DocumentQualityCheckerProps {
  documents: Document[];
  onCheckComplete: (results: QualityCheckResult[]) => void;
}

interface QualityCheckResult {
  documentId: string;
  issues: QualityIssue[];
  score: number; // 0-100
}

interface QualityIssue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

export default function DocumentQualityChecker({ documents, onCheckComplete }: DocumentQualityCheckerProps) {
  const checkDocumentQuality = (doc: Document) => {
    const issues: QualityIssue[] = [];
    
    // Check if document is missing
    if (!doc.filePath) {
      issues.push({
        severity: 'critical',
        message: 'Document is missing',
        suggestion: 'Upload the required document'
      });
      return { documentId: doc.id, issues, score: 0 };
    }
    
    // Simulate quality checks (in a real app, this would analyze the actual document)
    // For demo purposes, we'll generate some common issues
    
    // Check for common document quality issues
    if (doc.name.toLowerCase().includes('birth') && !doc.name.toLowerCase().includes('certified')) {
      issues.push({
        severity: 'warning',
        message: 'Birth certificate may not be certified',
        suggestion: 'Ensure you have a certified copy from the issuing authority'
      });
    }
    
    if (doc.name.toLowerCase().includes('translation') && !doc.name.toLowerCase().includes('certified')) {
      issues.push({
        severity: 'critical',
        message: 'Translation is not certified',
        suggestion: 'Use a certified translator for document translations'
      });
    }
    
    if (doc.name.toLowerCase().includes('tax') && doc.name.toLowerCase().includes('transcript')) {
      // Check if tax transcript is recent enough
      issues.push({
        severity: 'info',
        message: 'Verify tax transcript is recent (within 30 days)',
        suggestion: 'Request fresh tax transcripts if yours are older than 30 days'
      });
    }
    
    if (doc.name.toLowerCase().includes('police') && doc.name.toLowerCase().includes('certificate')) {
      // Check if police certificate is recent enough
      issues.push({
        severity: 'warning',
        message: 'Police certificate may be expiring soon',
        suggestion: 'Ensure your police certificate is valid for at least 6 months'
      });
    }
    
    // Calculate score based on issues
    let score = 100;
    issues.forEach(issue => {
      if (issue.severity === 'critical') score -= 25;
      if (issue.severity === 'warning') score -= 10;
      if (issue.severity === 'info') score -= 5;
    });
    
    // Ensure score doesn't go below 0
    score = Math.max(0, score);
    
    return { documentId: doc.id, issues, score };
  };

  const runQualityCheck = () => {
    const results = documents.map(doc => checkDocumentQuality(doc));
    onCheckComplete(results);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Eye className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-700">Document Quality Checker</CardTitle>
          <Badge variant="outline">{documents.length} documents</Badge>
        </div>
        <p className="text-sm text-gray-600">
          Check your documents for common issues before submission
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button onClick={runQualityCheck} className="w-full bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Run Quality Check
          </Button>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => {
            // For demo, we'll simulate a check result
            const simulatedResult = checkDocumentQuality(doc);
            
            return (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">{doc.name}</h3>
                  </div>
                  <Badge variant={getSeverityColor(simulatedResult.issues[0]?.severity || 'info')}>
                    {simulatedResult.score}% Quality
                  </Badge>
                </div>
                
                <Progress value={simulatedResult.score} className="h-2 mb-2" />
                
                {simulatedResult.issues.length > 0 ? (
                  <div className="space-y-2">
                    {simulatedResult.issues.map((issue, idx) => (
                      <Alert 
                        key={idx} 
                        className={`${
                          issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                          issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {getSeverityIcon(issue.severity)}
                          <div>
                            <AlertDescription>
                              <span className="font-medium">{issue.message}</span>
                              <p className="text-sm mt-1">{issue.suggestion}</p>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      No issues detected. Document appears ready for submission.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            );
          })}
          
          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <p>No documents to check</p>
              <p className="text-sm mt-1">Add documents to your checklist to run quality checks</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Common Document Issues
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Missing signatures or dates</li>
            <li>• Inconsistent names/dates across documents</li>
            <li>• Expired documents (police certificates, medical exams)</li>
            <li>• Uncertified translations</li>
            <li>• Poor scan quality (unreadable text/images)</li>
            <li>• Missing required pages</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}