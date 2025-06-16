import { LayoutDashboard } from 'lucide-react';
import { APP_NAME } from '@/config/monitoringConfig';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <LayoutDashboard className="h-7 w-7 mr-3 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{APP_NAME}</h1>
        </div>
        {/* Future: Add navigation or user profile here */}
      </div>
    </header>
  );
}
