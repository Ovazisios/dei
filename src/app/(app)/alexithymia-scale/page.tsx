
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function AlexithymiaScalePage() {
  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <HelpCircle className="w-16 h-16 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl">مقياس الألكسيثيميا</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            هذه الميزة قيد التطوير حاليًا. قريباً ستتمكن من إجراء تقييم الألكسيثيميا هنا.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
