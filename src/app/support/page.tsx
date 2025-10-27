
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Compass,
  LineChart,
  Mail,
  User,
  Wallet,
  Send,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const FaqItem = ({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
}) => (
  <Link href={href} passHref>
    <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
      <Icon className="w-6 h-6 text-primary mr-4" />
      <span className="flex-grow font-medium">{title}</span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  </Link>
);

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function SupportPage() {
  const router = useRouter();
  const [isChatActive, setIsChatActive] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);


  const faqItems = [
    { icon: Compass, title: 'Getting Started', href: '#' },
    { icon: User, title: 'My Account', href: '/profile' },
    { icon: LineChart, title: 'How to use simbot', href: '#' },
    { icon: Wallet, title: 'Payments & Withdrawals', href: '#' },
    { icon: Clock, title: 'Others', href: '#' },
  ];
  
  React.useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    if (!isChatActive) {
      setIsChatActive(true);
    }
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse: Message = {
            id: Date.now() + 1,
            text: "Thanks for reaching out! A support agent will be with you shortly. In the meantime, have you checked our FAQ section for common questions?",
            sender: 'bot',
        };
        setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="bg-background flex flex-col h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => isChatActive ? setIsChatActive(false) : router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">{isChatActive ? 'Live Chat' : 'Support'}</h1>
          </div>
        </div>
      </header>

      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 pb-24"
      >
        <AnimatePresence mode="wait">
            {isChatActive ? (
                 <motion.div 
                    key="chat-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                 >
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex items-end gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                            {message.sender === 'bot' && (
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                                </Avatar>
                            )}
                             <div className={cn("max-w-xs md:max-w-md p-3 rounded-2xl", message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    ))}
                 </motion.div>
            ) : (
                 <motion.div 
                    key="support-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                >
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Contact us 24x7</h2>
                        <Card>
                            <CardContent className="p-4">
                            <a
                                href="mailto:support@simulation.app"
                                className="flex items-center gap-4"
                            >
                                <Mail className="w-6 h-6 text-primary" />
                                <div>
                                <p className="font-semibold">Email us</p>
                                <p className="text-sm text-muted-foreground">
                                    support@simulation.app
                                </p>
                                </div>
                            </a>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                    <h2 className="text-2xl font-bold mb-4">FAQs</h2>
                    <Card>
                        <CardContent className="p-0">
                        <div className="divide-y">
                            {faqItems.map((item) => (
                            <FaqItem
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                href={item.href}
                            />
                            ))}
                        </div>
                        </CardContent>
                    </Card>
                    </div>
                    
                    <div className="p-4 bg-background border-t">
                        <div className="flex justify-around items-center text-sm font-medium">
                        <Link href="#" passHref>
                            <span className="text-primary hover:underline">Past tickets</span>
                        </Link>
                        <Separator orientation="vertical" className="h-4" />
                        <Link href="#" passHref>
                            <span className="text-primary hover:underline">Feedback</span>
                        </Link>
                        <Separator orientation="vertical" className="h-4" />
                        <Link href="#" passHref>
                            <span className="text-primary hover:underline">Grievance</span>
                        </Link>
                        </div>
                    </div>
                 </motion.div>
            )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-2 bg-background border-t">
        <form onSubmit={handleSendMessage} className="relative">
          <Input 
            placeholder="Type your message..." 
            className="pr-12 h-12" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
