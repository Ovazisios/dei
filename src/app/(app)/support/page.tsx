
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <Wrench className="w-16 h-16 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl">الدعم الفني</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            هل تواجه مشكلة؟ فريق الدعم الفني سيكون جاهزاً لمساعدتكم قريباً عبر هذا القسم.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
