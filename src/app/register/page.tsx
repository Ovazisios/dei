
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from 'next/navigation';

const accountRoutes: { [key: string]: string } = {
    educator: "/dashboard",
    teacher: "/teacher-space",
    student: "/student-space",
    parent: "/parent-space",
};

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('educator');
  const router = useRouter();

  const handleRegister = () => {
    const path = accountRoutes[accountType] || '/dashboard';
    router.push(path);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm w-full bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">إنشاء حساب</CardTitle>
          <CardDescription>
            أدخل معلوماتك لإنشاء حساب جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="account-type">نوع الحساب</Label>
               <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger id="account-type">
                    <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="educator">المرشد النفسي</SelectItem>
                    <SelectItem value="teacher">الأستاذ</SelectItem>
                    <SelectItem value="student">المتمدرس</SelectItem>
                    <SelectItem value="parent">الأولياء</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first-name">الاسم الأول</Label>
              <Input id="first-name" placeholder="أحمد" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">الاسم الأخير</Label>
              <Input id="last-name" placeholder="علي" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" />
            </div>
            <Button onClick={handleRegister} type="submit" className="w-full">
                إنشاء حساب
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
