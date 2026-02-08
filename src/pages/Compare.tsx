import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { useTenant } from '@/hooks/useTenant';

const formatDate = (d: string | null) => {
  if (!d) return 'TBA';
  const date = new Date(d);
  return `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
};

const formatBedrooms = (b: number[] | null) => {
  if (!b || b.length === 0) return 'TBA';
  return b.map(x => x === 0 ? 'Studio' : `${x}`).join(', ');
};

const Compare = () => {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const { formatPrice } = useTenant();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['compare-properties', ids],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from('properties')
        .select('*, developer:developers(*), property_images(*)')
        .in('id', ids);
      if (error) throw error;
      return data;
    },
    enabled: ids.length > 0,
  });

  const rows: { label: string; getValue: (p: any) => string }[] = [
    { label: 'Developer', getValue: p => p.developer?.name || '—' },
    { label: 'Area', getValue: p => p.area },
    { label: 'Starting Price', getValue: p => formatPrice(p.price_from, { compact: true }) },
    { label: 'Price To', getValue: p => p.price_to ? formatPrice(p.price_to, { compact: true }) : '—' },
    { label: 'Bedrooms', getValue: p => formatBedrooms(p.bedrooms) },
    { label: 'Completion', getValue: p => formatDate(p.completion_date) },
    { label: 'Payment Plan', getValue: p => p.payment_plan || '—' },
    { label: 'Est. ROI', getValue: p => p.roi_estimate ? `${p.roi_estimate}%` : '—' },
    { label: 'Golden Visa', getValue: p => p.golden_visa_eligible ? 'Eligible' : '—' },
    { label: 'Status', getValue: p => p.status || '—' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Compare Properties" description="Side-by-side property comparison" />
      <Header />
      <main className="pt-20">
        <section className="py-12 md:py-16 border-b border-border/30">
          <div className="container-wide">
            <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Properties
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">Compare Properties</h1>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-wide">
            {ids.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg mb-4">No properties selected for comparison.</p>
                <Link to="/properties" className="btn-outline inline-block">Browse Properties</Link>
              </div>
            ) : isLoading ? (
              <div className="text-center py-24 text-muted-foreground">Loading...</div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left py-4 pr-8 text-xs uppercase tracking-luxury text-muted-foreground font-medium w-36"></th>
                      {properties?.map(p => {
                        const img = p.property_images?.find((i: any) => i.is_primary)?.url || p.property_images?.[0]?.url;
                        return (
                          <th key={p.id} className="text-left py-4 px-4 min-w-[200px]">
                            <Link to={`/properties/${p.slug}`} className="group block">
                              {img && (
                                <div className="aspect-[4/3] overflow-hidden mb-3 bg-muted">
                                  <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                                </div>
                              )}
                              <span className="font-serif text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                                {p.name}
                              </span>
                            </Link>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? 'bg-secondary/30' : ''}>
                        <td className="py-3 pr-8 text-xs uppercase tracking-luxury text-muted-foreground font-medium">
                          {row.label}
                        </td>
                        {properties?.map(p => (
                          <td key={p.id} className="py-3 px-4 text-sm text-foreground">
                            {row.getValue(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Compare;
