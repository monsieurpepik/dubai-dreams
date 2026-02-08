export function generateWhatsAppShareUrl(
  property: {
    name: string;
    area: string;
    price_from: number;
    roi_estimate?: number | null;
    slug: string;
  },
  formatPrice: (n: number, opts?: { compact?: boolean }) => string,
  baseUrl?: string
): string {
  const url = `${baseUrl || window.location.origin}/properties/${property.slug}`;
  const lines = [
    `🏙 ${property.name}`,
    `📍 ${property.area}`,
    `💰 From ${formatPrice(property.price_from, { compact: true })}`,
  ];
  if (property.roi_estimate && property.roi_estimate > 0) {
    lines.push(`📈 Est. Yield: ${property.roi_estimate}%`);
  }
  lines.push('', `View details: ${url}`);
  return `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
}
