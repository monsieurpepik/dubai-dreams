import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Filters {
  area: string;
  developer: string;
  priceRange: string;
  bedrooms: string;
}

interface PropertyFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
  areas: string[];
  developers: { slug: string; name: string }[];
}

const priceRanges = [
  { value: 'all', label: 'Any Price' },
  { value: 'under-1m', label: 'Under AED 1M' },
  { value: '1m-2m', label: 'AED 1M - 2M' },
  { value: '2m-5m', label: 'AED 2M - 5M' },
  { value: '5m-10m', label: 'AED 5M - 10M' },
  { value: 'above-10m', label: 'Above AED 10M' },
];

const bedroomOptions = [
  { value: 'all', label: 'Any Beds' },
  { value: '1', label: '1 BR' },
  { value: '2', label: '2 BR' },
  { value: '3', label: '3 BR' },
  { value: '4', label: '4+ BR' },
];

export const PropertyFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  areas,
  developers,
}: PropertyFiltersProps) => {
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== 'all'
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center gap-3"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      {/* Area Filter */}
      <Select
        value={filters.area}
        onValueChange={(value) => onFilterChange('area', value)}
      >
        <SelectTrigger className="w-[160px] bg-card border-border/50 h-9">
          <SelectValue placeholder="All Areas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Areas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Developer Filter */}
      <Select
        value={filters.developer}
        onValueChange={(value) => onFilterChange('developer', value)}
      >
        <SelectTrigger className="w-[160px] bg-card border-border/50 h-9">
          <SelectValue placeholder="All Developers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Developers</SelectItem>
          {developers.map((dev) => (
            <SelectItem key={dev.slug} value={dev.slug}>
              {dev.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Range Filter */}
      <Select
        value={filters.priceRange}
        onValueChange={(value) => onFilterChange('priceRange', value)}
      >
        <SelectTrigger className="w-[160px] bg-card border-border/50 h-9">
          <SelectValue placeholder="Any Price" />
        </SelectTrigger>
        <SelectContent>
          {priceRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Bedrooms Filter */}
      <Select
        value={filters.bedrooms}
        onValueChange={(value) => onFilterChange('bedrooms', value)}
      >
        <SelectTrigger className="w-[120px] bg-card border-border/50 h-9">
          <SelectValue placeholder="Any Beds" />
        </SelectTrigger>
        <SelectContent>
          {bedroomOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Clear
          <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
            {activeFiltersCount}
          </Badge>
        </Button>
      )}
    </motion.div>
  );
};
