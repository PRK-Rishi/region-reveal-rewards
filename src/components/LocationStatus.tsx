import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, WifiOff } from 'lucide-react';
import { Location, GeofenceZone } from '@/types/location';

interface LocationStatusProps {
  location: Location | null;
  activeZone: GeofenceZone | null;
  isInGeofence: boolean;
  accuracy?: number;
}

const LocationStatus: React.FC<LocationStatusProps> = ({
  location,
  activeZone,
  isInGeofence,
  accuracy
}) => {
  const getAccuracyLevel = (acc?: number) => {
    if (!acc) return 'unknown';
    if (acc <= 10) return 'excellent';
    if (acc <= 50) return 'good';
    if (acc <= 100) return 'fair';
    return 'poor';
  };

  const getAccuracyColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-green-300';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="glass border-primary/20 shadow-elegant">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${isInGeofence 
                ? 'bg-gradient-primary animate-pulse-glow' 
                : 'bg-muted/50'
              }
            `}>
              <MapPin className={`w-5 h-5 ${isInGeofence ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">
                  {isInGeofence ? activeZone?.name : 'Outside Coverage'}
                </h3>
                {isInGeofence ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              
              {location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </span>
                  {accuracy && (
                    <Badge 
                      className={`
                        ${getAccuracyColor(getAccuracyLevel(accuracy))} 
                        bg-transparent border-current text-xs
                      `}
                    >
                      ±{Math.round(accuracy)}m
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            className={`
              ${isInGeofence 
                ? 'bg-green-500/20 text-green-400 animate-pulse-glow' 
                : 'bg-muted/20 text-muted-foreground'
              }
              border-0 font-medium
            `}
          >
            {isInGeofence ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationStatus;