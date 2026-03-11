import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    label: 'Properties',
    image: 'https://cdn.prod.website-files.com/6704ef547a0aa2ea217de020/6705033ae6501c14512cd5fa_Properties.avif',
    href: '/properties',
    available: true,
  },
  {
    label: 'Jets',
    image: 'https://cdn.prod.website-files.com/6704ef547a0aa2ea217de020/6705060ad608d95ff6588caa_Jets.avif',
    href: '#',
    available: false,
  },
  {
    label: 'Cars',
    image: 'https://cdn.prod.website-files.com/6704ef547a0aa2ea217de020/6705060a86db80bb1f27a659_cars.avif',
    href: '#',
    available: false,
  },
  {
    label: 'Yachts',
    image: 'https://cdn.prod.website-files.com/6704ef547a0aa2ea217de020/6705060a9cbb59852cc6fa3f_Yachts.avif',
    href: '#',
    available: false,
  },
  {
    label: 'Watches',
    image: 'https://cdn.prod.website-files.com/6704ef547a0aa2ea217de020/6705060a6ff76b3cdd9effe2_Watches.avif',
    href: '#',
    available: false,
  },
];

export function CategoryCards() {
  const navigate = useNavigate();

  return (
    <section className="bg-black py-20 md:py-28 border-t border-white/10">
      <div className="container-wide">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-10 text-center"
        >
          Browse Categories
        </motion.p>

        {/* Card grid — staggered like Webflow GSAP */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => cat.available && navigate(cat.href)}
              className={`group relative overflow-hidden cursor-pointer ${
                cat.available ? '' : 'cursor-default'
              }`}
              style={{ aspectRatio: '3/4' }}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 md:pb-8">
                <h3 className="text-[14px] md:text-[16px] font-medium tracking-[0.25em] text-white uppercase">
                  {cat.label}
                </h3>
                {!cat.available && (
                  <span className="mt-2 text-[9px] tracking-[0.2em] text-white/40 uppercase">
                    Coming Soon
                  </span>
                )}
                {cat.available && (
                  <span className="mt-2 text-[9px] tracking-[0.2em] text-white/50 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore &gt;
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
