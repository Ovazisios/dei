
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50">
      <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <Newspaper className="w-16 h-16 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl">الأخبار والمستجدات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            تابعوا آخر الأخبار والمقالات حول الذكاء العاطفي والرفاهية النفسية. هذا القسم سيكون متاحاً قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
