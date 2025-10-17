
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssessmentRow {
  id: string;
  studentName: string;
  ageLevel: string;
  subject: string;
  descriptiveAssessment: string;
  additionalNotes: string;
  referralNeeded: 'نعم' | 'لا';
  referralDate: string;
  followUp: string;
  otherNotes: string;
}

export default function AssessmentTable1() {
  const { toast } = useToast();
  const STORAGE_KEY_HEADER = 'assessmentTable1_Header';
  const STORAGE_KEY_DATA = 'assessmentTable1_Data';


  // Header State
  const [educatorName, setEducatorName] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [directorate, setDirectorate] = React.useState('');
  const [institutionName, setInstitutionName] = React.useState('');

  // Table State
  const [assessmentData, setAssessmentData] = React.useState<AssessmentRow[]>([]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    try {
      const savedHeader = localStorage.getItem(STORAGE_KEY_HEADER);
      if (savedHeader) {
        const { educatorName, level, directorate, institutionName } = JSON.parse(savedHeader);
        setEducatorName(educatorName || '');
        setLevel(level || '');
        setDirectorate(directorate || '');
        setInstitutionName(institutionName || '');
      }

      const savedTable = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedTable) {
        setAssessmentData(JSON.parse(savedTable));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast({ title: "خطأ", description: "فشل تحميل البيانات المحفوظة.", variant: "destructive" });
    }
  }, [toast]);

  // Save data to localStorage whenever it changes
  const saveData = () => {
    try {
      const headerData = { educatorName, level, directorate, institutionName };
      localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(headerData));
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(assessmentData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      toast({ title: "خطأ", description: "فشل حفظ البيانات.", variant: "destructive" });
    }
  };
  
  // Use a separate effect for saving to avoid race conditions with state updates
  React.useEffect(() => {
      saveData();
  }, [educatorName, level, directorate, institutionName, assessmentData]);

  const handleTableChange = (id: string, field: keyof AssessmentRow, value: string) => {
    setAssessmentData(prevData => 
        prevData.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        )
    );
  };

  const addRow = () => {
    const newRow: AssessmentRow = {
      id: `row_${Date.now()}`,
      studentName: '',
      ageLevel: '',
      subject: '',
      descriptiveAssessment: 'قيد الاكتساب',
      additionalNotes: '',
      referralNeeded: 'لا',
      referralDate: '',
      followUp: '',
      otherNotes: '',
    };
    setAssessmentData(prevData => [...prevData, newRow]);
    toast({ title: "تم", description: "تمت إضافة صف جديد." });
  };

  const deleteRow = (id: string) => {
    setAssessmentData(prevData => prevData.filter(row => row.id !== id));
    toast({ title: "تم الحذف", description: "تم حذف الصف بنجاح." });
  };

  const assessmentOptions = ['متمكن', 'قيد الاكتساب', 'يحتاج دعم', 'يحتاج تكفل'];

  return (
    <Card className="bg-card/50 rounded-2xl overflow-hidden">
        <CardHeader>
            <CardTitle>جدول تقييم المرشد للتلاميذ حسب الحالات</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
            <div className="space-y-2">
            <Label>اسم المرشد</Label>
            <Input value={educatorName} onChange={e => setEducatorName(e.target.value)} />
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
                <TableHead className="w-[150px]">اسم التلميذ</TableHead>
                <TableHead className="w-[120px]">العمر/المستوى</TableHead>
                <TableHead className="w-[150px]">المادة التنموية</TableHead>
                <TableHead className="w-[200px]">التقييم التوصيفي</TableHead>
                <TableHead className="w-[150px]">ملاحظات إضافية</TableHead>
                <TableHead className="w-[180px]">الحاجة لإحالة للوحدات المختصة</TableHead>
                <TableHead className="w-[120px]">تاريخ الإحالة</TableHead>
                <TableHead className="w-[150px]">متابعة بعد الإحالة</TableHead>
                <TableHead className="w-[150px]">ملاحظات أخرى</TableHead>
                <TableHead className="w-[50px]">إجراء</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assessmentData.map(row => (
                <TableRow key={row.id}>
                    <TableCell><Input value={row.studentName} onChange={e => handleTableChange(row.id, 'studentName', e.target.value)} /></TableCell>
                    <TableCell><Input value={row.ageLevel} onChange={e => handleTableChange(row.id, 'ageLevel', e.target.value)} /></TableCell>
                    <TableCell><Input value={row.subject} onChange={e => handleTableChange(row.id, 'subject', e.target.value)} /></TableCell>
                    <TableCell>
                    <Select value={row.descriptiveAssessment} onValueChange={value => handleTableChange(row.id, 'descriptiveAssessment', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                        {assessmentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    </TableCell>
                    <TableCell><Input value={row.additionalNotes} onChange={e => handleTableChange(row.id, 'additionalNotes', e.target.value)} /></TableCell>
                    <TableCell>
                    <Select value={row.referralNeeded} onValueChange={value => handleTableChange(row.id, 'referralNeeded', value as 'نعم' | 'لا')}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="نعم">نعم</SelectItem>
                        <SelectItem value="لا">لا</SelectItem>
                        </SelectContent>
                    </Select>
                    </TableCell>
                    <TableCell><Input type="date" value={row.referralDate} onChange={e => handleTableChange(row.id, 'referralDate', e.target.value)} /></TableCell>
                    <TableCell><Input value={row.followUp} onChange={e => handleTableChange(row.id, 'followUp', e.target.value)} /></TableCell>
                    <TableCell><Input value={row.otherNotes} onChange={e => handleTableChange(row.id, 'otherNotes', e.target.value)} /></TableCell>
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
