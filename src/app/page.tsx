
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleClick = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-white">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
            <Image 
                src="https://i.imgur.com/hPzPTE5.png"
                alt="Digital Emotional Intelligence Logo"
                width={600}
                height={600}
                className="rounded-full"
                priority
            />
        </div>
        <p className="font-body text-xl md:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          "نؤمن بالاختلاف، نسعى للمساواة، ونُحدث التأثير"
        </p>
         <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
            <Button
              size="lg"
              className="transition-transform hover:scale-105"
              onClick={() => handleClick('/login')}
              disabled={loading}
            >
              <span>تسجيل الدخول</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="transition-transform hover:scale-105"
              onClick={() => handleClick('/register')}
              disabled={loading}
            >
              <span>إنشاء حساب</span>
            </Button>
        </div>
      </div>
    </main>
  );
}
