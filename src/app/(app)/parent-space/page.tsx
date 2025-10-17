
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, MessageSquareHeart, BarChart3, Info, ClipboardList, Download, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const parentTools = [
  {
    title: "ملخص معلومات إبنكم",
    description: "نظرة شاملة على تقدم ابنكم وأدائه في الأنشطة.",
    icon: Info,
    href: "/parent-space/report",
    isDownload: false,
    disabled: false,
  },
  {
    title: "نتائج التقييمات",
    description: "عرض تفصيلي لنتائج التقييمات والتقارير.",
    icon: BarChart3,
    href: "/parent-space/report",
    isDownload: false,
    disabled: false,
  },
   {
    title: "تحميل الدفتر التقييمي",
    description: "تحميل دفتر التقييم الخاص بالتلميذ.",
    icon: Download,
    href: "#",
    isDownload: false,
    disabled: true,
  },
  {
    title: "تواصل مع المرشد النفسي التربوي",
    description: "يمكنكم إرسال استفساراتكم وملاحظاتكم مباشرة.",
    icon: MessageSquareHeart,
    href: "/chat",
    isDownload: false,
    disabled: false,
  },
  {
    title: "حجز الاستشارات النفسية",
    description: "حجز استشارة نفسية عن بعد (Online).",
    icon: CalendarCheck,
    href: "/consultation-booking?role=parent",
    isDownload: false,
    disabled: false,
  }
];

export default function ParentSpacePage() {
  return (
    <div className="animate-in fade-in-50">
       <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              👨‍👩‍👧 فضاء الأولياء
            </h1>
            <p className="text-foreground mt-2">مرحباً بك في مساحة متابعة رحلة ابنكم التنموية والعاطفية.</p>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50">
              <User className="w-5 h-5 text-primary" />
              <span className="font-semibold">التلميذ: أحمد علي</span>
          </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parentTools.map((tool) => (
          <Card key={tool.title} className="h-full bg-card/50 hover:shadow-lg transition-shadow duration-300 ease-in-out hover:border-primary/50 border-2 border-transparent rounded-2xl flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                <tool.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl text-foreground">{tool.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <p className="text-foreground flex-grow">{tool.description}</p>
                 {tool.disabled ? (
                    <Button disabled className="w-full mt-4">قريباً</Button>
                ) : tool.isDownload ? (
                    <a href={tool.href} download>
                        <Button className="w-full mt-4">تحميل</Button>
                    </a>
                ) : (
                    <Link href={tool.href} className="mt-auto">
                        <Button className="w-full mt-4">الانتقال</Button>
                    </Link>
                )}
            </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
