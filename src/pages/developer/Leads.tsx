import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { DeveloperLayout } from '@/components/developer/DeveloperLayout';
import { useDeveloper } from '@/contexts/DeveloperContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

const statusConfig: Record<LeadStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  new: { label: 'New', color: 'bg-green-100 text-green-700', icon: Clock },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700', icon: Mail },
  qualified: { label: 'Qualified', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  converted: { label: 'Converted', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  lost: { label: 'Lost', color: 'bg-muted text-muted-foreground', icon: XCircle },
};

export default function DeveloperLeads() {
  const { developer, user } = useDeveloper();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties first to get IDs
  const { data: properties } = useQuery({
    queryKey: ['developer-properties-ids', developer?.id],
    queryFn: async () => {
      if (!developer?.id) return [];
      const { data, error } = await supabase
        .from('properties')
        .select('id, name')
        .eq('developer_id', developer.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!developer?.id,
  });

  // Fetch leads for developer's properties
  const { data: leads, isLoading } = useQuery({
    queryKey: ['developer-leads-full', developer?.id, properties],
    queryFn: async () => {
      if (!developer?.id || !properties?.length) return [];
      const propertyIds = properties.map(p => p.id);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!developer?.id && !!properties?.length,
  });

  // Update lead status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: LeadStatus }) => {
      const { error } = await supabase
        .from('leads')
        .update({ 
          lead_status: status,
          claimed_at: status !== 'new' ? new Date().toISOString() : null,
          claimed_by: status !== 'new' ? user?.id : null,
        })
        .eq('id', leadId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-leads-full'] });
      toast({
        title: 'Status updated',
        description: 'Lead status has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update lead status.',
        variant: 'destructive',
      });
    },
  });

  const getPropertyName = (propertyId: string | null) => {
    if (!propertyId) return 'N/A';
    return properties?.find(p => p.id === propertyId)?.name || 'Unknown';
  };

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search);
    
    const matchesStatus = statusFilter === 'all' || lead.lead_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportLeads = () => {
    if (!filteredLeads?.length) return;
    
    const csv = [
      ['Name', 'Email', 'Phone', 'Property', 'Status', 'Golden Visa', 'Date'].join(','),
      ...filteredLeads.map(lead => [
        lead.name || '',
        lead.email,
        lead.phone || '',
        getPropertyName(lead.property_id),
        lead.lead_status || 'new',
        lead.golden_visa_interest ? 'Yes' : 'No',
        format(new Date(lead.created_at), 'yyyy-MM-dd'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.lead_status === 'new').length || 0,
    goldenVisa: leads?.filter(l => l.golden_visa_interest).length || 0,
  };

  return (
    <DeveloperLayout
      title="Leads"
      subtitle="Track and manage your property inquiries"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New (Uncontacted)</p>
                <p className="text-2xl font-bold text-green-600">{stats.new}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Golden Visa Interest</p>
                <p className="text-2xl font-bold text-primary">{stats.goldenVisa}</p>
              </div>
              <Badge variant="secondary" className="text-xs">High Intent</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportLeads} disabled={!filteredLeads?.length}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))
        ) : filteredLeads?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No leads found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Leads will appear here when buyers inquire about your properties'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads?.map((lead, index) => {
            const status = (lead.lead_status as LeadStatus) || 'new';
            const config = statusConfig[status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Lead Info */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {lead.name?.slice(0, 2).toUpperCase() || lead.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{lead.name || 'No name provided'}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {lead.email}
                            </span>
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {lead.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {getPropertyName(lead.property_id)}
                            </span>
                            {lead.golden_visa_interest && (
                              <Badge variant="secondary" className="text-xs">
                                Golden Visa Interest
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        <Select
                          value={status}
                          onValueChange={(value) => 
                            updateStatusMutation.mutate({ 
                              leadId: lead.id, 
                              status: value as LeadStatus 
                            })
                          }
                        >
                          <SelectTrigger className={`w-36 ${config.color}`}>
                            <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, cfg]) => (
                              <SelectItem key={key} value={key}>
                                {cfg.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </DeveloperLayout>
  );
}
