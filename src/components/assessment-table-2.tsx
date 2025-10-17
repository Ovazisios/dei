
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

interface MonthlyReportRow {
  id: string;
  activities: string;
  beneficiariesCount: string;
  strengths: string;
  difficulties: string;
  supportActions: string;
  additionalNotes: string;
  counselorSignature: string;
}

export default function AssessmentTable2() {
  const { toast } = useToast();
  const STORAGE_KEY_HEADER = 'assessmentTable2_Header';
  const STORAGE_KEY_DATA = 'assessmentTable2_Data';


  // Header State
  const [month, setMonth] = React.useState('');
  const [counselorName, setCounselorName] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [directorate, setDirectorate] = React.useState('');
  const [institutionName, setInstitutionName] = React.useState('');

  // Table State
  const [reportData, setReportData] = React.useState<MonthlyReportRow[]>([]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    try {
      const savedHeader = localStorage.getItem(STORAGE_KEY_HEADER);
      if (savedHeader) {
        const header = JSON.parse(savedHeader);
        setMonth(header.month || '');
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
      const headerData = { month, counselorName, level, directorate, institutionName };
      localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(headerData));
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(reportData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      toast({ title: "خطأ", description: "فشل حفظ البيانات.", variant: "destructive" });
    }
  }, [month, counselorName, level, directorate, institutionName, reportData]);


  const handleTableChange = (id: string, field: keyof MonthlyReportRow, value: string) => {
    setReportData(prevData => 
        prevData.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        )
    );
  };

  const addRow = () => {
    const newRow: MonthlyReportRow = {
      id: `row_${Date.now()}`,
      activities: '',
      beneficiariesCount: '',
      strengths: '',
      difficulties: '',
      supportActions: '',
      additionalNotes: '',
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
            <CardTitle>التقرير الشهري لتقييم عمل المرشد النفسي التربوي</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg">
            <div className="space-y-2">
                <Label>الشهر</Label>
                <Input value={month} onChange={e => setMonth(e.target.value)} />
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
                    <TableHead className="w-[200px]">الأنشطة المنجزة</TableHead>
                    <TableHead className="w-[150px]">عدد التلاميذ المستفيدين</TableHead>
                    <TableHead className="w-[200px]">أبرز نقاط القوة</TableHead>
                    <TableHead className="w-[200px]">الصعوبات الملاحظة</TableHead>
                    <TableHead className="w-[200px]">الإجراءات الداعمة</TableHead>
                    <TableHead className="w-[200px]">ملاحظات إضافية</TableHead>
                    <TableHead className="w-[150px]">توقيع المرشد (ة)</TableHead>
                    <TableHead className="w-[50px]">إجراء</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reportData.map(row => (
                <TableRow key={row.id}>
                    <TableCell><Textarea value={row.activities} onChange={e => handleTableChange(row.id, 'activities', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={row.beneficiariesCount} onChange={e => handleTableChange(row.id, 'beneficiariesCount', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.strengths} onChange={e => handleTableChange(row.id, 'strengths', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.difficulties} onChange={e => handleTableChange(row.id, 'difficulties', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.supportActions} onChange={e => handleTableChange(row.id, 'supportActions', e.target.value)} /></TableCell>
                    <TableCell><Textarea value={row.additionalNotes} onChange={e => handleTableChange(row.id, 'additionalNotes', e.target.value)} /></TableCell>
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
