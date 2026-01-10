import { Skeleton } from '@/components/ui/skeleton';

interface PropertyCardSkeletonProps {
  featured?: boolean;
}

export const PropertyCardSkeleton = ({ featured = false }: PropertyCardSkeletonProps) => {
  return (
    <div className={`relative overflow-hidden bg-card border border-border/30 ${featured ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
      {/* Image skeleton with shimmer */}
      <Skeleton className="absolute inset-0" />
      
      {/* Gradient overlay simulation */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      
      {/* Content skeleton */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {/* Badges row */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        
        {/* Title */}
        <Skeleton className={`h-8 mb-2 ${featured ? 'w-2/3' : 'w-3/4'}`} />
        
        {/* Location */}
        <Skeleton className="h-4 w-1/2 mb-4" />
        
        {/* Price and specs */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Featured skeleton */}
      <PropertyCardSkeleton featured />
      
      {/* Grid skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
      
      {/* Another featured */}
      <PropertyCardSkeleton featured />
      
      {/* More grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    </div>
  );
};
