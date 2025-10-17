
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Palette, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const feelings = [
  { name: 'فرح', color: 'bg-yellow-400', borderColor: 'border-yellow-400' },
  { name: 'حزن', color: 'bg-black', borderColor: 'border-black' },
  { name: 'غضب', color: 'bg-red-500', borderColor: 'border-red-500' },
  { name: 'هدوء', color: 'bg-green-500', borderColor: 'border-green-500' },
  { name: 'دهشة', color: 'bg-purple-500', borderColor: 'border-purple-500' },
];

const TOTAL_ROUNDS = 5;

type GameState = 'idle' | 'playing' | 'feedback' | 'finished';

// Function to shuffle the array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


export default function MyFeelingsColorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [currentRound, setCurrentRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [questions, setQuestions] = React.useState<{ name: string; color: string; borderColor: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState<{ name: string; color: string; borderColor: string } | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{type: 'correct' | 'incorrect', message: string} | null>(null);

  React.useEffect(() => {
      setQuestions(shuffleArray([...feelings]));
  }, []);

  const startNewGame = () => {
    setCurrentRound(1);
    setScore(0);
    setGameState('playing');
    setQuestions(shuffleArray([...feelings]));
    playNextRound(0, shuffleArray([...feelings]));
  };
  
  const playNextRound = (round: number, currentQuestions: any[]) => {
    if (round >= TOTAL_ROUNDS) {
        setGameState('finished');
        return;
    }
    setSelectedColor(null);
    setFeedback(null);
    setGameState('playing');
    setCurrentQuestion(currentQuestions[round]);
  };

  const handleColorSelect = (colorName: string) => {
    if (gameState !== 'playing' || selectedColor) return;

    setSelectedColor(colorName);
    setGameState('feedback');
    let newScore = score;
    if (colorName === currentQuestion?.name) {
        setFeedback({ type: 'correct', message: 'عظيم! اختيار موفق.' });
        newScore = score + 1;
        setScore(newScore);
    } else {
        setFeedback({ type: 'incorrect', message: `محاولة جيدة! اللون الموافق لشعور '${currentQuestion?.name}' هو اللون الآخر.` });
    }

    setTimeout(() => {
        const nextRound = currentRound + 1;
        if (nextRound <= TOTAL_ROUNDS) {
            setCurrentRound(nextRound);
            playNextRound(currentRound, questions);
        } else {
            setGameState('finished');
        }
    }, 2000);
  };

  const viewResults = () => {
    if (studentId) {
      const savedScores = JSON.parse(localStorage.getItem(`scores_${studentId}`) || '{}');
      savedScores.myFeelingsColors = score;
      localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));
      router.push(`/dashboard/student/${studentId}/assessment?myFeelingsColors=${score}`);
    } else {
      router.push(`/student-space/results?score=${score}`); 
    }
  };
  
  const renderContent = () => {
      switch(gameState) {
        case 'idle':
            return (
                <Card className="w-full max-w-3xl text-center bg-card/50 rounded-2xl p-8">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <Palette className="w-16 h-16 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl mb-4">هل أنت مستعد لاختبار الألوان؟</CardTitle>
                        <p className="text-muted-foreground">ستخوض 5 خطوات. حاول أن تطابق الشعور مع اللون.</p>
                    </CardHeader>
                    <CardContent>
                        <Button size="lg" className="w-48 h-16 text-xl rounded-full" onClick={startNewGame}>
                            إبدأ النشاط!
                        </Button>
                    </CardContent>
                </Card>
            );
        case 'finished':
            return (
                 <Card className="w-full max-w-3xl text-center bg-card/50 rounded-2xl p-8 animate-in fade-in-50">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                           <Award className="w-16 h-16 text-yellow-400" />
                        </div>
                        <CardTitle className="font-headline text-3xl mb-4">انتهى النشاط!</CardTitle>
                        <p className="text-muted-foreground text-xl">نتيجتك هي:</p>
                        <p className="text-4xl font-bold text-primary py-4">{score} / {TOTAL_ROUNDS}</p>
                    </CardHeader>
                    <CardContent>
                        <Button size="lg" className="mt-8" onClick={viewResults}>
                           إنهاء النشاط والعودة
                        </Button>
                    </CardContent>
                </Card>
            )
        case 'playing':
        case 'feedback':
             return (
                <>
                    <Progress value={(currentRound / TOTAL_ROUNDS) * 100} className="w-full max-w-3xl mb-6" />
                    <Card className="w-full max-w-3xl text-center bg-card/50 rounded-2xl p-8 mb-6">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl mb-4">الخطوة {currentRound} / {TOTAL_ROUNDS}</CardTitle>
                             <p className="text-2xl font-bold text-foreground">
                                أي لون يمثل شعور "{currentQuestion?.name}"؟
                            </p>
                        </CardHeader>
                    </Card>

                    <div className="w-full max-w-3xl">
                        <h2 className="font-headline text-2xl text-center mb-6">اختر اللون</h2>
                         <div className="flex justify-center gap-4 flex-wrap">
                            {feelings.map((feeling) => (
                                <button
                                key={feeling.name}
                                onClick={() => handleColorSelect(feeling.name)}
                                disabled={gameState === 'feedback'}
                                className={cn(
                                    "w-24 h-24 rounded-full cursor-pointer transition-all duration-200 border-8 flex items-center justify-center",
                                    feeling.color,
                                    gameState === 'feedback' ?
                                        (feeling.name === currentQuestion?.name ? `${feeling.borderColor} scale-110` : 'border-transparent opacity-50') :
                                        (selectedColor === feeling.name ? feeling.borderColor : 'border-transparent'),
                                    'hover:scale-105'
                                )}
                                aria-label={`اختر لون ${feeling.name}`}
                                >
                                {gameState === 'feedback' && feeling.name === currentQuestion?.name && (
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                )}
                                {gameState === 'feedback' && feeling.name === selectedColor && feeling.name !== currentQuestion?.name && (
                                    <XCircle className="w-10 h-10 text-white" />
                                )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {feedback && gameState === 'feedback' && (
                        <Alert className={`mt-8 max-w-3xl w-full ${feedback.type === 'correct' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           {feedback.type === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle className="font-bold">{feedback.type === 'correct' ? 'أحسنت!' : 'لا بأس!'}</AlertTitle>
                            <AlertDescription>
                                {feedback.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </>
             )
      }
  }

  return (
    <div className="animate-in fade-in-50 flex flex-col items-center p-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">
            لعبة ألوان المشاعر
        </h1>
        {renderContent()}
    </div>
  );
}
