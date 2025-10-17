
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, CreditCard, Newspaper, Wrench, Home } from "lucide-react";
import Link from "next/link";

const navItems = [
    { href: "/news", label: "الأخبار", icon: Newspaper },
    { href: "/courses", label: "الدورات التكوينية", icon: GraduationCap },
    { href: "/home-consultations", label: "إستشارات في البيوت", icon: Home },
    { href: "/payment", label: "الدفع الإلكتروني", icon: CreditCard },
    { href: "/support", label: "الدعم الفني", icon: Wrench },
];

export default function AccountSettingsPage() {
  return (
    <div className="animate-in fade-in-50">
        <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">
            إعدادات الحساب والقائمة
        </h1>
        <Card className="w-full max-w-2xl mx-auto bg-card/50 rounded-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">القائمة الرئيسية</CardTitle>
            </CardHeader>
            <CardContent>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {navItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="outline"
                        className="w-full h-20 justify-start p-4 text-lg rounded-xl"
                        asChild
                    >
                        <Link href={item.href}>
                            <item.icon className="h-7 w-7 ml-4" />
                            <span>{item.label}</span>
                        </Link>
                    </Button>
                ))}
                </nav>
            </CardContent>
        </Card>
    </div>
  );
}
