
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <CreditCard className="w-16 h-16 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl">الدفع الإلكتروني</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            نعمل على تجهيز بوابة دفع آمنة لتسهيل اشتراكاتكم. هذه الميزة ستكون متاحة قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
