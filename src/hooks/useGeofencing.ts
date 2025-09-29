import { useState, useEffect, useMemo } from 'react';
import { Location, GeofenceZone, Offer } from '@/types/location';

// Mock data for demonstration
const mockZones: GeofenceZone[] = [
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    bounds: {
      north: 11.2500,
      south: 10.8500,
      east: 77.1500,
      west: 76.7000
    },
    center: { latitude: 11.0168, longitude: 76.9558 }
  },
  {
    id: 'chennai',
    name: 'Chennai',
    bounds: {
      north: 13.2847,
      south: 12.7745,
      east: 80.3430,
      west: 80.0885
    },
    center: { latitude: 13.0827, longitude: 80.2707 }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    bounds: {
      north: 13.1986,
      south: 12.7343,
      east: 77.8006,
      west: 77.4604
    },
    center: { latitude: 12.9716, longitude: 77.5946 }
  }
];

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Premium Pizza Feast',
    description: 'Buy 1 Get 1 Free on all premium pizzas',
    discount: '50% OFF',
    category: 'dining',
    brand: 'Dominos Pizza',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true,
    terms: 'Valid only for dine-in. Cannot be combined with other offers.'
  },
  {
    id: '2',
    title: 'Luxury Spa Experience',
    description: 'Exclusive wellness package with aromatherapy',
    discount: '40% OFF',
    category: 'wellness',
    brand: 'Serenity Spa',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  },
  {
    id: '3',
    title: 'Coffee House Special',
    description: 'Free coffee with any pastry purchase',
    discount: 'FREE COFFEE',
    category: 'dining',
    brand: 'Café Delight',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  },
  {
    id: '4',
    title: 'Fitness Membership Deal',
    description: '3 months membership at premium gym',
    discount: '30% OFF',
    category: 'fitness',
    brand: 'PowerFit Gym',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  },
  {
    id: '5',
    title: 'Designer Shopping Spree',
    description: 'Exclusive access to premium fashion collections',
    discount: '60% OFF',
    category: 'shopping',
    brand: 'Elite Fashion Hub',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  },
  {
    id: '6',
    title: 'Book Store Bonanza',
    description: 'Buy 2 books and get 1 free bestseller',
    discount: 'BUY 2 GET 1',
    category: 'books',
    brand: 'Literary Haven',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  },
  {
    id: '7',
    title: 'Fine Dining Deluxe',
    description: 'Michelin-recommended 5-course meal experience',
    discount: 'FREE DESSERT',
    category: 'dining',
    brand: 'The Grand Restaurant',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'chennai',
    isActive: true
  },
  {
    id: '8',
    title: 'VIP Movie Experience',
    description: 'Premium cinema with luxury seating and snacks',
    discount: '35% OFF',
    category: 'entertainment',
    brand: 'Platinum Cinemas',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'bangalore',
    isActive: true
  },
  {
    id: '9',
    title: 'Tech Gadget Sale',
    description: 'Latest smartphones and accessories',
    discount: '25% OFF',
    category: 'electronics',
    brand: 'TechWorld',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  },
  {
    id: '10',
    title: 'Beauty Makeover',
    description: 'Complete beauty treatment package',
    discount: '45% OFF',
    category: 'beauty',
    brand: 'Glamour Studio',
    image: '/api/placeholder/300/200',
    validUntil: new Date('2024-12-31'),
    zoneId: 'coimbatore',
    isActive: true
  }
];

const isLocationInZone = (location: Location, zone: GeofenceZone): boolean => {
  const { latitude, longitude } = location;
  const { bounds } = zone;
  
  return (
    latitude >= bounds.south &&
    latitude <= bounds.north &&
    longitude >= bounds.west &&
    longitude <= bounds.east
  );
};

export const useGeofencing = (location: Location | null) => {
  const [activeZone, setActiveZone] = useState<GeofenceZone | null>(null);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [zoneHistory, setZoneHistory] = useState<string[]>([]);

  const currentZone = useMemo(() => {
    if (!location) return null;
    
    return mockZones.find(zone => isLocationInZone(location, zone)) || null;
  }, [location]);

  useEffect(() => {
    if (currentZone) {
      setActiveZone(currentZone);
      
      // Add to history if it's a new zone
      if (!zoneHistory.includes(currentZone.id)) {
        setZoneHistory(prev => [...prev, currentZone.id]);
      }
      
      // Filter offers for current zone
      const zoneOffers = mockOffers.filter(
        offer => offer.zoneId === currentZone.id && offer.isActive
      );
      setAvailableOffers(zoneOffers);
    } else {
      setActiveZone(null);
      setAvailableOffers([]);
    }
  }, [currentZone, zoneHistory]);

  const getOffersByCategory = (category: string) => {
    return availableOffers.filter(offer => offer.category === category);
  };

  const getAllZones = () => mockZones;

  const isInGeofence = !!activeZone;

  return {
    activeZone,
    availableOffers,
    zoneHistory,
    isInGeofence,
    getOffersByCategory,
    getAllZones,
    currentLocation: location
  };
};