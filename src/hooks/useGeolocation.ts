import { useState, useEffect, useCallback } from 'react';
import { Location, LocationPermission } from '@/types/location';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [permission, setPermission] = useState<LocationPermission>({
    granted: false,
    denied: false,
    prompt: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermission({
        granted: result.state === 'granted',
        denied: result.state === 'denied',
        prompt: result.state === 'prompt'
      });
    } catch (err) {
      console.error('Permission check failed:', err);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(newLocation);
        setLoading(false);
        setPermission(prev => ({ ...prev, granted: true, denied: false }));
      },
      (err) => {
        let errorMessage = 'Failed to get location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setPermission(prev => ({ ...prev, granted: false, denied: true }));
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) return null;

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // 30 seconds cache
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(newLocation);
        setPermission(prev => ({ ...prev, granted: true, denied: false }));
      },
      (err) => {
        console.error('Watch location error:', err);
      },
      options
    );

    return watchId;
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    location,
    permission,
    loading,
    error,
    getCurrentLocation,
    watchLocation,
    checkPermission
  };
};