
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, BarChart3, BookCheck, Star, Activity, Book, FileText, Music, Palette, SmilePlus, Shapes, TestTube, Brain, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as React from "react";

const studentActivities = [
  {
    id: "my-feelings-colors",
    scoreKey: 'myFeelingsColors',
    title: "ألوان مشاعري",
    description: "اختر لوناً يعبر عن مشاعرك الحالية.",
    icon: Palette,
    href: (studentId: string) => `/my-feelings-colors?studentId=${studentId}`
  },
  {
    id: "sounds-and-feelings",
    scoreKey: 'soundsAndFeelings',
    title: "أميّز الأصوات من حولي",
    description: "نشاط تفاعلي لربط الأصوات بالمشاعر.",
    icon: Music,
    href: (studentId: string) => `/sounds-and-feelings?studentId=${studentId}`
  },
  {
    id: "facial-expression",
    scoreKey: 'facialExpression',
    title: "النكهة و الشعور",
    description: "طابق بين النكهات والمشاعر التي تثيرها.",
    icon: Utensils,
    href: (studentId: string) => `/facial-expression?studentId=${studentId}`
  },
  {
    id: "which-texture",
    scoreKey: 'whichTexture',
    title: "أي ملمس؟",
    description: "اختر الشعور المرافق لشكل أو مادة.",
    icon: Shapes,
    href: (studentId: string) => `/which-texture?studentId=${studentId}`
  },
  {
    id: "test-my-senses",
    scoreKey: 'testMySenses',
    title: "اختبار حواسي",
    description: "طابق بين عناصر متعددة لتنمية التكامل الحسي.",
    icon: TestTube,
    href: (studentId: string) => `/test-my-senses?studentId=${studentId}`
  },
  {
    id: "my-sensory-routine",
    scoreKey: 'mySensoryRoutine',
    title: "روتيني الحسي",
    description: "اختر رد فعلك المناسب في مواقف يومية.",
    icon: Brain,
    href: (studentId: string) => `/my-sensory-routine?studentId=${studentId}`
  },
];

const achievements = [
  { title: "متمكن", icon: Star },
  { title: "قيد الاكتساب", icon: Star },
  { title: "يحتاج دعم", icon: Star },
  { title: "يحتاج تكفل", icon: Star },
];

export default function StudentSpacePage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [student, setStudent] = React.useState<{ name: string } | null>(null);
  const [completedTests, setCompletedTests] = React.useState(0);
  const totalTests = studentActivities.length;


  React.useEffect(() => {
    if (studentId) {
      // Load student info
      const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const currentStudent = allStudents.find((s: any) => s.id === studentId);
      setStudent(currentStudent || { name: 'تلميذ' });

      // Load scores and calculate completed tests
      const savedScores = JSON.parse(localStorage.getItem(`scores_${studentId}`) || '{}');
      const completedCount = studentActivities.filter(activity => savedScores[activity.scoreKey] !== undefined && savedScores[activity.scoreKey] !== null).length;
      setCompletedTests(completedCount);
    }
  }, [studentId]);


  if (!student) {
    return <div>Loading...</div>
  }

  return (
    <div className="animate-in fade-in-50 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">
          👦👧 فضاء المتمدرس: {student.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {studentActivities.map((activity) => (
             <Link href={activity.href(studentId)} key={activity.id} className="group h-full">
              <Card className="bg-card/50 hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-2xl h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                  <activity.icon className="w-8 h-8 text-primary" />
                  <CardTitle className="font-headline text-xl text-foreground">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{activity.description}</p>
                </CardContent>
              </Card>
             </Link>
          ))}
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> تقرير النتائج</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">تابع تقدمك ونتائج تقييماتك المستمرة.</p>
                    <Link href={`/student-space/results?studentId=${studentId}`}>
                        <Button className="mt-4">عرض التقرير</Button>
                    </Link>
                </CardContent>
            </Card>
            <Card className="bg-card/50 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookCheck /> الأنشطة المنجزة</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-2">لقد أكملت حتى الآن:</p>
                    <p className="text-4xl font-bold text-primary">{completedTests} / {totalTests}</p>
                    <p className="text-sm text-muted-foreground mt-1">من الأنشطة المتاحة.</p>
                </CardContent>
            </Card>
         </div>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="rounded-2xl bg-card/50 sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span>أوسمة الإنجاز</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              اجمع الأوسمة مع كل نشاط تكمله. أنت رائع!
            </p>
            <div className="flex flex-wrap gap-2">
              {achievements.map((badge) => (
                <Badge key={badge.title} variant="secondary" className="text-base py-1 px-3 rounded-full border-primary/50">
                  <badge.icon className="w-4 h-4 ml-2 text-yellow-500" />
                  {badge.title}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
