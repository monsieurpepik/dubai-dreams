import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useDeveloper } from '@/contexts/DeveloperContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface DeveloperLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/developer/dashboard', icon: LayoutDashboard },
  { label: 'Properties', href: '/developer/properties', icon: Building2 },
  { label: 'Leads', href: '/developer/leads', icon: Users },
  { label: 'Settings', href: '/developer/settings', icon: Settings },
];

export function DeveloperLayout({ children, title, subtitle }: DeveloperLayoutProps) {
  const { user, developer, isLoading, isAuthenticated, signOut } = useDeveloper();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/developer/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/developer/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-64 border-r border-border bg-card p-6">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const userInitials = user?.email?.slice(0, 2).toUpperCase() || 'DV';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link to="/developer/dashboard" className="flex items-center gap-2">
              {developer?.logo_url ? (
                <img 
                  src={developer.logo_url} 
                  alt={developer.name} 
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-sm font-medium tracking-wide text-foreground">
                  {developer?.name || 'Developer Portal'}
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg p-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {developer?.subscription_tier || 'Free'} Plan
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-8 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/developer/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            {location.pathname !== '/developer/dashboard' && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{title}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
