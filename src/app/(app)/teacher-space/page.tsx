
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const teacherTools = [
    {
      title: "الاشتراك في الدورات التكوينية",
      description: "حجز مقعد في الدورات التكوينية القادمة.",
      icon: BookUser,
      href: "/training-registration",
      disabled: false,
    },
    {
      title: "حجز الاستشارات النفسية",
      description: "حجز استشارة نفسية عن بعد (Online).",
      icon: CalendarCheck,
      href: "/consultation-booking?role=teacher",
      disabled: false,
    }
];


export default function TeacherSpacePage() {
  return (
    <div className="animate-in fade-in-50">
       <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              👩‍🏫 فضاء الأستاذ
            </h1>
            <p className="text-muted-foreground mt-2">مرحباً بك في فضاء الأستاذ.</p>
          </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacherTools.map((tool) => (
          <Card key={tool.title} className="h-full bg-card/50 hover:shadow-lg transition-shadow duration-300 ease-in-out hover:border-primary/50 border-2 border-transparent rounded-2xl flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                <tool.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl text-foreground">{tool.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground flex-grow">{tool.description}</p>
                 {tool.disabled ? (
                    <Button disabled className="w-full mt-4">قريباً</Button>
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
