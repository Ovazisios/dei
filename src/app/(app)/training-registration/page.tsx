
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser } from "lucide-react";

export default function TrainingRegistrationPage() {
  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <BookUser className="w-16 h-16 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl">الاشتراك في الدورات التكوينية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            هذه الميزة قيد التطوير حاليًا. قريباً ستتمكن من التسجيل في الدورات التكوينية من هنا.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
