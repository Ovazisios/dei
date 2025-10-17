
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Volume2, Smile, Frown, Angry, Annoyed, Zap, CheckCircle2, XCircle, Loader2, Award, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { soundEmotionAnalyzer } from '@/ai/flows/sound-emotion-analyzer';
import { useRouter, useSearchParams } from 'next/navigation';

const emotions = [
  { name: 'فرح', icon: Smile, color: 'text-yellow-400' },
  { name: 'حزن', icon: Frown, color: 'text-blue-400' },
  { name: 'غضب', icon: Angry, color: 'text-red-500' },
  { name: 'خوف', icon: Annoyed, color: 'text-purple-400' },
  { name: 'قشعريرة', icon: Zap, color: 'text-green-400' },
];

const sounds = [
    { name: 'تصفيق', emotion: 'فرح', file: '/sounds/Happy.mp3' },
    { name: 'بكاء', emotion: 'حزن', file: '/sounds/Sadness.mp3' },
    { name: 'زمجرة', emotion: 'غضب', file: '/sounds/Anger.mp3' },
    { name: 'رعد', emotion: 'خوف', file: '/sounds/Fear.mp3' },
    { name: 'موسيقى مفاجئة', emotion: 'قشعريرة', file: '/sounds/Surprise.mp3' },
];

const TOTAL_ROUNDS = 5;

type GameState = 'idle' | 'playing' | 'feedback' | 'finished';

export default function SoundsAndFeelingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [currentRound, setCurrentRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [currentSound, setCurrentSound] = React.useState<{ name: string; emotion: string; file: string } | null>(null);
  const [selectedEmotion, setSelectedEmotion] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{type: 'correct' | 'incorrect', message: string} | null>(null);
  const [isSoundPlaying, setIsSoundPlaying] = React.useState(false);
  const [playedSounds, setPlayedSounds] = React.useState<string[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Cleanup audio on component unmount
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const startNewGame = () => {
    setCurrentRound(1);
    setScore(0);
    setGameState('playing');
    const newPlayedSounds: string[] = [];
    setPlayedSounds(newPlayedSounds);
    playNextSound(newPlayedSounds);
  };
  
  const playNextSound = (soundsPlayedSoFar: string[]) => {
    setSelectedEmotion(null);
    setFeedback(null);
    
    const availableSounds = sounds.filter(s => !soundsPlayedSoFar.includes(s.name));
    if (availableSounds.length === 0 || soundsPlayedSoFar.length >= TOTAL_ROUNDS) {
        setGameState('finished');
        return;
    }

    setGameState('playing');
    const randomIndex = Math.floor(Math.random() * availableSounds.length);
    const sound = availableSounds[randomIndex];
    setCurrentSound(sound);
    const updatedPlayedSounds = [...soundsPlayedSoFar, sound.name];
    setPlayedSounds(updatedPlayedSounds);
    
    playSoundFile(sound.file);
  };

  const playSoundFile = (file: string) => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    audioRef.current = new Audio(file);
    audioRef.current.onplay = () => setIsSoundPlaying(true);
    audioRef.current.onended = () => setIsSoundPlaying(false);
    audioRef.current.play();
  }


  const handleEmotionSelect = (emotionName: string) => {
    if (gameState !== 'playing' || isSoundPlaying || selectedEmotion) return;

    setSelectedEmotion(emotionName);
    setGameState('feedback');
    let newScore = score;
    if (emotionName === currentSound?.emotion) {
        setFeedback({ type: 'correct', message: 'عمل رائع! أنت تعرف مشاعرك جيداً.' });
        newScore = score + 1;
        setScore(newScore);
    } else {
        setFeedback({ type: 'incorrect', message: `محاولة جيدة! هذا الصوت عادةً ما يعبر عن '${currentSound?.emotion}'. لنجرب مرة أخرى!` });
    }

    setTimeout(() => {
        if (currentRound < TOTAL_ROUNDS) {
            setCurrentRound(prev => prev + 1);
            playNextSound(playedSounds);
        } else {
            setGameState('finished');
        }
    }, 2000);
  };
  
  const viewResults = () => {
    if (studentId) {
        const savedScores = JSON.parse(localStorage.getItem(`scores_${studentId}`) || '{}');
        savedScores.soundsAndFeelings = score;
        localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));
        router.push(`/dashboard/student/${studentId}/assessment?soundsAndFeelings=${score}`);
    } else {
      router.push(`/student-space/results?score=${score}`);
    }
  }

  const renderContent = () => {
      switch(gameState) {
        case 'idle':
            return (
                <Card className="w-full max-w-3xl text-center bg-card/50 rounded-2xl p-8">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl mb-4">هل أنت مستعد لبدء النشاط؟</CardTitle>
                        <p className="text-muted-foreground">ستستمع إلى 5 أصوات مختلفة. حاول أن تخمن الشعور لكل صوت.</p>
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
                        <CardTitle className="font-headline text-3xl mb-4 flex items-center justify-center gap-2"><Award className="w-8 h-8 text-yellow-400" />انتهى النشاط!</CardTitle>
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
                        </CardHeader>
                        <CardContent>
                             <Button 
                                size="lg" 
                                className="w-48 h-16 text-xl rounded-full"
                                onClick={() => currentSound && playSoundFile(currentSound.file)}
                                disabled={isSoundPlaying || gameState === 'feedback'}
                            >
                                <Volume2 className="mr-2 h-8 w-8" />
                                {isSoundPlaying ? '...جاري التشغيل' : 'أعد تشغيل الصوت'}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="w-full max-w-3xl">
                        <h2 className="font-headline text-2xl text-center mb-6">بماذا تشعر عند سماع هذا الصوت</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {emotions.map((emotion) => (
                            <Card
                                key={emotion.name}
                                onClick={() => handleEmotionSelect(emotion.name)}
                                className={`
                                    bg-card/60 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square
                                    cursor-pointer transition-all duration-300 ease-in-out
                                    border-2 border-transparent
                                    ${gameState === 'feedback' ? 
                                        (emotion.name === currentSound?.emotion ? 'border-green-500 scale-105 shadow-lg' : 
                                        emotion.name === selectedEmotion ? 'border-red-500 opacity-60' : 'opacity-60') 
                                        : 'hover:border-primary/50 hover:scale-105 hover:shadow-lg'
                                    }
                                `}
                            >
                                <emotion.icon className={`w-16 h-16 mb-2 ${emotion.color}`} />
                                <p className="text-xl font-semibold">{emotion.name}</p>
                            </Card>
                        ))}
                        </div>
                    </div>

                    {feedback && gameState === 'feedback' && (
                        <Alert className={`mt-8 max-w-3xl w-full ${feedback.type === 'correct' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           {feedback.type === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <AlertTitle className="font-bold">{feedback.type === 'correct' ? 'رائع!' : 'لا بأس!'}</AlertTitle>
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
            صندوق الأصوات والمشاعر
        </h1>
        {renderContent()}
    </div>
  );
}
