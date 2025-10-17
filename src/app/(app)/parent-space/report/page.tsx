
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Edit, Loader2, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock student data - in a real app this would come from an API
const studentId = '2'; // Hardcoded for this demo
const student = { name: 'أحمد علي' };

const testsInfo = [
    { id: 'soundsAndFeelings', title: 'صندوق الأصوات والمشاعر', scoreKey: 'soundsAndFeelings' },
    { id: 'myFeelingsColors', title: 'ألوان مشاعري', scoreKey: 'myFeelingsColors' },
    { id: 'facialExpression', title: 'التعبير الوجهي والشعوري', scoreKey: 'facialExpression' },
    { id: 'whichTexture', title: 'أي ملمس؟', scoreKey: 'whichTexture' },
    { id: 'testMySenses', title: 'اختبار حواسي', scoreKey: 'testMySenses' },
    { id: 'mySensoryRoutine', title: 'روتيني الحسي', scoreKey: 'mySensoryRoutine' },
];

function ParentReportPageContent() {
    const [reportText, setReportText] = React.useState('');
    const [scores, setScores] = React.useState<any>({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching the report and scores from a data source
        const savedReport = localStorage.getItem(`report_${studentId}`);
        const savedScores = JSON.parse(localStorage.getItem(`scores_${studentId}`) || '{}');
        
        if (savedReport) {
            setReportText(savedReport);
        }
        setScores(savedScores);
        setIsLoading(false);
    }, []);

    const totalScore = 5;

    return (
        <div className="animate-in fade-in-50 space-y-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/50">
                <User className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">
                        تقرير التلميذ: {student.name}
                    </h1>
                    <p className="text-muted-foreground">عرض شامل لنتائج وملاحظات المرشد.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-card/50 rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <BarChart3 className="w-8 h-8 text-primary" />
                            <CardTitle className="font-headline text-2xl">نتائج التقييمات</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {isLoading ? (
                             <div className="flex items-center justify-center h-24">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : testsInfo.length > 0 ? (
                            testsInfo.map(test => {
                                const score = scores[test.scoreKey];
                                return (
                                     <div key={test.id}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold">{test.title}</h3>
                                            {score !== undefined && score !== null ? (
                                                <p className="font-mono text-lg">{score}/{totalScore}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">لم يتم بعد</p>
                                            )}
                                        </div>
                                        <Progress value={score !== undefined && score !== null ? (score / totalScore) * 100 : 0} />
                                    </div>
                                )
                            })
                        ) : (
                             <p className="text-muted-foreground">لا توجد نتائج تقييمات متاحة بعد.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card/50 rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Edit className="w-8 h-8 text-primary" />
                            <CardTitle className="font-headline text-2xl">تقرير المرشد</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-24">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : reportText ? (
                            <p className="text-muted-foreground whitespace-pre-wrap">{reportText}</p>
                        ) : (
                            <p className="text-muted-foreground">لم يكتب المرشد تقريراً بعد.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ParentReportPage() {
    return (
        <React.Suspense fallback={<div className='flex items-center justify-center h-full'><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
            <ParentReportPageContent />
        </React.Suspense>
    );
}
