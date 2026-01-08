import { motion } from 'framer-motion';
import { FileText, Download, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentDownloadProps {
  propertyId: string;
  propertyName: string;
  brochureUrl?: string | null;
  floorPlanUrl?: string | null;
}

export const DocumentDownload = ({
  propertyId,
  propertyName,
  brochureUrl,
  floorPlanUrl,
}: DocumentDownloadProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<'brochure' | 'floor_plan'>('brochure');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadClick = (docType: 'brochure' | 'floor_plan') => {
    setSelectedDoc(docType);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('document_requests').insert({
        property_id: propertyId,
        email,
        name,
        document_type: selectedDoc,
      });

      if (error) throw error;

      toast.success('Document request submitted! Check your email.');
      setShowForm(false);
      setEmail('');
      setName('');

      // If URL exists, open it
      const url = selectedDoc === 'brochure' ? brochureUrl : floorPlanUrl;
      if (url) {
        window.open(url, '_blank');
      }
    } catch {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasBrochure = !!brochureUrl;
  const hasFloorPlan = !!floorPlanUrl;

  if (!hasBrochure && !hasFloorPlan) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border/50 p-6"
    >
      <h3 className="text-sm font-medium text-foreground mb-5 flex items-center gap-2">
        <FileText className="w-4 h-4 text-accent" />
        Property Documents
      </h3>

      {!showForm ? (
        <div className="space-y-3">
          {hasBrochure && (
            <button
              onClick={() => handleDownloadClick('brochure')}
              className="w-full flex items-center justify-between p-4 bg-secondary hover:bg-secondary/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Project Brochure</p>
                  <p className="text-xs text-muted-foreground">PDF • Full project details</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          )}

          {hasFloorPlan && (
            <button
              onClick={() => handleDownloadClick('floor_plan')}
              className="w-full flex items-center justify-between p-4 bg-secondary hover:bg-secondary/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Floor Plans</p>
                  <p className="text-xs text-muted-foreground">PDF • All unit layouts</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Enter your email to download the {selectedDoc === 'brochure' ? 'brochure' : 'floor plans'} for {propertyName}
          </p>
          
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary border-border/50"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary border-border/50"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              <Mail className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Get Document'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
