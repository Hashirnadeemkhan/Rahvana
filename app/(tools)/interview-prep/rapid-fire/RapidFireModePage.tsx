'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GeneratedQuestion } from '@/lib/interview-prep';
import { X, Check, X as XIcon, RotateCcw, Zap } from 'lucide-react';

interface RapidFireModeProps {
  sessionId: string;
  questions: GeneratedQuestion[];
  onExit: () => void;
  onSwitchToPrep: () => void;
}

export const RapidFireModePage = ({ sessionId, questions, onExit, onSwitchToPrep }: RapidFireModeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userResponse, setUserResponse] = useState<'covered' | 'partial' | 'missed' | null>(null);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [skippedQuestions, setSkippedQuestions] = useState<number>(0);
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

  const getProgressGradient = (percent: number) => {
    return {
      background: `linear-gradient(to right, #0d9488 ${percent}%, #e5e7eb ${percent}%)`
    };
  };

  useEffect(() => {
    if (timeLeft > 0 && !showAnswer) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
      setIsFlipped(true);
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
    setIsFlipped(true);
    
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
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(10);
      setShowAnswer(false);
      setIsFlipped(false);
      setUserResponse(null);
    } else {
      // End of questions - calculate final score
      const maxPossibleScore = shuffledQuestions.length * 10;
      const percentageScore = Math.round((score / maxPossibleScore) * 100);
      setTotalScore(percentageScore);
      
      // Save score to backend
      saveReadinessScore(percentageScore);
    }
  };

  const saveReadinessScore = async (score: number) => {
    try {
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'test@example.com' : 'test@example.com';
      await fetch(`/api/interview-prep/sessions/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-readiness-score',
          userEmail,
          score
        }),
      });
    } catch (error) {
      console.error('Error saving readiness score:', error);
    }
  };

  const skipQuestion = () => {
    setSkippedQuestions(prev => prev + 1);
    handleResponse('missed');
  };

  const restartRapidFire = () => {
    setCurrentQuestionIndex(0);
    setTimeLeft(10);
    setScore(0);
    setShowAnswer(false);
    setIsFlipped(false);
    setUserResponse(null);
    setTotalScore(null);
    setSkippedQuestions(0);
    setShuffledQuestions(shuffleArray(questions.filter(q => q.applicable)));
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">No Questions Available</h3>
            <p className="text-slate-600 mb-6">No applicable questions found for rapid fire mode.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onSwitchToPrep} className="bg-teal-600 hover:bg-teal-700">
                Switch to Prep Mode
              </Button>
              <Button onClick={onExit} variant="outline">
                Exit Rapid Fire
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (totalScore !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Rapid Fire Completed!</h1>
            <p className="text-slate-600">Your interview readiness assessment</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 rounded-full border-8 border-teal-200 flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-teal-700">{totalScore}%</span>
                    <div className="text-sm text-teal-600 font-medium mt-1">Readiness Score</div>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    totalScore >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : totalScore >= 60 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {totalScore >= 80 ? 'Excellent' : 
                     totalScore >= 60 ? 'Good' : 'Needs Practice'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-lg text-slate-700 font-medium">
                  {totalScore >= 80 ? 'Outstanding interview preparation!' : 
                   totalScore >= 60 ? 'Solid foundation established!' : 
                   'Keep practicing to build confidence'}
                </p>
                <p className="text-slate-500">
                  You scored <span className="font-semibold text-teal-600">{score}</span> points out of <span className="font-semibold">{shuffledQuestions.length * 10}</span> possible
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                    Questions: {shuffledQuestions.length}
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                    Time: {shuffledQuestions.length * 10}s
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">
                  {Math.floor(score / 10)}
                </div>
                <div className="text-sm text-emerald-700">Covered Well</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.floor((score % 10) / 5)}
                </div>
                <div className="text-sm text-amber-700">Partial Coverage</div>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-lg border border-rose-100">
                <div className="text-2xl font-bold text-rose-600">
                  {shuffledQuestions.length - Math.floor(score / 10) - Math.floor((score % 10) / 5) - skippedQuestions}
                </div>
                <div className="text-sm text-rose-700">Missed</div>
              </div>
            </div>
            
            {skippedQuestions > 0 && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                  <span className="text-slate-600">Questions skipped:</span>
                  <span className="font-bold text-slate-800">{skippedQuestions}</span>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button onClick={restartRapidFire} className="bg-teal-600 hover:bg-teal-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onSwitchToPrep} className="bg-orange-600 hover:bg-orange-700">
                <Zap className="w-4 h-4 mr-2" />
                Switch to Prep Mode
              </Button>
              <Button onClick={onExit} variant="outline">
                Exit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-500" />
              Rapid Fire Mode
            </h1>
            <p className="text-slate-600">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right flex gap-2">
              <div className="text-slate-900 font-bold">Score</div>
              <div className="text-lg font-bold text-teal-600">{score} pts</div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onExit}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={getProgressGradient(progress)}
            />
          </div>
        </div>

        {/* Main Question Card with Flip Animation */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 min-h-[500px] flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div 
              className={`relative w-full h-full min-h-[450px] cursor-pointer transition-transform duration-700 ease-out-cubic ${
                isFlipped ? 'transform rotate-y-180' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Front of Card - Question */}
              <div className={`absolute inset-0 backface-hidden bg-white rounded-2xl p-8 flex flex-col justify-between text-slate-900 shadow-xl border-4 ${
                !showAnswer 
                  ? timeLeft <= 3 
                    ? 'border-red-500 animate-pulse' 
                    : 'border-emerald-500'
                  : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentQuestion.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight text-slate-800 mb-8">
                    {currentQuestion.question}
                  </h2>
                  
                  {/* Center Timer */}
                  {!showAnswer && (
                    <div className="flex justify-center mt-28">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 3 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        <span className="text-sm text-slate-600">Time remaining:</span>
                        <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
                          {timeLeft}s
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  {!showAnswer ? (
                    <div className="inline-flex items-center gap-2 text-slate-600">
                      <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                      <span>Preparing your response...</span>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-sm">Click card to see answer</p>
                  )}
                </div>
              </div>

              {/* Back of Card - Answer & Guidance */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 flex flex-col text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Answer & Guidance
                  </span>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h4 className="text-teal-200 font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-200 rounded-full"></span>
                      Suggested Answer
                    </h4>
                    <p className="text-slate-100 leading-relaxed">
                      {currentQuestion.suggestedAnswer}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
                      Guidance
                    </h4>
                    <p className="text-slate-200 leading-relaxed">
                      {currentQuestion.guidance}
                    </p>
                  </div>
                </div>

                {/* Response Buttons */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <Button
                    onClick={() => handleResponse('covered')}
                    disabled={userResponse !== null}
                    className={`${
                      userResponse === 'covered' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    } h-14 flex items-center justify-center`}
                  >
                    <Check className="h-5 w-5 mb-1" />
                    <span className="text-sm">Covered Most</span>
                    <span className="text-xs">+10 pts</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleResponse('partial')}
                    disabled={userResponse !== null}
                    className={`${
                      userResponse === 'partial' 
                        ? 'bg-amber-600 hover:bg-amber-700' 
                        : 'bg-amber-500 hover:bg-amber-600'
                    } h-14 flex items-center justify-center`}
                  >
                    <span className="text-lg mb-1">⚠️</span>
                    <span className="text-sm">Partial</span>
                    <span className="text-xs">+5 pts</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleResponse('missed')}
                    disabled={userResponse !== null}
                    className={`${
                      userResponse === 'missed' 
                        ? 'bg-rose-600 hover:bg-rose-700' 
                        : 'bg-rose-500 hover:bg-rose-600'
                    } h-14 flex items-center justify-center`}
                  >
                    <XIcon className="h-5 w-5 mb-1" />
                    <span className="text-sm">Missed</span>
                    <span className="text-xs">+0 pts</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="float-right items-center">
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
                className="bg-orange-600 hover:bg-orange-700"
                disabled={userResponse === null}
              >
                {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};