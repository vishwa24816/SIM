
'use client';

import * as React from 'react';
import {
  User,
  ShieldCheck,
  Landmark,
  Users,
  UserCog,
  Lock,
  Wallet,
  LifeBuoy,
  FileText,
  Star,
  Gift,
  Info,
  KeyRound,
  Briefcase,
  Award,
  Palette,
  Mic,
  Languages,
  ChevronRight,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

const ProfileItem = ({ icon, title, description, href, hasArrow = true, badge, collapsible = false }: any) => {
  const Icon = icon;

  const content = (
      <div className="flex items-center w-full p-4">
        <div className="flex items-center gap-4">
          <Icon className="w-6 h-6 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{title}</span>
              {badge && <Badge className={badge.type === 'active' ? 'bg-green-500/20 text-green-500' : ''}>{badge.text}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="ml-auto">
          {hasArrow && (collapsible ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
        </div>
      </div>
  );

  if (collapsible) {
    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <div className="cursor-pointer hover:bg-muted/50 rounded-lg">
                    {content}
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="p-4 pt-0">
                    {/* Collapsible content goes here */}
                    <p className="text-sm text-muted-foreground pl-10">Details for {title} will be shown here.</p>
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
  }

  return (
    <div className="hover:bg-muted/50 rounded-lg cursor-pointer">
      {content}
    </div>
  );
};

export default function ProfilePage() {
  const profileItems = [
    { icon: User, title: 'Profile', description: 'Add or change information about you' },
    { icon: ShieldCheck, title: 'KYC Verification', description: 'Your KYC has been successfully verified', badge: { text: 'ACTIVE', type: 'active' } },
    { icon: Landmark, title: 'Account Details', description: 'Add or Change your bank account details' },
    { icon: Users, title: 'Nominee Details', description: 'Add recipients of your funds in case of your demise' },
    { icon: UserCog, title: 'Account Management', description: 'Delete or disable your account' },
    { icon: Lock, title: 'Security and Privacy', description: 'Manage your account security and data privacy settings' },
    { icon: Wallet, title: 'Wallet Management', description: 'Add, remove, or view your wallets' },
    { icon: LifeBuoy, title: 'Support', description: 'Get help and support from our team' },
    { icon: FileText, title: 'Fee Structure', description: 'View the fee structure for all services' },
    { icon: Star, title: 'Feedback', description: 'Share your feedback and suggestions with us' },
    { icon: Gift, title: 'Refer and Earn', description: 'Refer your friends and earn rewards' },
    { icon: Info, title: 'About SIM', description: 'Know more about our company and mission' },
    { icon: KeyRound, title: 'API', description: 'Manage your API keys for programmatic access', collapsible: true },
    { icon: Briefcase, title: 'Join Us', description: 'Explore career opportunities with us' },
    { icon: Palette, title: 'Platform Colour', description: 'Choose your preferred color theme', collapsible: true },
    { icon: Languages, title: 'Platform Language', description: 'Select your display language', collapsible: true },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="p-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarFallback className="text-4xl">D</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">Demo User</h1>
        <p className="text-muted-foreground">demo123@simulation.app</p>
      </div>

      <div className="px-4 pb-24">
        <div className="divide-y divide-border/50">
          {profileItems.map((item, index) => (
            <ProfileItem key={index} {...item} />
          ))}
        </div>
        <div className="p-4 mt-4">
            <Button variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      </div>
    </div>
  );
}
