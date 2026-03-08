import { TrendingUp, Users, Palmtree, Briefcase, GraduationCap, PartyPopper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const areaDescriptions: Record<string, string> = {
  'Palm Jumeirah': 'Dubai\'s iconic palm-shaped island, home to ultra-luxury residences, five-star hotels, and panoramic sea views. A perennial favourite for international investors seeking prestige and strong capital appreciation.',
  'Business Bay': 'The commercial heartbeat of Dubai, offering a mix of residential towers and office space with stunning Burj Khalifa views. Known for high rental yields and excellent connectivity.',
  'Dubai Marina': 'A vibrant waterfront community with a bustling promenade, yacht clubs, and a cosmopolitan lifestyle. One of Dubai\'s most popular areas for young professionals and investors.',
  'Dubai Creek Harbour': 'A visionary waterfront development by Emaar at the intersection of old and new Dubai. Home to the future Dubai Creek Tower, offering strong growth potential.',
  'Dubai Harbour': 'A premier maritime destination featuring the Dubai Harbour Lighthouse and cruise terminal. Positioned for significant appreciation as development completes.',
  'Downtown Dubai': 'The centre of it all — Burj Khalifa, Dubai Mall, and the Dubai Fountain. Premium positioning with consistently strong demand from both residents and tourists.',
  'Sobha Hartland': 'A green, master-planned community by Sobha Realty in MBR City. Known for high build quality, lush landscapes, and a family-friendly environment.',
  'DAMAC Hills': 'A sprawling golf community by DAMAC Properties offering villas and apartments around the Trump International Golf Club. Excellent value proposition with resort-style amenities.',
  'Al Barari': 'Dubai\'s most exclusive botanical community, offering ultra-private villas surrounded by themed gardens. A rare find for those seeking tranquility within the city.',
  'Mohammed Bin Rashid City': 'One of Dubai\'s largest mixed-use developments, featuring Crystal Lagoons, extensive retail, and diverse residential options from affordable to ultra-luxury.',
  'Dubai Hills Estate': 'A premium master-planned community by Emaar and Meraas, centred around an 18-hole championship golf course. Strong family appeal with excellent schools and parks.',
  'JVC': 'Jumeirah Village Circle offers affordable entry points with growing infrastructure. Popular with first-time investors seeking high rental yields in a developing community.',
  'Jumeirah Beach Residence': 'A beachfront community with a lively walk, dining, and direct beach access. Consistently high demand for short-term rentals and holiday homes.',
  'Dubai South': 'Strategically located near Al Maktoum International Airport and Expo City. An emerging area with long-term growth potential as the airport expansion progresses.',
  'La Mer': 'A trendy beachfront destination in Jumeirah with a creative, Riviera-inspired lifestyle. Premium positioning with a boutique, leisure-focused community feel.',
  'Bluewaters Island': 'Home to Ain Dubai (the world\'s largest observation wheel), this island offers exclusive residences with stunning Arabian Gulf views and a resort lifestyle.',
};

export const areaTags: Record<string, { label: string; icon: LucideIcon }[]> = {
  'Palm Jumeirah': [
    { label: 'Luxury Investors', icon: Briefcase },
    { label: 'Families', icon: Users },
    { label: 'Beach Lifestyle', icon: Palmtree },
  ],
  'Business Bay': [
    { label: 'Investors', icon: Briefcase },
    { label: 'Young Professionals', icon: Users },
  ],
  'Dubai Marina': [
    { label: 'Young Professionals', icon: Users },
    { label: 'Nightlife', icon: PartyPopper },
    { label: 'Investors', icon: Briefcase },
  ],
  'Dubai Creek Harbour': [
    { label: 'Families', icon: Users },
    { label: 'Long-Term Growth', icon: TrendingUp },
  ],
  'DAMAC Hills': [
    { label: 'Families', icon: Users },
    { label: 'Value Investors', icon: Briefcase },
  ],
  'Sobha Hartland': [
    { label: 'Families', icon: Users },
    { label: 'Schools', icon: GraduationCap },
  ],
  'Downtown Dubai': [
    { label: 'Luxury Investors', icon: Briefcase },
    { label: 'Nightlife', icon: PartyPopper },
  ],
  'Dubai Hills Estate': [
    { label: 'Families', icon: Users },
    { label: 'Schools', icon: GraduationCap },
  ],
  'JVC': [
    { label: 'First-Time Buyers', icon: Users },
    { label: 'High Yield', icon: TrendingUp },
  ],
  'Jumeirah Beach Residence': [
    { label: 'Beach Lifestyle', icon: Palmtree },
    { label: 'Short-Term Rentals', icon: Briefcase },
  ],
  'Dubai South': [
    { label: 'Long-Term Growth', icon: TrendingUp },
    { label: 'Value Investors', icon: Briefcase },
  ],
};

export const areaCoordinates: Record<string, [number, number]> = {
  'Palm Jumeirah': [25.1124, 55.1390],
  'Business Bay': [25.1865, 55.2665],
  'Dubai Marina': [25.0800, 55.1400],
  'Dubai Creek Harbour': [25.1970, 55.3430],
  'Dubai Harbour': [25.0930, 55.1320],
  'Downtown Dubai': [25.1972, 55.2744],
  'Sobha Hartland': [25.1750, 55.3100],
  'DAMAC Hills': [25.0250, 55.2450],
  'Al Barari': [25.0830, 55.2840],
  'Mohammed Bin Rashid City': [25.1600, 55.3000],
  'Dubai Hills Estate': [25.1290, 55.2420],
  'JVC': [25.0650, 55.2100],
  'Jumeirah Beach Residence': [25.0780, 55.1340],
  'Dubai South': [24.9300, 55.1700],
  'La Mer': [25.2300, 55.2500],
  'Bluewaters Island': [25.0810, 55.1250],
};

export const areaToSlug = (area: string) => area.toLowerCase().replace(/\s+/g, '-');
export const slugToArea = (slug: string) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
