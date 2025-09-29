import React, { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useGeofencing } from '@/hooks/useGeofencing';
import { useClaimedOffers } from '@/hooks/useClaimedOffers';
import Navigation from '@/components/Navigation';
import OfferCard from '@/components/OfferCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  Bell, 
  Shield, 
  Settings, 
  History, 
  Star,
  Trophy,
  Gift,
  Sparkles
} from 'lucide-react';

const Profile: React.FC = () => {
  const { location, permission } = useGeolocation();
  const { zoneHistory, availableOffers, activeZone } = useGeofencing(location);
  const { claimedOffers, totalClaimed } = useClaimedOffers();
  const [locationSharing, setLocationSharing] = useState(true);

  // Mock user data
  const userData = {
    name: 'Premium User',
    email: 'user@citytreats.com',
    memberSince: new Date('2024-01-15'),
    totalOffersClaimed: totalClaimed,
    favoriteCategory: 'dining'
  };


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pb-20 pt-20">
      <Navigation />
      
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <h1 className="text-3xl font-bold glow-text">Profile</h1>
          <p className="text-muted-foreground">
            Manage your preferences and view your activity
          </p>
        </div>

        {/* User Info Card */}
        <Card className="glass border-primary/20 shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 bg-gradient-primary glow">
                <AvatarFallback className="text-white font-bold text-xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-primary/20 text-primary border-0">
                    Member since {formatDate(userData.memberSince)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass text-center border-primary/20">
            <CardContent className="p-4">
              <Gift className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">{totalClaimed}</div>
              <div className="text-xs text-muted-foreground">Offers Claimed</div>
            </CardContent>
          </Card>
          
          <Card className="glass text-center border-primary/20">
            <CardContent className="p-4">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{zoneHistory.length}</div>
              <div className="text-xs text-muted-foreground">Zones Visited</div>
            </CardContent>
          </Card>
          
          <Card className="glass text-center border-primary/20">
            <CardContent className="p-4">
              <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{availableOffers.length}</div>
              <div className="text-xs text-muted-foreground">Available Now</div>
            </CardContent>
          </Card>
          
          <Card className="glass text-center border-primary/20">
            <CardContent className="p-4">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400 capitalize">{userData.favoriteCategory}</div>
              <div className="text-xs text-muted-foreground">Favorite Category</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location & Privacy Settings */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Location Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow location access for personalized offers
                  </p>
                </div>
                <Switch 
                  checked={locationSharing}
                  onCheckedChange={setLocationSharing}
                />
              </div>
              
              {!locationSharing && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-orange-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location access is required to claim offers and see nearby deals.
                  </p>
                </div>
              )}

              {/* Current Location Status */}
              {location && (
                <div className="pt-4 border-t border-primary/10">
                  <h4 className="font-medium mb-2">Current Location</h4>
                  <div className="p-3 glass rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">
                          {activeZone ? `${activeZone.name} (Active Zone)` : 'Outside Coverage'}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${activeZone ? 'bg-green-400 animate-pulse' : 'bg-muted'}`} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity & Claimed Offers */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Activity & Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid w-full grid-cols-2 glass">
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="claimed">Claimed Offers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="space-y-4 mt-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {zoneHistory.length > 0 ? (
                      zoneHistory.slice(-5).reverse().map((zoneId, index) => (
                        <div key={`${zoneId}-${index}`} className="flex items-center gap-3 p-3 glass rounded-lg">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Visited {zoneId}</p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 ? 'Currently here' : `${index + 1} visit${index > 0 ? 's' : ''} ago`}
                            </p>
                          </div>
                          {index === 0 && activeZone?.id === zoneId && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📍</div>
                        <p className="text-muted-foreground text-sm">
                          No location history yet. Visit a premium zone to get started!
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="claimed" className="space-y-4 mt-4">
                  <div className="max-h-64 overflow-y-auto">
                    {claimedOffers.length > 0 ? (
                      <div className="space-y-3">
                        {claimedOffers.slice(0, 3).map((offer) => (
                          <div key={offer.claimId} className="p-3 glass rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{offer.title}</h4>
                                <p className="text-xs text-muted-foreground">{offer.brand}</p>
                                <p className="text-xs text-green-400 mt-1">
                                  Claimed on {offer.claimedAt.toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                {offer.discount}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {claimedOffers.length > 3 && (
                          <p className="text-xs text-center text-muted-foreground pt-2">
                            +{claimedOffers.length - 3} more offers claimed
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">🎁</div>
                        <p className="text-muted-foreground text-sm">
                          No offers claimed yet. Start exploring to claim your first offer!
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="glass hover:shadow-elegant">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="glass hover:shadow-elegant">
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button variant="outline" className="glass hover:shadow-elegant">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </div>
            
            <div className="pt-4 border-t border-primary/10">
              <p className="text-xs text-muted-foreground text-center">
                CityTreats Premium • Version 1.0.0 • 
                <span className="ml-1">Built with ❤️ for location-based experiences</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;