import { ChatPanel } from '@/components/chat-panel';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">
        المستشار الافتراضي
      </h1>
      <p className="text-muted-foreground mb-8">
        أهلاً بك في مساحة الدعم النفسي. أنا هنا لأستمع إليك وأقدم لك الدعم في أي وقت. كيف يمكنني مساعدتك اليوم؟
      </p>
      <ChatPanel />
    </div>
  );
}
