import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';

export function HomeSEOContent() {
  const { tenant } = useTenant();
  const cityName = tenant?.office_location?.city || 'Dubai';

  return (
    <section className="py-16 md:py-24 border-t border-border/10">
      <div className="container-wide max-w-4xl">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
          Investing in {cityName} Real Estate
        </h2>
        <div className="space-y-5 text-muted-foreground text-sm leading-relaxed">
          <p>
            {cityName} has established itself as one of the world's most dynamic real estate markets, offering investors
            a unique combination of tax-free returns, world-class infrastructure, and a strategic location bridging
            East and West. The off-plan property sector, in particular, presents compelling opportunities —
            with developers offering flexible payment plans, below-market entry prices, and the potential for
            significant capital appreciation before handover.
          </p>
          <p>
            Key areas such as{' '}
            <Link to="/areas/dubai-marina" className="text-foreground underline underline-offset-4 hover:no-underline">Dubai Marina</Link>,{' '}
            <Link to="/areas/downtown-dubai" className="text-foreground underline underline-offset-4 hover:no-underline">Downtown Dubai</Link>,{' '}
            <Link to="/areas/palm-jumeirah" className="text-foreground underline underline-offset-4 hover:no-underline">Palm Jumeirah</Link>, and{' '}
            <Link to="/areas/dubai-creek-harbour" className="text-foreground underline underline-offset-4 hover:no-underline">Dubai Creek Harbour</Link>{' '}
            continue to attract international buyers seeking both lifestyle and investment returns. With rental yields
            averaging 6–8% across prime locations — significantly higher than London, New York, or Singapore — the
            market remains attractive for income-focused investors.
          </p>
          <p>
            Properties valued at AED 2 million or above qualify for the UAE Golden Visa, granting 10-year residency
            to investors and their families. Combined with zero income tax, zero capital gains tax, and a stable
            regulatory environment overseen by the Dubai Land Department (DLD) and RERA, {cityName} offers a
            transparent and secure framework for property investment.
          </p>
        </div>
      </div>
    </section>
  );
}
