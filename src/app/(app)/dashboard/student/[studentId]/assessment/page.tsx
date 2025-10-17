
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, BarChart3, Activity, Edit, User, Music, Save, Palette, SmilePlus, Shapes, TestTube, Brain, Utensils } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

const placeholderActivities = [
  {
    id: "sounds-and-feelings",
    title: "صندوق الأصوات والمشاعر",
    description: "نشاط تفاعلي لربط الأصوات بالمشاعر.",
    icon: Music,
    href: (studentId: string) => `/sounds-and-feelings?studentId=${studentId}`
  },
  {
    id: "my-feelings-colors",
    title: "ألوان مشاعري",
    description: "اختر لوناً يعبر عن مشاعرك الحالية.",
    icon: Palette,
    href: (studentId: string) => `/my-feelings-colors?studentId=${studentId}`
  },
  {
    id: "facial-expression",
    title: "النكهة و الشعور",
    description: "طابق بين النكهات والمشاعر التي تثيرها.",
    icon: Utensils,
    href: (studentId: string) => `/facial-expression?studentId=${studentId}`
  },
  {
    id: "which-texture",
    title: "أي ملمس؟",
    description: "اختر الشعور المرافق لشكل أو مادة.",
    icon: Shapes,
    href: (studentId: string) => `/which-texture?studentId=${studentId}`
  },
  {
    id: "test-my-senses",
    title: "اختبار حواسي",
    description: "طابق بين عناصر متعددة لتنمية التكامل الحسي.",
    icon: TestTube,
    href: (studentId: string) => `/test-my-senses?studentId=${studentId}`
  },
  {
    id: "my-sensory-routine",
    title: "روتيني الحسي",
    description: "اختر رد فعلك المناسب في مواقف يومية.",
    icon: Brain,
    href: (studentId: string) => `/my-sensory-routine?studentId=${studentId}`
  },
];

const testsInfo = [
    { id: 'sounds-and-feelings', title: 'صندوق الأصوات والمشاعر', scoreKey: 'soundsAndFeelings' },
    { id: 'my-feelings-colors', title: 'ألوان مشاعري', scoreKey: 'myFeelingsColors' },
    { id: 'facial-expression', title: 'النكهة و الشعور', scoreKey: 'facialExpression' },
    { id: 'which-texture', title: 'أي ملمس؟', scoreKey: 'whichTexture' },
    { id: 'test-my-senses', title: 'اختبار حواسي', scoreKey: 'testMySenses' },
    { id: 'my-sensory-routine', title: 'روتيني الحسي', scoreKey: 'mySensoryRoutine' },
];

function AssessmentPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = params.studentId as string;
  const { toast } = useToast();
  
  const [student, setStudent] = React.useState<{ name: string } | null>(null);
  const [reportText, setReportText] = React.useState('');
  const [scores, setScores] = React.useState<Record<string, number | null>>({});

  // Load student data and scores from localStorage and URL params on mount
  React.useEffect(() => {
    // Load student name
    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const currentStudent = allStudents.find((s: any) => s.id === studentId);
    setStudent(currentStudent || { name: "تلميذ غير معروف" });

    // Load scores from localStorage
    const savedScores = JSON.parse(localStorage.getItem(`scores_${studentId}`) || '{}');
    
    // Merge scores from URL params (if any)
    testsInfo.forEach(test => {
        const urlScore = searchParams.get(test.scoreKey);
        if (urlScore) {
            savedScores[test.scoreKey] = parseInt(urlScore, 10);
        }
    });

    setScores(savedScores);
    localStorage.setItem(`scores_${studentId}`, JSON.stringify(savedScores));

    // Load report
    const savedReport = localStorage.getItem(`report_${studentId}`);
    if (savedReport) {
      setReportText(savedReport);
    }

  }, [studentId, searchParams]);


  const handleSaveReport = () => {
    localStorage.setItem(`report_${studentId}`, reportText);
    toast({
        title: "تم حفظ التقرير",
        description: "تم حفظ تقرير التلميذ بنجاح.",
    });
  };
  
  const tests = testsInfo.map(test => ({
      id: test.id,
      title: test.title,
      score: scores[test.scoreKey] ?? null
  }));

  const totalScore = 5;
  const totalTests = placeholderActivities.length;
  const completedTests = Object.values(scores).filter(s => s !== null).length;
  const currentTotalScore = Object.values(scores).reduce((acc, score) => acc + (score || 0), 0);
  const maxPossibleScore = completedTests * totalScore;


  if (!student) {
    return <div>Loading student data...</div>;
  }

  return (
    <div className="animate-in fade-in-50 space-y-8">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/50">
            <User className="w-8 h-8 text-primary" />
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                    تقييم التلميذ: {student.name}
                </h1>
                <p className="text-foreground">عرض شامل للنتائج وملاحظات المرشد</p>
            </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderActivities.map((activity) => (
          <Card key={activity.id} className="bg-card/50 hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <activity.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl text-foreground">{activity.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{activity.description}</p>
              <Button asChild className="mt-4 w-full">
                <Link href={activity.href(studentId)}>بدء النشاط</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
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
              {tests.map(test => (
                 <div key={test.id}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">{test.title}</h3>
                        {test.score !== null ? (
                            <p className="font-mono text-lg">{test.score}/{totalScore}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">لم يتم بعد</p>
                        )}
                    </div>
                    <Progress value={test.score !== null ? (test.score / totalScore) * 100 : 0} />
                </div>
              ))}

                <div className="border-t border-border pt-4 mt-4">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-xl text-primary">النتيجة الإجمالية</h3>
                         {completedTests > 0 ? (
                           <p className="font-mono text-xl text-primary">{currentTotalScore}/{maxPossibleScore}</p>
                         ): (
                            <p className="font-mono text-xl text-primary">0/{totalScore * totalTests}</p>
                         )}
                    </div>
                    <Progress value={maxPossibleScore > 0 ? (currentTotalScore / (totalScore * totalTests)) * 100 : 0} />
                </div>

            </CardContent>
        </Card>

        <Card className="bg-card/50 rounded-2xl">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Edit className="w-8 h-8 text-primary" />
                    <CardTitle className="font-headline text-2xl">كتابة تقرير</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                  placeholder="اكتب تقريرك هنا... مثال: التلميذ يظهر تحسناً ملحوظاً في التعرف على مشاعر الفرح والحزن، لكنه لا يزال يواجه صعوبة في التمييز بين الغضب والخوف."
                  className="min-h-[150px] bg-background rounded-xl"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
                <Button className="w-full" onClick={handleSaveReport}>
                    <Save className="mr-2 h-4 w-4"/>
                    حفظ التقرير
                </Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}


export default function StudentAssessmentPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <AssessmentPageContent />
        </React.Suspense>
    )
}

    