
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Shapes, Award, Smile, Frown, Annoyed, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import SoftPillowImage from './images/soft pillow.jpg';
import RockImage from './images/rock.png';
import CactusImage from './images/cactus.png';
import SoapBubblesImage from './images/SoapBubbles.webp';
import CuteCatImage from './images/Cute Cat.png';


const feelings = [
  { name: 'راحة', icon: Smile },
  { name: 'انزعاج', icon: Frown },
  { name: 'خوف', icon: Annoyed },
  { name: 'إنبهار', icon: Zap },
  { name: 'سعادة', icon: Smile },
];

const questionsData = [
  { item: 'وسادة ناعمة', feeling: 'راحة', image: SoftPillowImage, hint: 'soft pillow' },
  { item: 'صخرة خشنة', feeling: 'انزعاج', image: RockImage, hint: 'rough rock' },
  { item: 'صبار شائك', feeling: 'خوف', image: CactusImage, hint: 'spiky cactus' },
  { item: 'فقاعات صابون', feeling: 'إنبهار', image: SoapBubblesImage, hint: 'soap bubbles' },
  { item: 'قطة أليفة', feeling: 'سعادة', image: CuteCatImage, hint: 'pet cat' },
];

const TOTAL_ROUNDS = 5;

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

export default function WhichTexturePage() {
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

  const handleAnswerSelect = (feelingName: string) => {
    if (gameState !== 'playing' || selectedAnswer) return;

    setSelectedAnswer(feelingName);
    setGameState('feedback');
    let newScore = score;
    if (feelingName === currentQuestion?.feeling) {
        setFeedback({ type: 'correct', message: 'أنت بطل! اختيار موفق.' });
        newScore = score + 1;
        setScore(newScore);
    } else {
        setFeedback({ type: 'incorrect', message: `فكر جيداً! هذا الملمس عادةً ما يثير شعور '${currentQuestion?.feeling}'.` });
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
        savedScores.whichTexture = score;
        localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));
        router.push(`/dashboard/student/${studentId}/assessment?whichTexture=${score}`);
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
                            <Shapes className="w-16 h-16 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl mb-4">مستعد لاختبار الملمس؟</CardTitle>
                        <p className="text-muted-foreground">ستخوض 5 خطوات. حاول أن تطابق الملمس مع الشعور.</p>
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
             const answerFeelings = shuffleArray([...feelings]);
             return (
                <div className="w-full max-w-4xl flex flex-col items-center">
                    <Progress value={(currentRound / TOTAL_ROUNDS) * 100} className="w-full mb-6" />
                    <Card className="w-full text-center bg-card/50 rounded-2xl p-8 mb-6">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl mb-4">الخطوة {currentRound} / {TOTAL_ROUNDS}</CardTitle>
                             <p className="text-2xl font-bold text-foreground">
                                ما هو شعورك عند لمس هذا الشيء؟
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
                        <h2 className="font-headline text-2xl text-center mb-6">اختر الشعور</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {answerFeelings.map((feeling) => (
                                <Button
                                    key={feeling.name}
                                    onClick={() => handleAnswerSelect(feeling.name)}
                                    disabled={gameState === 'feedback'}
                                    variant="outline"
                                    className={cn(
                                        "h-24 text-xl rounded-2xl transition-all duration-300",
                                        gameState === 'feedback' && feeling.name !== currentQuestion?.feeling && 'opacity-50',
                                        gameState === 'feedback' && feeling.name === currentQuestion?.feeling && 'bg-green-500/20 border-green-500 text-green-500 scale-105',
                                        gameState === 'feedback' && feeling.name === selectedAnswer && feeling.name !== currentQuestion?.feeling && 'bg-red-500/20 border-red-500 text-red-500'
                                    )}
                                >
                                    <feeling.icon className="w-8 h-8 mr-4"/>
                                    {feeling.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {feedback && gameState === 'feedback' && (
                        <Alert className={`mt-8 max-w-3xl w-full ${feedback.type === 'correct' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           {feedback.type === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle className="font-bold">{feedback.type === 'correct' ? 'ممتاز!' : 'حاول مرة أخرى!'}</AlertTitle>
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
            لعبة أي ملمس؟
        </h1>
        {renderContent()}
    </div>
  );
}
