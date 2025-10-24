import { Logo } from "@/components/icons/logo";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-accent" />
        <span className="text-xl font-bold tracking-wider">SIM</span>
      </div>
    </header>
  );
}
