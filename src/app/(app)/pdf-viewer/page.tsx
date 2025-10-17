
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTriangle, ArrowLeft, FileText } from 'lucide-react';
import { AlertTitle, AlertDescription } from '@/components/ui/alert';

function PdfViewerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const file = searchParams.get('file');

    if (!file) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-lg text-center bg-card/50 rounded-2xl p-8">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <AlertTriangle className="w-16 h-16 text-destructive" />
                        </div>
                        <CardTitle className="font-headline text-2xl">ملف غير موجود</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-lg">
                            لم يتم تحديد ملف PDF لعرضه. الرجاء العودة واختيار دليل.
                        </p>
                        <Button onClick={() => router.back()} className="mt-6">
                            <ArrowLeft className="mr-2" />
                            العودة
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const pdfTitle = file.split('/').pop()?.replace('.pdf', '').replace(/-/g, ' ');

    return (
        <div className="animate-in fade-in-50 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <h1 className="font-headline text-3xl font-bold tracking-tight capitalize">
                        {pdfTitle}
                    </h1>
                </div>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2" />
                    العودة إلى لوحة التحكم
                </Button>
            </div>
            <Card className="bg-card/50 rounded-2xl w-full">
                <CardContent className="p-2 h-[calc(100vh-15rem)]">
                    <iframe
                        src={file}
                        title={pdfTitle}
                        className="w-full h-full rounded-lg border-none"
                    />
                </CardContent>
            </Card>
        </div>
    )
}


export default function PdfViewerPage() {
    return (
        <React.Suspense fallback={<div>Loading PDF...</div>}>
            <PdfViewerContent />
        </React.Suspense>
    )
}
