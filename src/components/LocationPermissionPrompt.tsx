import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, Sparkles } from 'lucide-react';

interface LocationPermissionPromptProps {
  onRequestPermission: () => void;
  loading: boolean;
  error: string | null;
}

const LocationPermissionPrompt: React.FC<LocationPermissionPromptProps> = ({
  onRequestPermission,
  loading,
  error
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="glass shadow-elegant border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl glow-text">
              Discover Premium Offers
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Allow location access to unlock exclusive deals and experiences in your area
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Personalized Offers</p>
                  <p className="text-xs text-muted-foreground">Get deals tailored to your location</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Privacy Protected</p>
                  <p className="text-xs text-muted-foreground">Your location is only used for offers</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <Button 
              onClick={onRequestPermission}
              disabled={loading}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white/20 border-t-white mr-2" />
                  Detecting Location...
                </>
              ) : (
                'Enable Location Access'
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to share your location to receive relevant offers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationPermissionPrompt;