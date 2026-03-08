import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Compass, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { SearchOverlay } from '@/components/properties/SearchOverlay';

const tabs = [
  { id: 'explore', label: 'Explore', icon: Home, href: '/' },
  { id: 'search', label: 'Search', icon: Search, href: null },
  { id: 'deals', label: 'Deals', icon: Compass, href: '/discover' },
  { id: 'saved', label: 'Saved', icon: Heart, href: '/saved' },
  { id: 'menu', label: 'Menu', icon: Menu, href: null },
] as const;

export function MobileTabBar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useSavedProperties();
  const [visible, setVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 50 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isMobile) return null;

  const activeTab = tabs.find(t => t.href && location.pathname === t.href)?.id || '';

  const handleTap = (tab: typeof tabs[number]) => {
    if (tab.id === 'search') {
      setSearchOpen(true);
    } else if (tab.id === 'menu') {
      window.dispatchEvent(new CustomEvent('open-mobile-menu'));
    } else if (tab.href) {
      navigate(tab.href);
    }
  };

  return (
    <>
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/20 transition-transform duration-300 md:hidden ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTap(tab)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative ${
                  isActive ? 'text-foreground' : 'text-muted-foreground/50'
                }`}
                aria-label={tab.label}
              >
                <div className="relative">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                  {tab.id === 'saved' && count > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-foreground text-background text-[9px] font-medium rounded-full flex items-center justify-center">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
                <span className="text-[9px] tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
