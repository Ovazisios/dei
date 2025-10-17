
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList } from 'lucide-react';
import AssessmentTable1 from '@/components/assessment-table-1';
import AssessmentTable2 from '@/components/assessment-table-2';
import AssessmentTable3 from '@/components/assessment-table-3';
import AssessmentTable4 from '@/components/assessment-table-4';

// A placeholder for tables that are not yet created
const PlaceholderTable = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
    <p className="text-muted-foreground text-xl">
      {title}
    </p>
  </div>
);


export default function AssessmentTablesPage() {
  const [selectedTable, setSelectedTable] = React.useState('table1');

  const renderTable = () => {
    switch (selectedTable) {
      case 'table1':
        return <AssessmentTable1 />;
      case 'table2':
        return <AssessmentTable2 />;
      case 'table3':
        return <AssessmentTable3 />;
      case 'table4':
        return <AssessmentTable4 />;
      // Add cases for table5 when ready
      default:
        return <AssessmentTable1 />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className='flex justify-between items-center'>
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-4">
          <ClipboardList className='w-8 h-8' />
          جداول التقييم
        </h1>

        <div className="w-72">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger className="h-12">
                <SelectValue placeholder="اختر الجدول لعرضه" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="table1">جدول تقييم المرشد للتلاميذ حسب الحالات (الجدول 1)</SelectItem>
                <SelectItem value="table2">التقرير الشهري لتقييم عمل المرشد (الجدول 2)</SelectItem>
                <SelectItem value="table3">جدول التقرير الفصلي (الجدول 3)</SelectItem>
                <SelectItem value="table4">جدول التقرير السنوي الشامل (الجدول 4)</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      {renderTable()}
    </div>
  );
}
