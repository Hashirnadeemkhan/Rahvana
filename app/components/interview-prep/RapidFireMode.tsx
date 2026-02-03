'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GeneratedQuestion } from '@/lib/interview-prep';
import { X, Check, X as XIcon } from 'lucide-react';

interface RapidFireModeProps {
  questions: GeneratedQuestion[];
  onClose: () => void;
  onScoreUpdate: (score: number) => void;
}

export const RapidFireMode = ({ questions, onClose, onScoreUpdate }: RapidFireModeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userResponse, setUserResponse] = useState<'covered' | 'partial' | 'missed' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: GeneratedQuestion[]): GeneratedQuestion[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledQuestions, setShuffledQuestions] = useState<GeneratedQuestion[]>(() => 
    shuffleArray(questions.filter(q => q.applicable))
  );

  useEffect(() => {
    if (timeLeft > 0 && !showAnswer) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, showAnswer]);

  const handleResponse = (response: 'covered' | 'partial' | 'missed') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setUserResponse(response);
    setShowAnswer(true);
    
    // Update score based on response
    let points = 0;
    switch (response) {
      case 'covered':
        points = 10;
        break;
      case 'partial':
        points = 5;
        break;
      case 'missed':
        points = 0;
        break;
    }
    
    const newScore = score + points;
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(10);
      setShowAnswer(false);
      setUserResponse(null);
    } else {
      // End of questions
      onComplete();
    }
  };

  const onComplete = () => {
    // Calculate final percentage score
    const maxPossibleScore = shuffledQuestions.length * 10;
    const percentageScore = Math.round((score / maxPossibleScore) * 100);
    onScoreUpdate(percentageScore);
    onClose();
  };

  const skipQuestion = () => {
    handleResponse('missed');
  };

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">No Questions Available</h3>
            <p className="text-slate-600 mb-6">No applicable questions found for rapid fire mode.</p>
            <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rapid Fire Mode</h2>
            <p className="text-slate-600">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Area */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentQuestion.category}
              </span>
              {!showAnswer && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Time left:</span>
                  <span className={`text-lg font-bold ${timeLeft <= 3 ? 'text-red-600' : 'text-teal-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Section */}
          {showAnswer && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Suggested Answer</h4>
                <p className="text-slate-700">{currentQuestion.suggestedAnswer}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Guidance</h4>
                <p className="text-slate-700">{currentQuestion.guidance}</p>
              </div>

              {/* Response Buttons */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <Button
                  onClick={() => handleResponse('covered')}
                  disabled={userResponse !== null}
                  className={`${
                    userResponse === 'covered' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-teal-600 hover:bg-teal-700'
                  } h-16 flex flex-col items-center justify-center`}
                >
                  <Check className="h-5 w-5 mb-1" />
                  <span className="text-sm">Covered Most Points</span>
                  <span className="text-xs">+10 points</span>
                </Button>
                
                <Button
                  onClick={() => handleResponse('partial')}
                  disabled={userResponse !== null}
                  className={`${
                    userResponse === 'partial' 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-amber-600 hover:bg-amber-700'
                  } h-16 flex flex-col items-center justify-center`}
                >
                  <span className="text-lg mb-1">⚠️</span>
                  <span className="text-sm">Partial Answer</span>
                  <span className="text-xs">+5 points</span>
                </Button>
                
                <Button
                  onClick={() => handleResponse('missed')}
                  disabled={userResponse !== null}
                  className={`${
                    userResponse === 'missed' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-slate-600 hover:bg-slate-700'
                  } h-16 flex flex-col items-center justify-center`}
                >
                  <XIcon className="h-5 w-5 mb-1" />
                  <span className="text-sm">Missed It</span>
                  <span className="text-xs">+0 points</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <div className="text-lg font-semibold">
            Score: <span className="text-teal-600">{score} points</span>
          </div>
          
          <div className="flex gap-3">
            {!showAnswer ? (
              <Button 
                onClick={skipQuestion}
                variant="outline"
              >
                Skip Question
              </Button>
            ) : (
              <Button 
                onClick={nextQuestion}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};