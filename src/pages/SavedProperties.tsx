import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { CleanPropertyGrid } from '@/components/properties/CleanPropertyGrid';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { motion } from 'framer-motion';

const SavedProperties = () => {
  const { savedIds, clearAll } = useSavedProperties();
  const { tenant } = useTenant();
  const whatsapp = tenant?.whatsapp_number || '';

  const { data: properties, isLoading } = useQuery({
    queryKey: ['saved-properties', savedIds],
    queryFn: async () => {
      if (savedIds.length === 0) return [];
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .in('id', savedIds);
      if (error) throw error;
      return data;
    },
    enabled: savedIds.length > 0,
  });

  const shareUrl = () => {
    const names = properties?.map(p => `• ${p.name} — ${p.area}`).join('\n') || '';
    const text = encodeURIComponent(`My Dubai Property Shortlist:\n\n${names}\n\nView more at ${window.location.origin}/properties`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Saved Properties" description="Your shortlisted properties" />
      <Header />
      <main className="pt-20">
        <section className="py-12 md:py-16 border-b border-border/30">
          <div className="container-wide">
            <p className="text-xs font-medium uppercase tracking-luxury text-muted-foreground mb-3">
              {savedIds.length} {savedIds.length === 1 ? 'Property' : 'Properties'} Saved
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">
              Your Shortlist
            </h1>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-wide">
            {savedIds.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 space-y-5"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Heart className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-lg font-serif text-foreground mb-2">Your shortlist is empty</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Start exploring to save properties you like. Tap the heart icon on any property card.
                  </p>
                </div>
                <Link to="/properties" className="btn-primary inline-flex items-center gap-2 !mt-8">
                  Explore Properties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={shareUrl} className="btn-outline text-xs">
                    Share via WhatsApp
                  </button>
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Clear All
                  </button>
                </div>
                <CleanPropertyGrid properties={properties || []} isLoading={isLoading} />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SavedProperties;
