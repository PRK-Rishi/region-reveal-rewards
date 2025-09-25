import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star } from 'lucide-react';
import { Offer } from '@/types/location';

interface OfferCardProps {
  offer: Offer;
  onClaim?: (offerId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onClaim, className = '', style }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dining': return '🍽️';
      case 'entertainment': return '🎭';
      case 'wellness': return '🧘';
      case 'shopping': return '🛍️';
      case 'travel': return '✈️';
      default: return '🎁';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dining': return 'bg-orange-500/20 text-orange-400';
      case 'entertainment': return 'bg-purple-500/20 text-purple-400';
      case 'wellness': return 'bg-green-500/20 text-green-400';
      case 'shopping': return 'bg-pink-500/20 text-pink-400';
      case 'travel': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`glass hover:shadow-glow transition-all duration-300 hover:scale-105 animate-slide-up ${className}`} style={style}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-6xl animate-float">
              {getCategoryIcon(offer.category)}
            </div>
          </div>
          
          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(offer.category)} border-0 font-medium`}>
              {offer.category.toUpperCase()}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent text-accent-foreground font-bold shadow-lg">
              {offer.discount}
            </Badge>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">
              {offer.title}
            </h3>
            <p className="text-sm text-primary/80 font-medium mb-2">
              {offer.brand}
            </p>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {offer.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Valid until {formatDate(offer.validUntil)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-accent" />
              <span>Premium</span>
            </div>
          </div>
          
          {offer.terms && (
            <p className="text-xs text-muted-foreground/70 italic">
              {offer.terms}
            </p>
          )}
          
          <Button 
            onClick={() => onClaim?.(offer.id)}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant"
            size="lg"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Claim Offer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;