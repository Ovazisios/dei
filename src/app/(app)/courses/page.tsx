
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <GraduationCap className="w-16 h-16 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl">الدورات التكوينية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            قسم الدورات التكوينية قيد الإنشاء. ترقبوا دورات متخصصة في الذكاء العاطفي قريباً!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
