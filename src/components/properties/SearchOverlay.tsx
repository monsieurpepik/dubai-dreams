import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Building2, MapPin, Users, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  type: 'property' | 'area' | 'developer';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'owning-dubai-recent-searches';
const MAX_RECENT = 5;

const popularAreas = [
  { name: 'Palm Jumeirah', slug: 'palm-jumeirah', emoji: '🌴' },
  { name: 'Dubai Marina', slug: 'dubai-marina', emoji: '🏙️' },
  { name: 'Business Bay', slug: 'business-bay', emoji: '🏢' },
  { name: 'Downtown Dubai', slug: 'downtown-dubai', emoji: '🗼' },
  { name: 'JBR', slug: 'jbr', emoji: '🏖️' },
  { name: 'Dubai Hills', slug: 'dubai-hills', emoji: '⛳' },
];

const priceFilters = [
  { label: 'Under 2M', href: '/properties?maxPrice=2000000' },
  { label: '2–5M', href: '/properties?minPrice=2000000&maxPrice=5000000' },
  { label: '5–10M', href: '/properties?minPrice=5000000&maxPrice=10000000' },
  { label: '10M+', href: '/properties?minPrice=10000000' },
];

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch { return []; }
}

function addRecentSearch(term: string) {
  const recent = getRecentSearches().filter(s => s !== term);
  recent.unshift(term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(-1);
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setIsLoading(true);
    try {
      const searchTerm = `%${q}%`;
      const [propertiesRes, developersRes] = await Promise.all([
        supabase
          .from('properties')
          .select('id, name, slug, area, location, developer:developers(name)')
          .or(`name.ilike.${searchTerm},area.ilike.${searchTerm},community.ilike.${searchTerm},location.ilike.${searchTerm}`)
          .limit(6),
        supabase
          .from('developers')
          .select('id, name, slug, total_projects')
          .ilike('name', searchTerm)
          .limit(3),
      ]);

      const mapped: SearchResult[] = [];
      (propertiesRes.data || []).forEach(p => {
        mapped.push({
          type: 'property', id: p.id, title: p.name,
          subtitle: `${(p.developer as any)?.name ? (p.developer as any).name + ' · ' : ''}${p.area}`,
          href: `/properties/${p.slug}`,
        });
      });
      const areas = new Set<string>();
      (propertiesRes.data || []).forEach(p => {
        if (p.area.toLowerCase().includes(q.toLowerCase())) areas.add(p.area);
      });
      areas.forEach(area => {
        mapped.push({
          type: 'area', id: `area-${area}`, title: area, subtitle: 'Area',
          href: `/area-guide/${area.toLowerCase().replace(/\s+/g, '-')}`,
        });
      });
      (developersRes.data || []).forEach(d => {
        mapped.push({
          type: 'developer', id: d.id, title: d.name,
          subtitle: `${d.total_projects || 0} projects`,
          href: `/properties?developer=${d.slug}`,
        });
      });

      setResults(mapped);
      setActiveIndex(-1);
      // Save search term
      if (q.length >= 3) addRecentSearch(q);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 250);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    onClose();
    navigate(result.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) { handleSelect(results[activeIndex]); }
  };

  const typeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'property': return <Building2 className="w-4 h-4 text-muted-foreground" />;
      case 'area': return <MapPin className="w-4 h-4 text-muted-foreground" />;
      case 'developer': return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const grouped = {
    property: results.filter(r => r.type === 'property'),
    area: results.filter(r => r.type === 'area'),
    developer: results.filter(r => r.type === 'developer'),
  };

  let globalIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="max-w-2xl mx-auto px-6 pt-24 md:pt-32 pb-16">
            {/* Search Input */}
            <div className="relative mb-8">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search properties, areas, developers..."
                className="w-full bg-transparent border-none border-b-2 border-border pl-8 pr-10 py-4 text-xl md:text-2xl font-serif text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/30 transition-colors"
                autoComplete="off"
              />
              <button
                onClick={onClose}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results when typing */}
            {query.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {isLoading && <p className="text-sm text-muted-foreground">Searching...</p>}

                {!isLoading && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results for "{query}"</p>
                    <p className="text-sm text-muted-foreground/60 mt-2">Try a different search term</p>
                  </div>
                )}

                {(['property', 'area', 'developer'] as const).map(type => {
                  const items = grouped[type];
                  if (items.length === 0) return null;
                  const label = type === 'property' ? 'Properties' : type === 'area' ? 'Areas' : 'Developers';
                  return (
                    <div key={type}>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">{label}</p>
                      <div className="space-y-1">
                        {items.map(result => {
                          globalIndex++;
                          const idx = globalIndex;
                          return (
                            <button
                              key={result.id}
                              onClick={() => handleSelect(result)}
                              className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors rounded-lg ${
                                idx === activeIndex ? 'bg-foreground/5' : 'hover:bg-foreground/5'
                              }`}
                            >
                              {typeIcon(result.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Empty state — before typing */}
            {query.length < 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-10"
              >
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Recent Searches</p>
                    <div className="space-y-1">
                      {recentSearches.map(term => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-foreground/5 transition-colors rounded-lg group"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground/40" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Areas */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Popular Areas</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {popularAreas.map(area => (
                      <button
                        key={area.slug}
                        onClick={() => {
                          onClose();
                          navigate(`/properties?area=${area.slug}`);
                        }}
                        className="flex items-center gap-3 px-4 py-3.5 border border-border/30 rounded-xl hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all duration-300 group text-left"
                      >
                        <span className="text-lg">{area.emoji}</span>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{area.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Price Filters */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">By Budget</p>
                  <div className="flex flex-wrap gap-2">
                    {priceFilters.map(pf => (
                      <button
                        key={pf.label}
                        onClick={() => {
                          onClose();
                          navigate(pf.href);
                        }}
                        className="px-5 py-2.5 text-xs tracking-wide border border-border/40 rounded-full text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all duration-300"
                      >
                        {pf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/40" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Trending</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Golden Visa', 'Waterfront', 'High ROI', 'Payment Plan'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-4 py-2 text-xs bg-foreground/[0.03] border border-border/20 rounded-full text-muted-foreground hover:text-foreground hover:border-border/40 transition-all duration-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
