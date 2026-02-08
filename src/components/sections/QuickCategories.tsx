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
    <section className="py-12 md:py-16 bg-background">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
