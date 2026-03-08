import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';

interface PropertyMapProps {
  properties: any[];
  highlightedPropertyId?: string | null;
}

// Fix default marker icon
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const highlightedIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -48],
  shadowSize: [57, 57],
  className: 'highlighted-marker',
});

export const PropertyMap = ({ properties, highlightedPropertyId }: PropertyMapProps) => {
  const { formatPrice } = useTenant();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mappableProperties = useMemo(
    () => properties.filter(p => p.latitude && p.longitude),
    [properties]
  );

  const center = useMemo<[number, number]>(() => {
    if (mappableProperties.length === 0) return [25.2048, 55.2708];
    const avgLat = mappableProperties.reduce((s, p) => s + Number(p.latitude), 0) / mappableProperties.length;
    const avgLng = mappableProperties.reduce((s, p) => s + Number(p.longitude), 0) / mappableProperties.length;
    return [avgLat, avgLng];
  }, [mappableProperties]);

  useEffect(() => {
    if (!containerRef.current || mappableProperties.length === 0) return;

    // Clean up previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current).setView(center, 11);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mappableProperties.forEach(p => {
      const img = p.property_images?.find((i: any) => i.is_primary)?.url || p.property_images?.[0]?.url;
      const popupContent = `
        <a href="/properties/${p.slug}" style="display:block;text-decoration:none;color:inherit;">
          ${img ? `<img src="${img}" alt="${p.name}" style="width:192px;height:112px;object-fit:cover;margin-bottom:8px;" />` : ''}
          <p style="font-weight:500;font-size:14px;margin:0 0 2px;font-family:'Cormorant Garamond',serif;">${p.name}</p>
          <p style="font-size:12px;color:#888;margin:0 0 4px;">${p.area}</p>
          <p style="font-size:12px;font-weight:500;margin:0;">
            From ${formatPrice(p.price_from, { compact: true })}${p.roi_estimate ? ` · ${p.roi_estimate}% yield` : ''}
          </p>
        </a>
      `;

      L.marker([Number(p.latitude), Number(p.longitude)], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mappableProperties, center, formatPrice]);

  if (mappableProperties.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-muted text-muted-foreground text-sm">
        No properties with location data available.
      </div>
    );
  }

  return <div ref={containerRef} className="h-[500px] md:h-[600px] w-full overflow-hidden border border-border/30" />;
};
