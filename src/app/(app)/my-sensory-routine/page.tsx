
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Brain, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image, { type StaticImageData } from 'next/image';

import LoudMusicImage from './images/Loud Music.png';
import ItchyShirtImage from './images/itchy shirt.png';
import BrightLightImage from './images/Bright Light.png';
import SmellyFoodImage from './images/smelly Food.png';

interface Question {
  scenario: string;
  image: StaticImageData;
  hint: string;
  options: string[];
  correctAnswer: string;
}

const questionsData: Question[] = [
  {
    scenario: 'صوت الموسيقى عالٍ جداً، ماذا تفعل؟',
    image: LoudMusicImage,
    hint: 'loud music',
    options: ['أصرخ بصوت عالٍ', 'أغطي أذني', 'أبقى وأستمع'],
    correctAnswer: 'أغطي أذني'
  },
  {
    scenario: 'ملابسك الجديدة تسبب لك الحكة، ماذا تفعل؟',
    image: ItchyShirtImage,
    hint: 'itchy sweater',
    options: ['أخلعها فوراً', 'أطلب المساعدة من أمي', 'أبدأ في البكاء'],
    correctAnswer: 'أطلب المساعدة من أمي'
  },
  {
    scenario: 'الضوء في الغرفة ساطع جداً، ماذا تفعل؟',
    image: BrightLightImage,
    hint: 'bright lights',
    options: ['أرتدي نظارات شمسية', 'أغلق عيني', 'أطلب إطفاء الضوء'],
    correctAnswer: 'أطلب إطفاء الضوء'
  },
  {
    scenario: 'هناك طعام لا تحب رائحته، ماذا تفعل؟',
    image: SmellyFoodImage,
    hint: 'stinky food',
    options: ['أغلق أنفي', 'أبتعد عن المكان', 'أقول "رائحته كريهة" بصوت عالٍ'],
    correctAnswer: 'أبتعد عن المكان'
  },
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

export default function MySensoryRoutinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [currentRound, setCurrentRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [questions, setQuestions] = React.useState(shuffleArray([...questionsData]));
  const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>(null);
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

  const handleAnswerSelect = (answer: string) => {
    if (gameState !== 'playing' || selectedAnswer) return;

    setSelectedAnswer(answer);
    setGameState('feedback');
    let newScore = score;
    if (answer === currentQuestion?.correctAnswer) {
        setFeedback({ type: 'correct', message: 'تصرف حكيم! أنت تتعلم بسرعة.' });
        newScore = score + 1;
        setScore(newScore);
    } else {
        setFeedback({ type: 'incorrect', message: `اختيار جيد أيضاً! لكن '${currentQuestion?.correctAnswer}' قد يكون تصرفاً أفضل في هذا الموقف.` });
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
      savedScores.mySensoryRoutine = score;
      localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));
      router.push(`/dashboard/student/${studentId}/assessment?mySensoryRoutine=${score}`);
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
                            <Brain className="w-16 h-16 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl mb-4">مستعد لتمارين روتينك الحسي؟</CardTitle>
                        <p className="text-muted-foreground">ستمر بأربعة مواقف يومية. اختر ردة الفعل الأفضل في كل مرة.</p>
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
                        <CardTitle className="font-headline text-3xl mb-4">انتهى التمرين!</CardTitle>
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
             if (!currentQuestion) return null;
             return (
                <div className="w-full max-w-4xl flex flex-col items-center">
                    <Progress value={(currentRound / TOTAL_ROUNDS) * 100} className="w-full mb-6" />
                    <Card className="w-full text-center bg-card/50 rounded-2xl p-8 mb-6">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl mb-4">الخطوة {currentRound} / {TOTAL_ROUNDS}</CardTitle>
                             <p className="text-2xl font-bold text-foreground">
                                {currentQuestion.scenario}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <div className="relative w-[250px] h-[250px]">
                                    <Image 
                                        src={currentQuestion.image} 
                                        alt={currentQuestion.scenario}
                                        data-ai-hint={currentQuestion.hint}
                                        className="rounded-lg bg-muted object-contain w-full h-full"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="w-full">
                        <h2 className="font-headline text-2xl text-center mb-6">اختر ردة فعلك</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {shuffleArray([...currentQuestion.options]).map((option) => (
                                <Button
                                    key={option}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={gameState === 'feedback'}
                                    variant="outline"
                                    className={cn(
                                        "h-24 text-lg rounded-2xl transition-all duration-300",
                                        gameState === 'feedback' && option !== currentQuestion?.correctAnswer && 'opacity-50',
                                        gameState === 'feedback' && option === currentQuestion?.correctAnswer && 'bg-green-500/20 border-green-500 text-green-500 scale-105',
                                        gameState === 'feedback' && option === selectedAnswer && option !== currentQuestion?.correctAnswer && 'bg-red-500/20 border-red-500 text-red-500'
                                    )}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {feedback && gameState === 'feedback' && (
                        <Alert className={`mt-8 max-w-3xl w-full ${feedback.type === 'correct' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           {feedback.type === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle className="font-bold">{feedback.type === 'correct' ? 'أحسنت!' : 'فكرة جيدة!'}</AlertTitle>
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
            لعبة روتيني الحسي
        </h1>
        {renderContent()}
    </div>
  );
}
