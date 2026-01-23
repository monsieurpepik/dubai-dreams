import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Eye, Users, ExternalLink, Search } from 'lucide-react';
import { DeveloperLayout } from '@/components/developer/DeveloperLayout';
import { useDeveloper } from '@/contexts/DeveloperContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DeveloperProperties() {
  const { developer } = useDeveloper();
  const [search, setSearch] = useState('');

  const { data: properties, isLoading } = useQuery({
    queryKey: ['developer-properties-full', developer?.id],
    queryFn: async () => {
      if (!developer?.id) return [];
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id, 
          name, 
          slug, 
          price_from, 
          price_to,
          area,
          bedrooms,
          listing_status, 
          construction_stage,
          completion_date,
          created_at,
          golden_visa_eligible
        `)
        .eq('developer_id', developer.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!developer?.id,
  });

  // Fetch lead counts per property
  const { data: leadCounts } = useQuery({
    queryKey: ['developer-lead-counts', developer?.id],
    queryFn: async () => {
      if (!developer?.id || !properties?.length) return {};
      const propertyIds = properties.map(p => p.id);
      
      const { data, error } = await supabase
        .from('leads')
        .select('property_id')
        .in('property_id', propertyIds);
      
      if (error) throw error;
      
      // Count leads per property
      const counts: Record<string, number> = {};
      data?.forEach(lead => {
        if (lead.property_id) {
          counts[lead.property_id] = (counts[lead.property_id] || 0) + 1;
        }
      });
      return counts;
    },
    enabled: !!developer?.id && !!properties?.length,
  });

  const filteredProperties = properties?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.area.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      case 'archived':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getStageLabel = (stage: string | null) => {
    switch (stage) {
      case 'pre-launch':
        return 'Pre-Launch';
      case 'under-construction':
        return 'Under Construction';
      case 'near-completion':
        return 'Near Completion';
      case 'ready':
        return 'Ready';
      default:
        return stage || 'N/A';
    }
  };

  return (
    <DeveloperLayout
      title="Properties"
      subtitle="Manage your property listings"
    >
      {/* Search and filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" disabled>
          + Add Property (Coming Soon)
        </Button>
      </div>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredProperties?.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No properties found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search 
                  ? 'Try adjusting your search terms'
                  : 'Contact us to add your first property listing'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties?.map((property, index) => (
                  <motion.tr
                    key={property.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{property.name}</p>
                          <p className="text-xs text-muted-foreground">{property.area}</p>
                        </div>
                        {property.golden_visa_eligible && (
                          <Badge variant="secondary" className="text-xs">
                            Golden Visa
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatPrice(property.price_from)}
                        {property.price_to && ` - ${formatPrice(property.price_to)}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {getStageLabel(property.construction_stage)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {leadCounts?.[property.id] || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(property.listing_status)}`}>
                        {property.listing_status || 'published'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/properties/${property.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/properties/${property.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DeveloperLayout>
  );
}
