import { useState, useCallback } from 'react';
import { Offer } from '@/types/location';

interface ClaimedOffer extends Offer {
  claimedAt: Date;
  claimId: string;
}

export const useClaimedOffers = () => {
  const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>([]);

  const claimOffer = useCallback((offer: Offer): boolean => {
    // Check if offer is already claimed
    const isAlreadyClaimed = claimedOffers.some(claimed => claimed.id === offer.id);
    
    if (isAlreadyClaimed) {
      return false; // Already claimed
    }

    // Add to claimed offers
    const claimedOffer: ClaimedOffer = {
      ...offer,
      claimedAt: new Date(),
      claimId: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setClaimedOffers(prev => [claimedOffer, ...prev]);
    return true; // Successfully claimed
  }, [claimedOffers]);

  const isOfferClaimed = useCallback((offerId: string): boolean => {
    return claimedOffers.some(claimed => claimed.id === offerId);
  }, [claimedOffers]);

  const getClaimedOffersByCategory = useCallback((category: string) => {
    return claimedOffers.filter(offer => offer.category === category);
  }, [claimedOffers]);

  return {
    claimedOffers,
    claimOffer,
    isOfferClaimed,
    getClaimedOffersByCategory,
    totalClaimed: claimedOffers.length
  };
};