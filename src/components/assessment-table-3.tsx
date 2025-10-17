
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';

interface QuarterlyReportRow {
  id: string;
  achievedGoals: string;
  progressPercentage: string;
  strengths: string;
  weaknesses: string;
  supportActivities: string;
  interventionPlan: string;
  counselorSignature: string;
}

export default function AssessmentTable3() {
  const { toast } = useToast();
  const STORAGE_KEY_HEADER = 'assessmentTable3_Header';
  const STORAGE_KEY_DATA = 'assessmentTable3_Data';

  // Header State
  const [semester, setSemester] = React.useState('');
  const [counselorName, setCounselorName] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [directorate, setDirectorate] = React.useState('');
  const [institutionName, setInstitutionName] = React.useState('');

  // Table State
  const [reportData, setReportData] = React.useState<QuarterlyReportRow[]>([]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    try {
      const savedHeader = localStorage.getItem(STORAGE_KEY_HEADER);
      if (savedHeader) {
        const header = JSON.parse(savedHeader);
        setSemester(header.semester || '');
        setCounselorName(header.counselorName || '');
        setLevel(header.level || '');
        setDirectorate(header.directorate || '');
        setInstitutionName(header.institutionName || '');
      }

      const savedTable = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedTable) {
        setReportData(JSON.parse(savedTable));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast({ title: "خطأ", description: "فشل تحميل البيانات المحفوظة.", variant: "destructive" });
    }
  }, [toast]);

  // Save data to localStorage whenever it changes
  React.useEffect(() => {
    try {
      const headerData = { semester, counselorName, level, directorate, institutionName };
      localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(headerData));
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(reportData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      toast({ title: "خطأ", description: "فشل حفظ البيانات.", variant: "destructive" });
    }
  }, [semester, counselorName, level, directorate, institutionName, reportData]);


  const handleTableChange = (id: string, field: keyof QuarterlyReportRow, value: string) => {
    setReportData(prevData => 
        prevData.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        )
    );
  };

  const addRow = () => {
    const newRow: QuarterlyReportRow = {
      id: `row_${Date.now()}`,
      achievedGoals: '',
      progressPercentage: '',
      strengths: '',
      weaknesses: '',
      supportActivities: '',
      interventionPlan: '',
      counselorSignature: '',
    };
    setReportData(prevData => [...prevData, newRow]);
    toast({ title: "تم", description: "تمت إضافة صف جديد." });
  };

  const deleteRow = (id: string) => {
    setReportData(prevData => prevData.filter(row => row.id !== id));
    toast({ title: "تم الحذف", description: "تم حذف الصف بنجاح." });
  };

  return (
    <Card className="bg-card/50 rounded-2xl overflow-hidden">
        <CardHeader>
            <CardTitle>جدول التقرير الفصلي (ثلاثي)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg">
            <div className="space-y-2">
                <Label>الفصل</Label>
                <Input value={semester} onChange={e => setSemester(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>اسم المرشد</Label>
                <Input value={counselorName} onChange={e => setCounselorName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>القسم/المستوى</Label>
                <Input value={level} onChange={e => setLevel(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>مديرية التربية لولاية</Label>
                <Input value={directorate} onChange={e => setDirectorate(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>اسم المؤسسة</Label>
                <Input value={institutionName} onChange={e => setInstitutionName(e.target.value)} />
            </div>
        </div>

        <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-border">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">أبرز الأهداف المحققة</TableHead>
                    <TableHead className="w-[150px]">نسبة التقدم العامة (%)</TableHead>
                    <TableHead className="w-[200px]">نقاط القوة</TableHead>
                    <TableHead className="w-[200px]">نقاط الضعف</TableHead>
                    <TableHead className="w-[200px]">أنشطة الدعم الإضافية</TableHead>
                    <TableHead className="w-[200px]">خطة التدخل للفصل القادم</TableHead>
                    <TableHead className="w-[150px]">توقيع المرشد</TableHead>
                    <TableHead className="w-[50px]">إجراء</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reportData.map(row => (
                <TableRow key={row.id}>
                    <TableCell><Textarea value={row.achievedGoals} onChange={e => handleTableChange(row.id, 'achievedGoals', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={row.progressPercentage} onChange={e => handleTableChange(row.id, 'progressPercentage', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.strengths} onChange={e => handleTableChange(row.id, 'strengths', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.weaknesses} onChange={e => handleTableChange(row.id, 'weaknesses', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.supportActivities} onChange={e => handleTableChange(row.id, 'supportActivities', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.interventionPlan} onChange={e => handleTableChange(row.id, 'interventionPlan', e.target.value)} /></TableCell>
                    <TableCell><Input value={row.counselorSignature} onChange={e => handleTableChange(row.id, 'counselorSignature', e.target.value)} /></TableCell>
                    <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => deleteRow(row.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        <div className="mt-6">
            <Button onClick={addRow}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة صف جديد
            </Button>
        </div>
        </CardContent>
    </Card>
  );
}

