
'use client';

import { aiCounselor, AICounselorOutput } from '@/ai/flows/emotional-support-chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { streamFlow } from '@genkit-ai/next/client';
import { Bot, Loader2, SendHorizonal, User } from 'lucide-react';
import { FormEvent, useRef, useState, useTransition } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function ChatPanel() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function onSend(formData: FormData) {
    const message = formData.get('message') as string;
    if (!message) return;

    formRef.current?.reset();
    
    const userMessage: Message = { role: 'user', text: message };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    
    startTransition(async () => {
      let fullResponse = '';
      const { stream } = streamFlow(aiCounselor, { message });

      for await (const chunk of stream()) {
        const data = chunk as AICounselorOutput;
        if (data.response) {
            fullResponse = data.response;
            const modelMessage: Message = { role: 'model', text: fullResponse };
            
            // Check if last message is from model and update it, otherwise add new message
            const lastMessage = newHistory[newHistory.length -1];
            if (lastMessage && lastMessage.role === 'model') {
                 setHistory([...newHistory.slice(0, -1), modelMessage]);
            } else {
                 setHistory([...newHistory, modelMessage]);
            }
        }
      }
    });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSend(formData);
  };
  
  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-2xl border">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {history.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'model' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-md p-3 rounded-2xl text-lg',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-background rounded-bl-none'
                )}
              >
                <p className="whitespace-pre-wrap font-body">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isPending && (
             <div className="flex items-start gap-4 justify-start">
               <Avatar className="w-8 h-8">
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   <Bot className="w-5 h-5" />
                 </AvatarFallback>
               </Avatar>
               <div className="bg-background rounded-bl-none max-w-md p-3 rounded-2xl text-lg">
                 <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
               </div>
             </div>
           )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background/80 rounded-b-2xl">
        <form ref={formRef} onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            name="message"
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 h-12 text-lg rounded-full"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="w-12 h-12 rounded-full"
            disabled={isPending}
            aria-label="إرسال"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizonal className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
