
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Award, Smile, Frown, Annoyed, Zap, Utensils } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import IcecreamImage from './images/Icecream.png';
import SpiceImage from './images/spice.jpg';
import LemonsImage from './images/lemons.jpg';
import BeansImage from './images/beans.png';

const questionsData = [
  { name: 'سعادة', image: IcecreamImage, hint: 'ice cream cone', item: 'مثلجات لذيذة' },
  { name: 'انزعاج', image: SpiceImage, hint: 'spicy chili pepper', item: 'فلفل حار' },
  { name: 'قشعريرة', image: LemonsImage, hint: 'sour lemon', item: 'ليمون حامض' },
  { name: 'انزعاج', image: BeansImage, hint: 'steamed broccoli', item: 'فول' },
];

const emotionChoices = [
    { name: 'سعادة', icon: Smile },
    { name: 'حزن', icon: Frown },
    { name: 'انزعاج', icon: Annoyed },
    { name: 'قشعريرة', icon: Zap },
]

const TOTAL_ROUNDS = 4;

type GameState = 'idle' | 'playing' | 'feedback' | 'finished';

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function FlavorAndFeelingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [currentRound, setCurrentRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [questions, setQuestions] = React.useState(shuffleArray([...questionsData]));
  const [currentQuestion, setCurrentQuestion] = React.useState<(typeof questionsData)[0] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{type: 'correct' | 'incorrect', message: string} | null>(null);

  React.useEffect(() => {
    setQuestions(shuffleArray([...questionsData]));
  }, []);

  const startNewGame = () => {
    const shuffledQuestions = shuffleArray([...questionsData]);
    setQuestions(shuffledQuestions);
    setCurrentRound(1);
    setScore(0);
    setGameState('playing');
    playNextRound(0, shuffledQuestions);
  };
  
  const playNextRound = (round: number, currentQuestions: any[]) => {
    if (round >= TOTAL_ROUNDS) {
        setGameState('finished');
        return;
    }
    setSelectedAnswer(null);
    setFeedback(null);
    setGameState('playing');
    setCurrentQuestion(currentQuestions[round]);
  };

  const handleAnswerSelect = (emotionName: string) => {
    if (gameState !== 'playing' || selectedAnswer) return;

    setSelectedAnswer(emotionName);
    setGameState('feedback');
    let newScore = score;
    if (emotionName === currentQuestion?.name) {
        setFeedback({ type: 'correct', message: 'عمل مذهل! اختيار موفق.' });
        newScore = score + 1;
        setScore(newScore);
    } else {
        setFeedback({ type: 'incorrect', message: `محاولة جيدة! هذا الطعام عادةً ما يثير شعور '${currentQuestion?.name}'.` });
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
        savedScores.facialExpression = score;
        localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));
        router.push(`/dashboard/student/${studentId}/assessment?facialExpression=${score}`);
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
                            <Utensils className="w-16 h-16 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl mb-4">هل أنت مستعد لمطابقة النكهات بالمشاعر؟</CardTitle>
                        <p className="text-muted-foreground">ستمر بأربع خطوات. حاول أن تطابق الطعام مع الشعور الذي يثيره.</p>
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
                <div className="w-full max-w-4xl flex flex-col items-center">
                    <Progress value={(currentRound / TOTAL_ROUNDS) * 100} className="w-full mb-6" />
                    <Card className="w-full text-center bg-card/50 rounded-2xl p-8 mb-6">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl mb-4">الخطوة {currentRound} / {TOTAL_ROUNDS}</CardTitle>
                             <p className="text-2xl font-bold text-foreground">
                                أي شعور تثيره هذه النكهة؟
                            </p>
                        </CardHeader>
                        <CardContent>
                            {currentQuestion && (
                                <div className="flex flex-col items-center gap-4">
                                     <div className="relative w-[250px] h-[250px]">
                                        <Image 
                                            src={currentQuestion.image} 
                                            alt={currentQuestion.name} 
                                            unoptimized
                                            className="rounded-lg bg-muted object-contain w-full h-full"
                                        />
                                     </div>
                                    <p className="text-xl font-semibold">{currentQuestion.item}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="w-full">
                        <h2 className="font-headline text-2xl text-center mb-6">اختر الشعور</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {emotionChoices.map((emotion) => (
                                <Button
                                    key={emotion.name}
                                    onClick={() => handleAnswerSelect(emotion.name)}
                                    disabled={gameState === 'feedback'}
                                    variant="outline"
                                    className={cn(
                                        "h-24 text-xl rounded-2xl transition-all duration-300",
                                        gameState === 'feedback' && emotion.name !== currentQuestion?.name && 'opacity-50',
                                        gameState === 'feedback' && emotion.name === currentQuestion?.name && 'bg-green-500/20 border-green-500 text-green-500 scale-105',
                                        gameState === 'feedback' && emotion.name === selectedAnswer && emotion.name !== currentQuestion?.name && 'bg-red-500/20 border-red-500 text-red-500'
                                    )}
                                >
                                    <emotion.icon className="w-8 h-8 mr-4"/>
                                    {emotion.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {feedback && gameState === 'feedback' && (
                        <Alert className={`mt-8 max-w-3xl w-full ${feedback.type === 'correct' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           {feedback.type === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle className="font-bold">{feedback.type === 'correct' ? 'رائع!' : 'محاولة جيدة!'}</AlertTitle>
                            <AlertDescription>
                                {feedback.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
             )
      }
  }

  return (
    <div className="animate-in fade-in-50 flex flex-col items-center p-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">
            نشاط النكهة و الشعور 🍇🍋🌶️
        </h1>
        {renderContent()}
    </div>
  );
}
