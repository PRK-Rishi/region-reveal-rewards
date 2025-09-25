import React, { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useGeofencing } from '@/hooks/useGeofencing';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import LocationStatus from '@/components/LocationStatus';
import OfferCard from '@/components/OfferCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortAsc, Clock, TrendingUp, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

const OffersPage: React.FC = () => {
  const { location } = useGeolocation();
  const { activeZone, availableOffers, isInGeofence, getOffersByCategory } = useGeofencing(location);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleClaimOffer = (offerId: string) => {
    const offer = availableOffers.find(o => o.id === offerId);
    if (offer) {
      toast({
        title: "Offer Claimed! 🎊",
        description: `${offer.title} - Redirecting to brand app...`,
        duration: 5000,
      });
    }
  };

  // Filter and search offers
  let filteredOffers = selectedCategory === 'all' 
    ? availableOffers 
    : getOffersByCategory(selectedCategory);

  if (searchQuery) {
    filteredOffers = filteredOffers.filter(offer =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort offers
  filteredOffers.sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return b.discount.localeCompare(a.discount);
      case 'brand':
        return a.brand.localeCompare(b.brand);
      case 'expiry':
        return a.validUntil.getTime() - b.validUntil.getTime();
      default: // newest
        return b.id.localeCompare(a.id);
    }
  });

  // Calculate offer counts for categories
  const offerCounts = availableOffers.reduce((counts, offer) => {
    counts[offer.category] = (counts[offer.category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'discount', label: 'Best Deals', icon: TrendingUp },
    { value: 'brand', label: 'Brand A-Z', icon: SortAsc },
    { value: 'expiry', label: 'Expiring Soon', icon: Star }
  ];

  return (
    <div className="min-h-screen pb-20 pt-20">
      <Navigation />
      
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <h1 className="text-3xl font-bold glow-text">All Offers</h1>
          <p className="text-muted-foreground">
            {isInGeofence 
              ? `${availableOffers.length} exclusive offers available in ${activeZone?.name}`
              : 'Move to a premium zone to see available offers'
            }
          </p>
        </div>

        {/* Location Status */}
        <LocationStatus 
          location={location}
          activeZone={activeZone}
          isInGeofence={isInGeofence}
          accuracy={location?.accuracy}
        />

        {isInGeofence && availableOffers.length > 0 && (
          <>
            {/* Search and Filters */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search offers, brands, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass border-primary/20"
                  />
                </div>

                {/* Sort Options */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground flex items-center gap-2 mr-2">
                    <SortAsc className="w-4 h-4" />
                    Sort by:
                  </span>
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy(option.value)}
                        className={`
                          flex items-center gap-1 text-xs
                          ${sortBy === option.value 
                            ? 'bg-gradient-primary text-white shadow-glow' 
                            : 'glass hover:shadow-elegant'
                          }
                        `}
                      >
                        <Icon className="w-3 h-3" />
                        {option.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Category Filter */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  offerCounts={offerCounts}
                />

                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-primary/10">
                  <span>
                    Showing {filteredOffers.length} of {availableOffers.length} offers
                  </span>
                  {searchQuery && (
                    <Badge variant="outline" className="text-xs">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Offers Grid */}
            {filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onClaim={handleClaimOffer}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass text-center p-8">
                <CardContent>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">No offers found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* No Offers State */}
        {!isInGeofence && (
          <Card className="glass text-center p-8 animate-fade-in">
            <CardContent className="space-y-4">
              <div className="text-6xl mb-4 animate-float">📍</div>
              <h3 className="text-2xl font-bold">No Active Zone</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You're currently outside our premium coverage areas. Move to a supported city to unlock exclusive offers.
              </p>
              <Button 
                onClick={() => window.open('/map', '_blank')}
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow mt-4"
              >
                View Coverage Areas
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OffersPage;