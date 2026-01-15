export enum BodyId {
  Sun = 'Sun',
  Moon = 'Moon',
  Mercury = 'Mercury',
  Venus = 'Venus',
  Mars = 'Mars',
  Jupiter = 'Jupiter',
  Saturn = 'Saturn',
  Uranus = 'Uranus',
  Neptune = 'Neptune',
  Pluto = 'Pluto',
  MeanNode = 'MeanNode',
  TrueNode = 'TrueNode',
  SouthNode = 'SouthNode',
  LilithMean = 'LilithMean',
  LilithTrue = 'LilithTrue',
  Vertex = 'Vertex',
  AntiVertex = 'AntiVertex',
  ParsFortunae = 'ParsFortunae',
  Chiron = 'Chiron'
}

export enum HouseSystem {
  Placidus = 'P',
  Koch = 'K',
  WholeSign = 'W',
  Equal = 'E',
  Regiomontanus = 'R',
  Campanus = 'C',
  Topocentric = 'T',
  Porphyry = 'O',
  Alcabitius = 'B',
  Morinus = 'M',
  Meridian = 'X',
  PolichPage = 'H' // Topocentric
}

export enum ZodiacType {
  Tropical = 'Tropical',
  Sidereal = 'Sidereal'
}

export enum SiderealMode {
  FaganBradley = 0,
  Lahiri = 1,
  DeLuce = 2,
  Raman = 3,
  UshaShashi = 4,
  Krishnamurti = 5,
  DjwhalKhul = 6,
  Yukteshwar = 7,
  JnanaBhasin = 8,
  BabylBritton = 9,
  BabylHuber = 10,
  BabylEtpsc = 11,
  BabylParker = 12,
  BabylSchaefer = 13,
  BabylGrahalag = 14,
  GalCenter3Sag = 15,
  GalCenter0Sag = 16,
  J2000 = 19,
  J1900 = 20,
  B1950 = 21
}

export enum Perspective {
  Geocentric = 'Geocentric',
  Heliocentric = 'Heliocentric',
  Topocentric = 'Topocentric'
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number; // meters
}

export interface CelestialPosition {
  id: BodyId;
  name: string;
  degree: number;    // 0-30 degrees within sign
  longitude: number; // 0-360 degrees (Ecliptic Longitude)
  latitude: number;  // ecliptic latitude
  declination: number; 
  distance: number;  // AU
  speed: number;     // degrees per day
  isRetrograde: boolean;
  house: number;     // 1-12
  sign: string;      // Aries, Taurus, etc.
  emoji: string;
}

export interface HouseCusp {
  house: number; // 1-12
  degree: number;    // 0-30 degrees within sign
  longitude: number; // 0-360 degrees
  sign: string;
  emoji: string;
}

export interface ChartAngles {
  Asc: number;
  MC: number;
  Dsc: number;
  IC: number;
  Vertex?: number;
}

export enum AspectType {
  Conjunction = 'Conjunction',
  Opposition = 'Opposition',
  Trine = 'Trine',
  Square = 'Square',
  Sextile = 'Sextile'
}

export interface Aspect {
  body1: CelestialPosition;
  body2: CelestialPosition;
  type: AspectType;
  angle: number; 
  orb: number;   
  isApplying: boolean; 
}

export interface LunarPhase {
  phaseName: string; 
  illumination: number; 
  age: number; // degrees from sun (0-360)
  isWaxing: boolean;
}

export interface ChartData {
  bodies: CelestialPosition[];
  houses: HouseCusp[];
  angles: ChartAngles;
  aspects: Aspect[];
  lunarPhase: LunarPhase;
  meta: {
    date: string; // ISO string
    location: GeoLocation;
    houseSystem: HouseSystem;
    zodiacType: ZodiacType;
    siderealMode?: SiderealMode;
    perspective: Perspective;
    includeBodies?: BodyId[];
  }
}

export interface ZodiacSign {
  name: string;
  element: string;
  quality: string;
  emoji: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', element: 'Fire', quality: 'Cardinal', emoji: '♈︎' },
  { name: 'Taurus', element: 'Earth', quality: 'Fixed', emoji: '♉︎' },
  { name: 'Gemini', element: 'Air', quality: 'Mutable', emoji: '♊︎' },
  { name: 'Cancer', element: 'Water', quality: 'Cardinal', emoji: '♋︎' },
  { name: 'Leo', element: 'Fire', quality: 'Fixed', emoji: '♌︎' },
  { name: 'Virgo', element: 'Earth', quality: 'Mutable', emoji: '♍︎' },
  { name: 'Libra', element: 'Air', quality: 'Cardinal', emoji: '♎︎' },
  { name: 'Scorpio', element: 'Water', quality: 'Fixed', emoji: '♏︎' },
  { name: 'Sagittarius', element: 'Fire', quality: 'Mutable', emoji: '♐︎' },
  { name: 'Capricorn', element: 'Earth', quality: 'Cardinal', emoji: '♑︎' },
  { name: 'Aquarius', element: 'Air', quality: 'Fixed', emoji: '♒︎' },
  { name: 'Pisces', element: 'Water', quality: 'Mutable', emoji: '♓︎' },
];
