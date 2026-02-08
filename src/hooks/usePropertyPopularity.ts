import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePropertyViewCounts = (propertyIds: string[]) => {
  return useQuery({
    queryKey: ['property-view-counts', propertyIds.sort().join(',')],
    queryFn: async () => {
      if (propertyIds.length === 0) return {};

      // Get views from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('property_views')
        .select('property_id')
        .in('property_id', propertyIds)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) {
        console.error('Error fetching view counts:', error);
        return {};
      }

      const counts: Record<string, number> = {};
      (data || []).forEach(row => {
        counts[row.property_id] = (counts[row.property_id] || 0) + 1;
      });
      return counts;
    },
    enabled: propertyIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePropertyViewCount = (propertyId: string | undefined) => {
  return useQuery({
    queryKey: ['property-view-count', propertyId],
    queryFn: async () => {
      if (!propertyId) return 0;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count, error } = await supabase
        .from('property_views')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) {
        console.error('Error fetching view count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
};
