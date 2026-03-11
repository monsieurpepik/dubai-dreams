import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    label: 'Villas',
    subtitle: 'Palm Jumeirah · Emirates Hills · Dubai Hills',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    href: '/properties?type=villa',
  },
  {
    label: 'Apartments',
    subtitle: 'Downtown · Marina · DIFC · JBR',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    href: '/properties?type=apartment',
  },
  {
    label: 'Penthouses',
    subtitle: 'Sky-level living across Dubai',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    href: '/properties?type=penthouse',
  },
  {
    label: 'Off-Plan',
    subtitle: 'Directly from top developers',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    href: '/properties?status=off-plan',
  },
];

export function CategoryCards() {
  const navigate = useNavigate();

  return (
    <section className="bg-black py-20 md:py-28 border-t border-white/[0.06]">
      <div className="container-wide">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Browse by category
          </p>
        </motion.div>

        {/* 4-card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(cat.href)}
              className="group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Label at bottom */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <h3 className="text-[15px] md:text-[17px] font-medium tracking-[0.2em] text-white uppercase">
                  {cat.label}
                </h3>
                <p className="mt-1.5 text-[11px] text-white/35 font-light leading-relaxed">
                  {cat.subtitle}
                </p>

                {/* Hover arrow */}
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Explore</span>
                  <span className="text-white/40">&rarr;</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
