import { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchOverlay } from './SearchOverlay';

export function SearchEntry() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-10 md:py-14 bg-background">
        <div className="container-wide max-w-2xl mx-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center gap-3 px-0 py-3 border-b border-border/20 text-left transition-colors hover:border-foreground/20 group"
          >
            <Search className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            <span className="text-sm text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
              Search by area, developer, or project name...
            </span>
          </button>
        </div>
      </section>
      <SearchOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
