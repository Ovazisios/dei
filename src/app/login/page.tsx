
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
    student: "/student/2", // Default to student '2' for demo purposes
    parent: "/parent-space",
};

export default function LoginPage() {
  const [accountType, setAccountType] = useState('educator');
  const router = useRouter();

  const handleLogin = () => {
    const path = accountRoutes[accountType] || '/dashboard';
    router.push(path);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm w-full bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور أدناه لتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" required />
          </div>
          <Button onClick={handleLogin} type="submit" className="w-full">
            تسجيل الدخول
          </Button>
           <div className="mt-4 text-center text-sm">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="underline">
              إنشاء حساب
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
