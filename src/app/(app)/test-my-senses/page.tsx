
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, TestTube, Award, Eye, Ear, Mic, Utensils, Hand } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import RoseImage from './images/Rose.webp';
import BellImage from './images/Bell.png';
import IcecreamImage from './images/Icecream.png';
import RainbowImage from './images/Rainbow.png';


const senses = [
  { name: 'البصر', icon: Eye },
  { name: 'السمع', icon: Ear },
  { name: 'الشم', icon: Mic },
  { name: 'التذوق', icon: Utensils },
  { name: 'اللمس', icon: Hand },
];

const questionsData = [
  { item: 'وردة', sense: 'الشم', image: RoseImage, hint: 'flower' },
  { item: 'جرس', sense: 'السمع', image: BellImage, hint: 'bell' },
  { item: 'آيس كريم', sense: 'التذوق', image: IcecreamImage, hint: 'ice cream' },
  { item: 'قوس قزح', sense: 'البصر', image: RainbowImage, hint: 'rainbow' },
];

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

export default function TestMySensesPage() {
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

  const handleAnswerSelect = (senseName: string) => {
    if (gameState !== 'playing' || selectedAnswer) return;

    setSelectedAnswer(senseName);
    setGameState('feedback');
    let newScore = score;
    if (senseName === currentQuestion?.sense) {
        setFeedback({ type: 'correct', message: 'إجابة ممتازة! أنت تستخدم حواسك ببراعة.' });
        newScore = score + 1;
        setScore(newScore);
    } else {
        setFeedback({ type: 'incorrect', message: `محاولة جيدة! نحن عادةً نستخدم حاسة '${currentQuestion?.sense}' لهذا.` });
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
        savedScores.testMySenses = score;
        localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));
        router.push(`/dashboard/student/${studentId}/assessment?testMySenses=${score}`);
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
                            <TestTube className="w-16 h-16 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl mb-4">مستعد لاختبار حواسك؟</CardTitle>
                        <p className="text-muted-foreground">ستخوض 4 خطوات. حاول أن تطابق الصورة مع الحاسة.</p>
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
                                بأي حاسة نتعرف على هذا الشيء؟
                            </p>
                        </CardHeader>
                        <CardContent>
                            {currentQuestion && (
                                <div className="flex flex-col items-center gap-4">
                                     <div className="relative w-[250px] h-[250px]">
                                        <Image 
                                            src={currentQuestion.image} 
                                            alt={currentQuestion.item} 
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
                        <h2 className="font-headline text-2xl text-center mb-6">اختر الحاسة</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {senses.map((sense) => (
                                <Button
                                    key={sense.name}
                                    onClick={() => handleAnswerSelect(sense.name)}
                                    disabled={gameState === 'feedback'}
                                    variant="outline"
                                    className={cn(
                                        "h-24 text-xl rounded-2xl transition-all duration-300",
                                        gameState === 'feedback' && sense.name !== currentQuestion?.sense && 'opacity-50',
                                        gameState === 'feedback' && sense.name === currentQuestion?.sense && 'bg-green-500/20 border-green-500 text-green-500 scale-105',
                                        gameState === 'feedback' && sense.name === selectedAnswer && sense.name !== currentQuestion?.sense && 'bg-red-500/20 border-red-500 text-red-500'
                                    )}
                                >
                                    <sense.icon className="w-8 h-8 mr-4"/>
                                    {sense.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {feedback && gameState === 'feedback' && (
                        <Alert className={`mt-8 max-w-3xl w-full ${feedback.type === 'correct' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           {feedback.type === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle className="font-bold">{feedback.type === 'correct' ? 'أنت عبقري!' : 'لنجرب مجدداً!'}</AlertTitle>
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
            لعبة اختبار حواسي
        </h1>
        {renderContent()}
    </div>
  );
}
