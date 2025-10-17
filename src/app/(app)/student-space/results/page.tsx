
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Award, Sparkles, Home, CheckCircle } from 'lucide-react';
import { soundEmotionAnalyzer } from '@/ai/flows/sound-emotion-analyzer';

const TOTAL_ROUNDS = 5;

type ReportState = 'analyzing' | 'report' | 'error' | 'idle';

function ResultsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scoreParam = searchParams.get('score');
    const score = scoreParam ? parseInt(scoreParam, 10) : null;
    const activity = searchParams.get('activity');
    const studentId = searchParams.get('studentId');

    const handleNext = () => {
        if (studentId) {
             router.push(`/student/${studentId}`);
        } else {
            router.push(`/`);
        }
    };

    if (score === null && !studentId) {
        return (
             <Card className="w-full max-w-3xl text-center bg-card/50 rounded-2xl p-8">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl mb-4">لا توجد نتائج لعرضها</CardTitle>
                    <p className="text-muted-foreground">الرجاء إكمال نشاط أولاً لعرض نتائجك هنا.</p>
                </CardHeader>
                <CardContent>
                    <Button size="lg" onClick={() => router.push(studentId ? `/student/${studentId}` : '/')}>
                       العودة
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-3xl text-center bg-card/50 rounded-2xl p-8 animate-in fade-in-50">
           <CardHeader>
               <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
               </div>
               <CardTitle className="font-headline text-3xl mb-4">أحسنت! لقد أكملت النشاط بنجاح.</CardTitle>
               <p className="text-foreground text-lg">نحن فخورون بمجهودك. كل محاولة هي خطوة جديدة في التعلم.</p>
           </CardHeader>
           <CardContent>
                <Alert className="text-center bg-background/50 border-primary/30 mt-4">
                   <Sparkles className="h-4 w-4 text-primary" />
                   <AlertTitle className="font-bold text-primary">ملاحظة</AlertTitle>
                   <AlertDescription className="whitespace-pre-wrap text-foreground">
                       أنت تقوم بعمل رائع في استكشاف مشاعرك وأحاسيسك! استمر في اللعب والتعلم.
                   </AlertDescription>
               </Alert>
               <Button size="lg" className="mt-8" onClick={handleNext}>
                   <Home className="mr-2" />
                    العودة إلى صفحة الأنشطة
               </Button>
           </CardContent>
       </Card>
    )
}


export default function ResultsPage() {
    return (
        <div className="animate-in fade-in-50 flex flex-col items-center p-4">
             <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">
                نهاية النشاط
            </h1>
            <React.Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
                <ResultsPageContent />
            </React.Suspense>
        </div>
    )
}
