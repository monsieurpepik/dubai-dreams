import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const LeadAdmin = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*, property:properties(name, slug)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const statusColor: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    contacted: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    converted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Leads" />
      <Header />
      <main className="pt-24 pb-20">
        <div className="container-wide">
          <h1 className="font-serif text-3xl mb-8">Lead Pipeline</h1>

          {isLoading ? (
            <p className="text-muted-foreground">Loading leads...</p>
          ) : !leads?.length ? (
            <p className="text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="border border-border/50 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{lead.name || '—'}</TableCell>
                      <TableCell className="text-sm">{lead.email}</TableCell>
                      <TableCell className="text-sm">{lead.phone || '—'}</TableCell>
                      <TableCell className="text-sm">
                        {lead.property?.name || '—'}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{lead.source || '—'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor[lead.lead_status || 'new'] || ''}>
                          {lead.lead_status || 'new'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LeadAdmin;
