import React, { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useGeofencing } from '@/hooks/useGeofencing';
import { useToast } from '@/hooks/use-toast';
import LocationPermissionPrompt from '@/components/LocationPermissionPrompt';
import LocationStatus from '@/components/LocationStatus';
import OfferCard from '@/components/OfferCard';
import CategoryFilter from '@/components/CategoryFilter';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, MapPin, Clock, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const { location, permission, loading, error, getCurrentLocation, watchLocation } = useGeolocation();
  const { activeZone, availableOffers, isInGeofence, getOffersByCategory } = useGeofencing(location);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [watchId, setWatchId] = useState<number | null>(null);

  // Start watching location when permission is granted
  useEffect(() => {
    if (permission.granted && !watchId) {
      const id = watchLocation();
      if (id) setWatchId(id);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [permission.granted, watchLocation, watchId]);

  // Show toast notifications for zone changes
  useEffect(() => {
    if (activeZone) {
      toast({
        title: `Welcome to ${activeZone.name}! 🎉`,
        description: `${availableOffers.length} exclusive offers available`,
        duration: 3000,
      });
    }
  }, [activeZone, toast, availableOffers.length]);

  const handleClaimOffer = (offerId: string) => {
    const offer = availableOffers.find(o => o.id === offerId);
    if (offer) {
      toast({
        title: "Offer Claimed! 🎊",
        description: `${offer.title} - Check your email for details`,
        duration: 5000,
      });
    }
  };

  // Get filtered offers
  const filteredOffers = selectedCategory === 'all' 
    ? availableOffers 
    : getOffersByCategory(selectedCategory);

  // Calculate offer counts for categories
  const offerCounts = availableOffers.reduce((counts, offer) => {
    counts[offer.category] = (counts[offer.category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Show permission prompt if needed
  if (!permission.granted) {
    return <LocationPermissionPrompt 
      onRequestPermission={getCurrentLocation}
      loading={loading}
      error={error}
    />;
  }

  return (
    <div className="min-h-screen pb-20 pt-20">
      <Navigation />
      
      <div className="container mx-auto px-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold glow-text animate-slide-up">
            Premium Local Experiences
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Discover exclusive offers and luxury experiences tailored to your exact location
          </p>
        </div>

        {/* Location Status */}
        <LocationStatus 
          location={location}
          activeZone={activeZone}
          isInGeofence={isInGeofence}
          accuracy={location?.accuracy}
        />

        {/* Stats Cards */}
        {isInGeofence && (
          <div className="grid grid-cols-3 gap-3 animate-slide-up">
            <Card className="glass text-center border-primary/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{availableOffers.length}</div>
                <div className="text-xs text-muted-foreground">Active Offers</div>
              </CardContent>
            </Card>
            <Card className="glass text-center border-accent/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">{activeZone?.name}</div>
                <div className="text-xs text-muted-foreground">Current Zone</div>
              </CardContent>
            </Card>
            <Card className="glass text-center border-green-400/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-400">Live</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content based on geofence status */}
        {isInGeofence ? (
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Exclusive Offers
              </h2>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                offerCounts={offerCounts}
              />
            </div>

            {/* Offers Grid */}
            {filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onClaim={handleClaimOffer}
                    className={`animate-slide-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass text-center p-8">
                <CardContent>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">No offers in this category</h3>
                  <p className="text-muted-foreground">
                    Try selecting a different category or check back later
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="glass text-center p-8 animate-fade-in">
            <CardContent className="space-y-4">
              <div className="text-6xl mb-4 animate-float">🗺️</div>
              <h3 className="text-2xl font-bold">Explore Premium Zones</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Move to a premium location zone to unlock exclusive offers and luxury experiences
              </p>
              <Button 
                onClick={() => window.open('/map', '_blank')}
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow mt-4"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View Coverage Map
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;