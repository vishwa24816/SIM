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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

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

export default function SupportPage() {
  const router = useRouter();

  const faqItems = [
    { icon: Compass, title: 'Getting Started', href: '#' },
    { icon: User, title: 'My Account', href: '/profile' },
    { icon: LineChart, title: 'How to use simbot', href: '#' },
    { icon: Wallet, title: 'Payments & Withdrawals', href: '#' },
    { icon: Clock, title: 'Others', href: '#' },
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Support</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
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
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
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
      </footer>
    </div>
  );
}
