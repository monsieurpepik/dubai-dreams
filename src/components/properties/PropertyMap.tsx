import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import 'leaflet/dist/leaflet.css';

interface PropertyMapProps {
  properties: any[];
}

// Custom marker icon
const createIcon = () => new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const PropertyMap = ({ properties }: PropertyMapProps) => {
  const { formatPrice } = useTenant();

  const mappableProperties = useMemo(
    () => properties.filter(p => p.latitude && p.longitude),
    [properties]
  );

  const center = useMemo(() => {
    if (mappableProperties.length === 0) return [25.2048, 55.2708] as [number, number];
    const avgLat = mappableProperties.reduce((s, p) => s + Number(p.latitude), 0) / mappableProperties.length;
    const avgLng = mappableProperties.reduce((s, p) => s + Number(p.longitude), 0) / mappableProperties.length;
    return [avgLat, avgLng] as [number, number];
  }, [mappableProperties]);

  if (mappableProperties.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-muted text-muted-foreground text-sm">
        No properties with location data available.
      </div>
    );
  }

  const icon = createIcon();

  return (
    <div className="h-[500px] md:h-[600px] w-full overflow-hidden border border-border/30">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {mappableProperties.map(p => {
          const img = p.property_images?.find((i: any) => i.is_primary)?.url || p.property_images?.[0]?.url;
          return (
            <Marker
              key={p.id}
              position={[Number(p.latitude), Number(p.longitude)]}
              icon={icon}
            >
              <Popup>
                <Link to={`/properties/${p.slug}`} className="block no-underline text-foreground">
                  {img && (
                    <img src={img} alt={p.name} className="w-48 h-28 object-cover mb-2" />
                  )}
                  <p className="font-medium text-sm mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">{p.area}</p>
                  <p className="text-xs font-medium">
                    From {formatPrice(p.price_from, { compact: true })}
                    {p.roi_estimate ? ` · ${p.roi_estimate}% yield` : ''}
                  </p>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
