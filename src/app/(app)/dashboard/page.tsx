
'use client';

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, FileText, BarChart3, HelpCircle, BrainCircuit, Users, User, Trash2, PlusCircle, Filter, CalendarCheck, BookUser, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";


const materialSections = [
    {
        title: 'دليل المحتوى',
        icon: BookOpen,
        items: [
            { title: 'دليل السنة الاولى', href: '/pdf/Guide de Contenu.pdf', disabled: false },
            { title: 'دليل السنة الثانية', href: '#', disabled: true },
            { title: 'دليل السنة الثالثة', href: '#', disabled: true },
            { title: 'دليل السنة الرابعة', href: '#', disabled: true },
            { title: 'دليل السنة الخامسة', href: '#', disabled: true }
        ]
    },
    {
        title: 'دليل التقييم',
        icon: ClipboardList,
        items: [
            { title: 'تقييم السنة الاولى', href: '/pdf/Guide Evaluation.pdf', disabled: false },
            { title: 'تقييم السنة الثانية', href: '#', disabled: true },
            { title: 'تقييم السنة الثالثة', href: '#', disabled: true },
            { title: 'تقييم السنة الرابعة', href: '#', disabled: true },
            { title: 'دليل السنة الخامسة', href: '#', disabled: true }
        ]
    },
    {
        title: 'البطاقات التقنية',
        icon: FileText,
        items: [
            { title: 'بطاقات السنة الاولى', href: '/pdf/Fiche Technique.pdf', disabled: false },
            { title: 'بطاقات السنة الثانية', href: '#', disabled: true },
            { title: 'بطاقات السنة الثالثة', href: '#', disabled: true },
            { title: 'بطاقات السنة الرابعة', href: '#', disabled: true },
            { title: 'بطاقات السنة الخامسة', href: '#', disabled: true }
        ]
    },
];

const newSections = [
    {
        id: 'assessment-table',
        title: 'تقييم أعمال المرشد',
        icon: ClipboardList,
        description: 'كل تقارير المرشد',
        href: '/dashboard/assessment-table',
        disabled: false,
    },
    {
        id: 'activity-reports',
        title: 'النشاطات التطبيقية',
        icon: Activity,
        description: 'نظرة عامة على النشاطات التطبيقية',
        href: '#',
        disabled: true,
    }
];

const scalesSection = {
    title: 'المقاييس',
    icon: BarChart3,
    items: [
        { title: 'مقياس الألكسيثيميا', href: '/alexithymia-scale', icon: HelpCircle },
        { title: 'مقياس الذكاء العاطفي', href: '/emotional-intelligence-scale', icon: BrainCircuit },
    ]
};

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    birthYear: string;
    birthPlace: string;
    teacher: string;
    class: string;
    year: string;
}

interface Parent {
    id: string;
    name: string;
    studentName: string;
}


export default function DashboardPage() {
    const [students, setStudents] = React.useState<Student[]>([]);
    const [parents, setParents] = React.useState<Parent[]>([]);
    const [studentFilter, setStudentFilter] = React.useState("الكل");
    const [newStudent, setNewStudent] = React.useState<Omit<Student, 'id'>>({
        firstName: '',
        lastName: '',
        birthYear: '',
        birthPlace: '',
        teacher: '',
        class: '',
        year: ''
    });
    const [newParentName, setNewParentName] = React.useState('');
    const [selectedStudentId, setSelectedStudentId] = React.useState('');

    const [isStudentDialogOpen, setStudentDialogOpen] = React.useState(false);
    const [isParentDialogOpen, setParentDialogOpen] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    React.useEffect(() => {
        try {
            const savedStudents = localStorage.getItem('students');
            if (savedStudents) {
                setStudents(JSON.parse(savedStudents));
            }
            const savedParents = localStorage.getItem('parents');
            if (savedParents) {
                setParents(JSON.parse(savedParents));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    const saveStudents = (newStudents: Student[]) => {
        try {
            localStorage.setItem('students', JSON.stringify(newStudents));
        } catch (error) {
            console.error("Failed to save students to localStorage", error);
        }
    };
    
    const saveParents = (newParents: Parent[]) => {
        try {
            localStorage.setItem('parents', JSON.stringify(newParents));
        } catch (error) {
            console.error("Failed to save parents to localStorage", error);
        }
    };

    const handleStudentInputChange = (field: keyof Omit<Student, 'id'>, value: string) => {
        setNewStudent(prev => ({ ...prev, [field]: value }));
    };

    const handleAddStudent = () => {
        if (!newStudent.firstName || !newStudent.lastName || !newStudent.year) {
            toast({
                title: "خطأ",
                description: "الرجاء إدخال الاسم الأول والأخير والسنة الدراسية للتلميذ.",
                variant: "destructive",
            });
            return;
        }
        const newStudentWithId: Student = {
            id: `student_${Date.now()}`,
            ...newStudent
        };
        const updatedStudents = [...students, newStudentWithId];
        setStudents(updatedStudents);
        saveStudents(updatedStudents);
        setNewStudent({ firstName: '', lastName: '', birthYear: '', birthPlace: '', teacher: '', class: '', year: '' });
        setStudentDialogOpen(false);
        toast({
            title: "تمت الإضافة",
            description: `تم إضافة التلميذ ${newStudent.firstName} بنجاح.`,
        });
    };

    const handleDeleteStudent = (id: string) => {
        const updatedStudents = students.filter(s => s.id !== id);
        setStudents(updatedStudents);
        saveStudents(updatedStudents);
        // Also remove any parent links to this student
        const updatedParents = parents.filter(p => {
            const studentExists = updatedStudents.some(s => `${s.firstName} ${s.lastName}` === p.studentName);
            return studentExists;
        });
        setParents(updatedParents);
        saveParents(updatedParents);

        toast({
            title: "تم الحذف",
            description: "تم حذف التلميذ بنجاح.",
        });
    };

    const handleAddParent = () => {
        if (!newParentName || !selectedStudentId) {
            toast({
                title: "خطأ",
                description: "الرجاء إدخال اسم الولي واختيار التلميذ.",
                variant: "destructive",
            });
            return;
        }
        const student = students.find(s => s.id === selectedStudentId);
        if (!student) {
            toast({
                title: "خطأ",
                description: "التلميذ المختار غير موجود.",
                variant: "destructive",
            });
            return;
        }

        const newParentWithId: Parent = {
            id: `parent_${Date.now()}`,
            name: newParentName,
            studentName: `${student.firstName} ${student.lastName}`
        };
        const updatedParents = [...parents, newParentWithId];
        setParents(updatedParents);
        saveParents(updatedParents);
        setNewParentName('');
        setSelectedStudentId('');
        setParentDialogOpen(false);
        toast({
            title: "تمت الإضافة",
            description: `تم إضافة الولي ${newParentName} بنجاح.`,
        });
    };


    const filteredStudents = students.filter(student =>
        studentFilter === "الكل" || student.year === studentFilter
    );

    const handleNavigateToAssessment = (studentId: string) => {
        router.push(`/dashboard/student/${studentId}/assessment`);
    };

    return (
        <div className="space-y-8">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
                فضاء المرشد
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {newSections.map((section) => (
                     <Card key={section.title} className="bg-card/50 rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <section.icon className="w-8 h-8 text-primary" />
                                <CardTitle className="font-headline text-xl">{section.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground mb-4">{section.description}</p>
                            {section.disabled ? (
                                <Button className="w-full" disabled>قريباً</Button>
                            ) : (
                                <Link href={section.href} className="w-full">
                                    <Button className="w-full">الانتقال</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {materialSections.map((section) => (
                    <Card key={section.title} className="bg-card/50 rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <section.icon className="w-8 h-8 text-primary" />
                                <CardTitle className="font-headline text-xl">{section.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {section.items.map(item => (
                                     item.disabled ? (
                                        <Button key={item.title} variant="outline" className="h-12 w-full" disabled>
                                            {item.title}
                                        </Button>
                                    ) : (
                                        <a href={item.href} download key={item.href}>
                                            <Button variant="outline" className="h-12 w-full">{item.title}</Button>
                                        </a>
                                    )
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Card className="bg-card/50 rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <scalesSection.icon className="w-8 h-8 text-primary" />
                            <CardTitle className="font-headline text-xl">{scalesSection.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3">
                            {scalesSection.items.map(item => (
                                <Link href={item.href} key={item.href}>
                                    <Button variant="outline" className="h-12 w-full justify-start gap-4">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.title}</span>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-card/50 rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <User className="w-8 h-8 text-primary" />
                            <CardTitle className="font-headline text-2xl">قائمة التلاميذ</CardTitle>
                        </div>
                         <Dialog open={isStudentDialogOpen} onOpenChange={setStudentDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2" />
                                    إضافة تلميذ
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>إضافة تلميذ جديد</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">الاسم الأول</Label>
                                            <Input id="first-name" value={newStudent.firstName} onChange={(e) => handleStudentInputChange('firstName', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">الاسم الأخير</Label>
                                            <Input id="last-name" value={newStudent.lastName} onChange={(e) => handleStudentInputChange('lastName', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="birth-year">سنة الميلاد</Label>
                                            <Input id="birth-year" type="number" value={newStudent.birthYear} onChange={(e) => handleStudentInputChange('birthYear', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="birth-place">مكان الميلاد</Label>
                                            <Input id="birth-place" value={newStudent.birthPlace} onChange={(e) => handleStudentInputChange('birthPlace', e.target.value)} />
                                        </div>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="teacher">الأستاذ/ة</Label>
                                        <Input id="teacher" value={newStudent.teacher} onChange={(e) => handleStudentInputChange('teacher', e.target.value)} />
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="class">القسم</Label>
                                            <Input id="class" type="number" min="1" max="20" value={newStudent.class} onChange={(e) => handleStudentInputChange('class', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="year">السنة الدراسية</Label>
                                            <Select value={newStudent.year} onValueChange={(value) => handleStudentInputChange('year', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر السنة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="السنة الاولى">السنة الاولى</SelectItem>
                                                    <SelectItem value="السنة الثانية">السنة الثانية</SelectItem>
                                                    <SelectItem value="السنة الثالثة">السنة الثالثة</SelectItem>
                                                    <SelectItem value="السنة الرابعة">السنة الرابعة</SelectItem>
                                                    <SelectItem value="السنة الخامسة">السنة الخامسة</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                     </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">إلغاء</Button>
                                    </DialogClose>
                                    <Button onClick={handleAddStudent}>إضافة</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center gap-2 mb-4">
                           <Filter className="w-5 h-5" />
                           <Select value={studentFilter} onValueChange={setStudentFilter}>
                               <SelectTrigger className="w-[180px]">
                                   <SelectValue placeholder="تصفية حسب السنة" />
                               </SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="الكل">الكل</SelectItem>
                                   <SelectItem value="السنة الاولى">السنة الاولى</SelectItem>
                                   <SelectItem value="السنة الثانية">السنة الثانية</SelectItem>
                                   <SelectItem value="السنة الثالثة">السنة الثالثة</SelectItem>
                                   <SelectItem value="السنة الرابعة">السنة الرابعة</SelectItem>
                                   <SelectItem value="السنة الخامسة">السنة الخامسة</SelectItem>
                               </SelectContent>
                           </Select>
                       </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم الكامل</TableHead>
                                    <TableHead>السنة</TableHead>
                                    <TableHead>القسم</TableHead>
                                    <TableHead className="text-left">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.firstName} {student.lastName}</TableCell>
                                        <TableCell>{student.year}</TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" onClick={() => handleNavigateToAssessment(student.id)}>
                                                تقييم
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Users className="w-8 h-8 text-primary" />
                            <CardTitle className="font-headline text-2xl">قائمة الأولياء</CardTitle>
                        </div>
                        <Dialog open={isParentDialogOpen} onOpenChange={setParentDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2" />
                                    إضافة ولي
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>إضافة ولي أمر جديد</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="parent-name">اسم الولي</Label>
                                        <Input id="parent-name" value={newParentName} onChange={(e) => setNewParentName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="student-select">اختر التلميذ</Label>
                                         <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                            <SelectTrigger id="student-select">
                                                <SelectValue placeholder="اختر التلميذ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {students.map(student => (
                                                    <SelectItem key={student.id} value={student.id}>
                                                        {student.firstName} {student.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">إلغاء</Button>
                                    </DialogClose>
                                    <Button onClick={handleAddParent}>إضافة</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم الولي</TableHead>
                                    <TableHead>اسم التلميذ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parents.map((parent) => (
                                    <TableRow key={parent.id}>
                                        <TableCell>{parent.name}</TableCell>
                                        <TableCell>{parent.studentName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
