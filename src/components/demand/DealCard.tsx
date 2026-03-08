import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Building2 } from 'lucide-react';
import { DealMeter } from './DealMeter';
import { useTenant } from '@/hooks/useTenant';

export interface DealProperty {
  id: string;
  name: string;
  slug: string;
  area: string;
  price_from: number;
  price_to?: number;
  roi_estimate?: number;
  completion_date?: string;
  property_type?: string;
  size_sqft_from?: number;
  developer_name: string;
  primary_image?: string;
  fair_value_estimate?: number;
  area_trend_pct?: number;
  deal_score: number;
  yield_estimate: number;
  liquidity_score: number;
  verdict: string;
  insight: string;
}

interface DealCardProps {
  property: DealProperty;
  index: number;
  investorMode: boolean;
}

export function DealCard({ property, index, investorMode }: DealCardProps) {
  const { formatPrice } = useTenant();

  const verdictColor = property.verdict === 'Undervalued'
    ? 'text-green-600 bg-green-50 dark:bg-green-950/30'
    : property.verdict === 'Premium'
    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30'
    : 'text-muted-foreground bg-secondary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      {property.primary_image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={property.primary_image}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] tracking-[0.12em] font-medium px-2.5 py-1 rounded-full ${verdictColor}`}>
              {property.verdict}
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 mb-1">
              {property.developer_name}
            </p>
            <h3 className="font-serif text-lg text-foreground leading-tight truncate">
              {property.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {property.area}
            </div>
          </div>

          {investorMode && <DealMeter score={property.deal_score} size={72} />}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-serif text-xl text-foreground">
            {formatPrice(property.price_from, { compact: true })}
          </span>
          {property.fair_value_estimate && investorMode && (
            <span className="text-xs text-muted-foreground">
              Fair: {formatPrice(property.fair_value_estimate, { compact: true })}
            </span>
          )}
        </div>

        {/* Investor metrics */}
        {investorMode && (
          <div className="mt-4 grid grid-cols-3 gap-3 py-3 border-t border-border">
            <div>
              <p className="text-[10px] tracking-[0.15em] text-muted-foreground/60 uppercase">Yield</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{property.yield_estimate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] text-muted-foreground/60 uppercase">Liquidity</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{property.liquidity_score}/100</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] text-muted-foreground/60 uppercase">Trend</p>
              <p className={`text-sm font-medium mt-0.5 ${(property.area_trend_pct || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {(property.area_trend_pct || 0) > 0 ? '+' : ''}{property.area_trend_pct?.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Insight */}
        {investorMode && (
          <p className="mt-3 text-xs text-muted-foreground italic leading-relaxed">
            "{property.insight}"
          </p>
        )}

        {/* Meta row */}
        <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground/60">
          {property.property_type && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {property.property_type}
            </span>
          )}
          {property.completion_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {property.completion_date}
            </span>
          )}
        </div>

        <Link
          to={`/properties/${property.slug}`}
          className="inline-flex items-center gap-1.5 mt-4 text-[11px] tracking-[0.12em] text-foreground hover:text-muted-foreground transition-colors"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
