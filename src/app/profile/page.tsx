
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
  Languages,
  ChevronRight,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Volume2,
  Copy,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ProfileItem = ({ icon, title, description, badge }: { icon: React.ElementType, title: string, description: string, badge?: { text: string, type: string } }) => {
  const Icon = icon;
  return (
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
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};


const CollapsibleProfileItem = ({ icon, title, description, children, badge }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode, badge?: { text: string, type: string } }) => {
  const Icon = icon;
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <div className="flex items-center w-full p-4 cursor-pointer hover:bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4">
            <Icon className="w-6 h-6 text-primary" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{title}</span>
                {badge && <Badge>{badge.text}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="ml-auto">
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform [&[data-state=open]]:-rotate-180" />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 pt-0">
            {children || <p className="text-sm text-muted-foreground pl-10">Details for {title} will be shown here.</p>}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const themes = [
    { name: 'Blue', color: '217 91% 60%' },
    { name: 'Cyan', color: '180 80% 45%' },
    { name: 'Light Green', color: '142 76% 41%' },
    { name: 'Dark Green', color: '142 80% 25%' },
    { name: 'Pink', color: '340 82% 52%' },
    { name: 'Red', color: '0 84% 60%' },
    { name: 'Orange', color: '25 95% 53%' },
    { name: 'Yellow', color: '48 96% 53%' },
    { name: 'Gold', color: '45 80% 50%' },
    { name: 'Brown', color: '30 60% 30%' },
    { name: 'Violet', color: '262 84% 59%' },
    { name: 'Purple', color: '270 70% 45%' },
    { name: 'Skin', color: '24 70% 60%' },
];

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();
    const [activeTheme, setActiveTheme] = React.useState('Blue');

    const handleThemeChange = (themeName: string) => {
        const selected = themes.find(t => t.name === themeName);
        if (selected) {
            document.documentElement.style.setProperty('--primary', selected.color);
            setActiveTheme(themeName);
        }
    };

    return (
        <RadioGroup value={activeTheme} onValueChange={handleThemeChange} className="grid grid-cols-2 gap-4">
            {themes.map((themeOption) => (
                <div key={themeOption.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={themeOption.name} id={themeOption.name} />
                    <Label htmlFor={themeOption.name}>{themeOption.name}</Label>
                </div>
            ))}
        </RadioGroup>
    );
};

const languages = [
    'English', 'Hindi',
    'Sanskrit', 'Gujarati',
    'Marathi', 'Bengali',
    'Tamil', 'Telugu',
    'Kannada', 'Malayalam',
    'Urdu'
];

const LanguageSelector = () => {
    const [selectedLanguage, setSelectedLanguage] = React.useState('English');

    return (
        <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                    <RadioGroupItem value={lang} id={lang} />
                    <Label htmlFor={lang}>{lang}</Label>
                </div>
            ))}
        </RadioGroup>
    );
};


export default function ProfilePage() {
    const router = useRouter();
    const { copy } = useCopyToClipboard();
    const { toast } = useToast();
    const [apiKey, setApiKey] = React.useState('');

    const generateApiKey = () => {
      const randomKey = 'sim_live_' + [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
      setApiKey(randomKey);
    };

    const handleCopyKey = () => {
      if (!apiKey) return;
      copy(apiKey);
      toast({ title: 'API Key Copied!' });
    };

    const profileItems = [
    { id: 'profile', icon: User, title: 'Profile', description: 'Add or change information about you', href: '/profile/account' },
    { id: 'kyc', icon: ShieldCheck, title: 'KYC Verification', description: 'Your KYC has been successfully verified', badge: { text: 'ACTIVE', type: 'active' }, href: '#' },
    { id: 'banks', icon: Landmark, title: 'Account Details', description: 'Add or Change your bank account details', href: '/profile/banks' },
    { id: 'nominee', icon: Users, title: 'Nominee Details', description: 'Add recipients of your funds', href: '/profile/nominee' },
    { id: 'accountMgmt', icon: UserCog, title: 'Account Management', description: 'Delete or disable your account', href: '/profile/account-management' },
    { id: 'wallet', icon: Wallet, title: 'Wallet Management', description: 'Manage your crypto wallets', href: '/profile/wallet' },
    { id: 'security', icon: Lock, title: 'Security and Privacy', description: 'Manage your account security and data privacy settings', href: '#' },
    { id: 'support', icon: LifeBuoy, title: 'Support', description: 'Get help and support from our team', href: '/support' },
    { id: 'fees', icon: FileText, title: 'Fee Structure', description: 'View the fee structure for all services', href: '#' },
    { id: 'feedback', icon: Star, title: 'Feedback', description: 'Share your feedback and suggestions with us', href: '#' },
    { id: 'refer', icon: Gift, title: 'Refer and Earn', description: 'Refer your friends and earn rewards', href: '#' },
    { id: 'about', icon: Info, title: 'About SIM', description: 'Know more about our company and mission', href: '#' },
    { id: 'api', icon: KeyRound, title: 'API', description: 'Manage your API keys for programmatic access', collapsible: true },
    { id: 'join', icon: Briefcase, title: 'Join Us', description: 'Explore career opportunities with us', href: '#' },
    { id: 'theme', icon: Palette, title: 'Platform Colour', description: 'Choose your preferred color theme', collapsible: true },
    { id: 'language', icon: Languages, title: 'Platform Language', description: 'Select your display language', collapsible: true },
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
        </div>
      </header>

      <div className="p-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarFallback className="text-4xl">D</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">Demo User</h1>
        <p className="text-muted-foreground">demo123@simulation.app</p>
      </div>

      <div className="px-4 pb-24">
        <div className="divide-y divide-border/50">
          {profileItems.map((item) => {
            if (item.collapsible) {
              return (
                 <CollapsibleProfileItem key={item.id} icon={item.icon} title={item.title} description={item.description} badge={item.badge}>
                    {item.id === 'api' ? (
                      <div className="space-y-4 pl-10">
                        <div className="relative">
                          <Input readOnly value={apiKey} placeholder="Click 'Generate' to create a key" className="pr-10" />
                          {apiKey && (
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleCopyKey}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Button onClick={generateApiKey} className="w-full">Generate Key</Button>
                      </div>
                    ) : item.id === 'theme' ? (
                        <div className="pl-10">
                           <ThemeSelector />
                        </div>
                    ) : item.id === 'language' ? (
                        <div className="pl-10">
                            <LanguageSelector />
                        </div>
                    ) : null}
                 </CollapsibleProfileItem>
              )
            }
            if (item.href) {
                return (
                    <Link href={item.href} key={item.id} className="block hover:bg-muted/50 rounded-lg">
                       <ProfileItem {...item} />
                    </Link>
                )
            }
            return (
              <div key={item.id} className="hover:bg-muted/50 rounded-lg">
                <ProfileItem {...item} />
              </div>
            )
          })}
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
