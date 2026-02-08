import { Link } from 'react-router-dom';

const categories = [
  { label: 'Golden Visa', href: '/properties?collection=golden-visa' },
  { label: 'Waterfront', href: '/properties?collection=waterfront' },
  { label: 'Handover 2025', href: '/properties?collection=handover-2025' },
  { label: 'High Yield', href: '/properties?collection=high-yield' },
  { label: 'Studios', href: '/properties?collection=studios' },
  { label: '3BR+', href: '/properties?collection=3br-plus' },
];

export function QuickCategories() {
  return (
    <section className="py-8 md:py-10 bg-background">
      <div className="container-wide">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="flex-shrink-0 px-5 py-2.5 text-xs tracking-wide text-muted-foreground border border-border/40 hover:border-foreground/30 hover:text-foreground transition-all duration-300 whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
