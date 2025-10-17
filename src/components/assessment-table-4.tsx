
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

interface AnnualReportRow {
  id: string;
  activitiesSummary: string;
  sensoryAwarenessLevel: string;
  selfAwarenessLevel: string;
  nonVerbalExpressionLevel: string;
  verbalExpressionLevel: string;
  emotionalIntelligenceLevel: string;
  developmentComparison: string;
  challenges: string;
  futurePlans: string;
  recommendations: string;
  counselorSignature: string;
}

export default function AssessmentTable4() {
  const { toast } = useToast();
  const STORAGE_KEY_HEADER = 'assessmentTable4_Header';
  const STORAGE_KEY_DATA = 'assessmentTable4_Data';

  // Header State
  const [academicYear, setAcademicYear] = React.useState('');
  const [counselorName, setCounselorName] = React.useState('');
  const [directorate, setDirectorate] = React.useState('');
  const [institutionName, setInstitutionName] = React.useState('');

  // Table State
  const [reportData, setReportData] = React.useState<AnnualReportRow[]>([]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    try {
      const savedHeader = localStorage.getItem(STORAGE_KEY_HEADER);
      if (savedHeader) {
        const header = JSON.parse(savedHeader);
        setAcademicYear(header.academicYear || '');
        setCounselorName(header.counselorName || '');
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
      const headerData = { academicYear, counselorName, directorate, institutionName };
      localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(headerData));
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(reportData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      toast({ title: "خطأ", description: "فشل حفظ البيانات.", variant: "destructive" });
    }
  }, [academicYear, counselorName, directorate, institutionName, reportData]);


  const handleTableChange = (id: string, field: keyof AnnualReportRow, value: string) => {
    setReportData(prevData => 
        prevData.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        )
    );
  };

  const addRow = () => {
    const newRow: AnnualReportRow = {
      id: `row_${Date.now()}`,
      activitiesSummary: '',
      sensoryAwarenessLevel: '',
      selfAwarenessLevel: '',
      nonVerbalExpressionLevel: '',
      verbalExpressionLevel: '',
      emotionalIntelligenceLevel: '',
      developmentComparison: '',
      challenges: '',
      futurePlans: '',
      recommendations: '',
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
            <CardTitle>جدول التقرير السنوي الشامل</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
            <div className="space-y-2">
                <Label>السنة الدراسية</Label>
                <Input value={academicYear} onChange={e => setAcademicYear(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>اسم المرشد</Label>
                <Input value={counselorName} onChange={e => setCounselorName(e.target.value)} />
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
            <Table className="min-w-full divide-y divide-border whitespace-nowrap">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px] align-top">ملخص الأنشطة المنجزة</TableHead>
                    <TableHead className="w-[200px] align-top">مستوى الوعي الحسي والتمييز بين الانفعالات الجسدية والمشاعر</TableHead>
                    <TableHead className="w-[200px] align-top">مستوى الوعي الذاتي والتحكم العاطفي وفهم أسباب المشاعر</TableHead>
                    <TableHead className="w-[200px] align-top">مستوى التعبير عن المشاعر بالحركة واللغة الجسدية، وفهم المشاعر غير اللفظية</TableHead>
                    <TableHead className="w-[200px] align-top">مستوى التعبير اللفظي والكتابي للمشاعر، التعاطف، التواصل العاطفي</TableHead>
                    <TableHead className="w-[200px] align-top">مستوى تطوير جميع مهارات الذكاء العاطفي (وعي، تنظيم، تعاطف، مهارات اجتماعية)</TableHead>
                    <TableHead className="w-[200px] align-top">تطور مقارنة ببداية العام</TableHead>
                    <TableHead className="w-[200px] align-top">التحديات والصعوبات</TableHead>
                    <TableHead className="w-[200px] align-top">الخطط المستقبلية</TableHead>
                    <TableHead className="w-[200px] align-top">توصيات عامة</TableHead>
                    <TableHead className="w-[150px] align-top">توقيع المرشد (ة)</TableHead>
                    <TableHead className="w-[50px] align-top">إجراء</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reportData.map(row => (
                <TableRow key={row.id}>
                    <TableCell><Textarea value={row.activitiesSummary} onChange={e => handleTableChange(row.id, 'activitiesSummary', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.sensoryAwarenessLevel} onChange={e => handleTableChange(row.id, 'sensoryAwarenessLevel', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.selfAwarenessLevel} onChange={e => handleTableChange(row.id, 'selfAwarenessLevel', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.nonVerbalExpressionLevel} onChange={e => handleTableChange(row.id, 'nonVerbalExpressionLevel', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.verbalExpressionLevel} onChange={e => handleTableChange(row.id, 'verbalExpressionLevel', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.emotionalIntelligenceLevel} onChange={e => handleTableChange(row.id, 'emotionalIntelligenceLevel', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.developmentComparison} onChange={e => handleTableChange(row.id, 'developmentComparison', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.challenges} onChange={e => handleTableChange(row.id, 'challenges', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.futurePlans} onChange={e => handleTableChange(row.id, 'futurePlans', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.recommendations} onChange={e => handleTableChange(row.id, 'recommendations', e.target.value)} /></TableCell>
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
