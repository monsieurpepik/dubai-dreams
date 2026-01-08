import { motion } from 'framer-motion';
import { BadgeCheck, Building, Calendar } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  years_active: number | null;
  total_projects: number | null;
  description: string | null;
}

interface DeveloperTrustCardProps {
  developer: Developer;
}

export const DeveloperTrustCard = ({ developer }: DeveloperTrustCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Developer Logo */}
          {developer.logo_url ? (
            <div className="w-14 h-14 bg-secondary flex items-center justify-center overflow-hidden">
              <img 
                src={developer.logo_url} 
                alt={developer.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-14 h-14 bg-secondary flex items-center justify-center">
              <span className="text-xl font-serif text-foreground">
                {developer.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              {developer.name}
            </h3>
            <div className="flex items-center gap-1.5 text-accent">
              <BadgeCheck className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Verified Developer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border/30">
        {developer.years_active && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary flex items-center justify-center">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <span className="block text-lg font-medium text-foreground">
                {developer.years_active}+
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Years Active
              </span>
            </div>
          </div>
        )}
        
        {developer.total_projects && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary flex items-center justify-center">
              <Building className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <span className="block text-lg font-medium text-foreground">
                {developer.total_projects}+
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Projects
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {developer.description && (
        <p className="text-sm text-muted-foreground mt-5 pt-5 border-t border-border/30 leading-relaxed">
          {developer.description}
        </p>
      )}
    </motion.div>
  );
};
