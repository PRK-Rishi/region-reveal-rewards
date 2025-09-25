export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // for circular zones
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  category: 'dining' | 'entertainment' | 'wellness' | 'shopping' | 'travel';
  brand: string;
  image: string;
  validUntil: Date;
  zoneId: string;
  isActive: boolean;
  terms?: string;
}

export interface LocationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}