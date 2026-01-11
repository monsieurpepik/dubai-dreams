import { Skeleton } from '@/components/ui/skeleton';

interface PropertyCardSkeletonProps {
  featured?: boolean;
}

export const PropertyCardSkeleton = ({ featured = false }: PropertyCardSkeletonProps) => {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden bg-card">
      <div className={`relative bg-muted ${featured ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-2 w-20 bg-muted rounded-full" />
        <div className={`bg-muted rounded ${featured ? 'h-7 w-2/3' : 'h-6 w-1/2'}`} />
        <div className="h-3 w-36 bg-muted rounded" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 w-14 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
        <div className="flex justify-between items-end pt-3 border-t border-border/50">
          <div className="space-y-1">
            <div className="h-2 w-16 bg-muted rounded" />
            <div className="h-5 w-24 bg-muted rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-20 bg-muted rounded ml-auto" />
            <div className="h-4 w-16 bg-muted rounded ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton = () => {
  return (
    <div className="space-y-8">
      <PropertyCardSkeleton featured />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}
      </div>
    </div>
  );
};
