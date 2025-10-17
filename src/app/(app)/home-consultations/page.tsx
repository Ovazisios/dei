
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HomeConsultationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Default to 'parent' for home consultations, but allow override via URL
  const role = searchParams.get('role') || 'parent'; 
  
  const [bookerName, setBookerName] = React.useState('');
  const [studentName, setStudentName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('');
  const type = 'in_person';

  const handleBooking = () => {
    if (!bookerName || !address || !date || !time || !studentName) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    const newConsultation = {
      id: `consult_home_${Date.now()}`,
      bookerName,
      bookerRole: role,
      studentName,
      address,
      date: format(date, 'yyyy-MM-dd'),
      time,
      type,
      status: 'pending',
    };

    try {
      const existingConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
      const updatedConsultations = [...existingConsultations, newConsultation];
      localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
      
      toast({
        title: 'تم حجز الاستشارة المنزلية بنجاح',
        description: 'تم إرسال طلبك وسيقوم المرشد بمراجعته.',
      });

      // Redirect based on role after booking
      if (role === 'parent') {
        router.push('/parent-space');
      } else if (role === 'teacher') {
        router.push('/teacher-space');
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Failed to save consultation', error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من حفظ حجزك. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-2xl bg-card/50 rounded-2xl p-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">حجز إستشارة في البيوت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="booker-name">اسمك الكامل (ولي الأمر)</Label>
            <Input
              id="booker-name"
              value={bookerName}
              onChange={(e) => setBookerName(e.target.value)}
              placeholder="مثال: أحمد علي"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="student-name">اسم التلميذ</Label>
            <Input
              id="student-name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="مثال: سارة علي"
            />
          </div>

           <div className="space-y-2">
            <Label htmlFor="address">العنوان الكامل للمنزل</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: 123 شارع الحرية، الجزائر العاصمة"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>تاريخ الجلسة</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>اختر تاريخ</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">وقت الجلسة</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleBooking} className="w-full" size="lg">
            تأكيد الحجز
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
