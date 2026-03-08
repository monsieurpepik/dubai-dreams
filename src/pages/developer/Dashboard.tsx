import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { DeveloperLayout } from '@/components/developer/DeveloperLayout';
import { useDeveloper } from '@/contexts/DeveloperContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function DeveloperDashboard() {
  const { developer } = useDeveloper();

  // Fetch properties for this developer
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['developer-properties', developer?.id],
    queryFn: async () => {
      if (!developer?.id) return [];
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, slug, price_from, listing_status, created_at')
        .eq('developer_id', developer.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!developer?.id,
  });

  // Fetch leads for this developer's properties
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['developer-leads', developer?.id],
    queryFn: async () => {
      if (!developer?.id || !properties?.length) return [];
      const propertyIds = properties.map(p => p.id);
      
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, email, created_at, lead_status, property_id, golden_visa_interest')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!developer?.id && !!properties?.length,
  });

  // Fetch real property view counts
  const { data: viewCount } = useQuery({
    queryKey: ['developer-views', developer?.id],
    queryFn: async () => {
      if (!developer?.id || !properties?.length) return 0;
      const propertyIds = properties.map(p => p.id);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      
      const { count, error } = await supabase
        .from('property_views')
        .select('id', { count: 'exact', head: true })
        .in('property_id', propertyIds)
        .gte('created_at', thirtyDaysAgo);
      
      if (error) return 0;
      return count || 0;
    },
    enabled: !!developer?.id && !!properties?.length,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-bayut-data', {
        body: {},
      });
      if (error) throw error;
      toast.success(`Import complete: ${data?.inserted || 0} new properties added, ${data?.skipped || 0} duplicates skipped`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const stats = [
    {
      title: 'Active Listings',
      value: properties?.filter(p => p.listing_status === 'published').length || 0,
      icon: Building2,
      change: '+2 this month',
      positive: true,
    },
    {
      title: 'Total Leads',
      value: leads?.length || 0,
      icon: Users,
      change: '+15% vs last month',
      positive: true,
    },
    {
      title: 'Conversion Rate',
      value: '12%',
      icon: TrendingUp,
      change: '+3% vs last month',
      positive: true,
    },
    {
      title: 'Property Views',
      value: viewCount?.toLocaleString() || '0',
      icon: Eye,
      change: 'Last 30 days',
      positive: true,
    },
  ];

  return (
    <DeveloperLayout
      title="Dashboard"
      subtitle={`Welcome back${developer?.name ? `, ${developer.name}` : ''}`}
    >
      {/* Refresh Data Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshData}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Importing...' : 'Refresh Property Data'}
        </Button>
      </div>
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`flex items-center text-xs ${
                    stat.positive ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {stat.positive ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Leads</CardTitle>
            <Link 
              to="/developer/leads" 
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leads?.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No leads yet. They'll appear here when buyers inquire.
              </p>
            ) : (
              <div className="space-y-4">
                {leads?.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {lead.name?.slice(0, 2).toUpperCase() || lead.email.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {lead.name || lead.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                        {lead.golden_visa_interest && (
                          <span className="ml-2 text-primary">• Golden Visa</span>
                        )}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lead.lead_status === 'new' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {lead.lead_status || 'new'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Your Properties</CardTitle>
            <Link 
              to="/developer/properties" 
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties?.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No properties yet. Contact us to add your first listing.
              </p>
            ) : (
              <div className="space-y-4">
                {properties?.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{property.name}</p>
                      <p className="text-xs text-muted-foreground">
                        From AED {(property.price_from / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      property.listing_status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {property.listing_status || 'published'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DeveloperLayout>
  );
}
