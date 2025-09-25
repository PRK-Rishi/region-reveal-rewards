import React, { useRef, useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useGeofencing } from '@/hooks/useGeofencing';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Navigation2, Zap } from 'lucide-react';

const MapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { location } = useGeolocation();
  const { getAllZones, activeZone, availableOffers } = useGeofencing(location);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  
  const zones = getAllZones();

  // Mock map implementation (replace with actual Mapbox when token is available)
  useEffect(() => {
    if (!mapContainer.current) return;

    // This would be replaced with actual Mapbox initialization
    console.log('Map would initialize here with Mapbox GL JS');
  }, []);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const selectedZoneData = zones.find(z => z.id === selectedZone);
  const selectedZoneOffers = availableOffers.filter(offer => offer.zoneId === selectedZone);

  return (
    <div className="min-h-screen pb-20 pt-20">
      <Navigation />
      
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <h1 className="text-3xl font-bold glow-text flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            Coverage Map
          </h1>
          <p className="text-muted-foreground">
            Explore premium zones and discover exclusive offers in major cities
          </p>
        </div>

        {/* Current Location Status */}
        {location && (
          <Card className="glass border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center glow">
                    <Navigation2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                {activeZone && (
                  <Badge className="bg-green-500/20 text-green-400 animate-pulse-glow">
                    In {activeZone.name}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="glass border-primary/20 h-96 lg:h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Interactive Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 relative">
                {/* Placeholder for Mapbox */}
                <div 
                  ref={mapContainer} 
                  className="w-full h-full rounded-b-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <div className="text-6xl animate-float">🗺️</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Interactive Map Loading...</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        Premium interactive map with real-time geofencing zones. 
                        Connect Mapbox API for full functionality.
                      </p>
                      <Badge className="bg-accent/20 text-accent">
                        Demo Mode
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Map Overlay Info */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex gap-2 flex-wrap">
                    {zones.map(zone => (
                      <Button
                        key={zone.id}
                        size="sm"
                        onClick={() => handleZoneClick(zone.id)}
                        className={`
                          glass text-xs
                          ${selectedZone === zone.id 
                            ? 'bg-gradient-primary text-white shadow-glow' 
                            : 'hover:shadow-elegant'
                          }
                          ${activeZone?.id === zone.id ? 'animate-pulse-glow' : ''}
                        `}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {zone.name}
                        {activeZone?.id === zone.id && (
                          <span className="ml-1 text-xs">●</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone Information Panel */}
          <div className="space-y-4">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Zone Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedZoneData ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary">{selectedZoneData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Premium coverage zone with exclusive offers
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Latitude:</span>
                        <div className="font-mono text-xs">
                          {selectedZoneData.center.latitude.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Longitude:</span>
                        <div className="font-mono text-xs">
                          {selectedZoneData.center.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Active Offers</span>
                        <Badge className="bg-accent/20 text-accent">
                          {selectedZoneOffers.length}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedZoneOffers.map(offer => (
                          <div key={offer.id} className="p-3 glass rounded-lg border border-primary/10">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-medium text-sm line-clamp-1">{offer.title}</h4>
                                <p className="text-xs text-muted-foreground">{offer.brand}</p>
                              </div>
                              <Badge className="bg-accent/20 text-accent text-xs ml-2">
                                {offer.discount}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeZone?.id === selectedZoneData.id && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-400">
                            You are currently in this zone
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👆</div>
                    <p className="text-muted-foreground text-sm">
                      Click on a zone above to view details and available offers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone Statistics */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Coverage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{zones.length}</div>
                    <div className="text-xs text-muted-foreground">Active Zones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {zones.reduce((total, zone) => {
                        const offers = availableOffers.filter(o => o.zoneId === zone.id);
                        return total + offers.length;
                      }, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Offers</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Popular Categories</h4>
                  {['dining', 'entertainment', 'wellness', 'shopping'].map(category => {
                    const count = availableOffers.filter(o => o.category === category).length;
                    return (
                      <div key={category} className="flex justify-between text-xs">
                        <span className="capitalize">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;