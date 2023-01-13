import { PositionsDTO } from '@dtos/PositionsDTO';
import { VehiclesDTO } from '@dtos/vehiclesDTO';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Polyline } from 'react-native-maps';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '@components/Header';

interface Route {
  latitude: number;
  longitude: number;
}

interface Params {
  vehicle: VehiclesDTO;
  position: PositionsDTO;
  routeCoordinates: Array<{ latitude: number, longitude: number }>;
  selectedDayMoment?: moment.Moment;
  momentDate?: moment.Moment;
}

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params) => void
}

export function MapRoute() {
  const navigation = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<IRegion>({
    latitude: 39.5501,
    longitude: -8.0969,
    latitudeDelta: 7.5,
    longitudeDelta: 7.5,
  });

  const route = useRoute();
  const { routeCoordinates, vehicle, position } = route.params as Params;

  function handleVehicleDetailsTrips({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetailsTrips', { vehicle, position, routeCoordinates })
  }

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      focusRoutesCoordinates();
    }
  }, [routeCoordinates]);

  function focusRoutesCoordinates() {
    if (mapRef.current) {
      setTimeout(() => {
        const avgCoordinates = calculateAverageCoordinates(routeCoordinates);
        const newRegion = {
          latitude: avgCoordinates.latitude,
          longitude: avgCoordinates.longitude,
          latitudeDelta: 0.8222,
          longitudeDelta: 0.8621,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
      }, 1000);
    }
  }

  function calculateAverageCoordinates(coordinates: Array<{ latitude: number, longitude: number }>) {
    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);

    const totalLatitude = latitudes.reduce((acc, lat) => acc + lat, 0);
    const totalLongitude = longitudes.reduce((acc, lon) => acc + lon, 0);

    return {
      latitude: totalLatitude / coordinates.length,
      longitude: totalLongitude / coordinates.length,
    };
  }

  if (routeCoordinates && routeCoordinates?.length > 0) {
    mapRef.current?.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 200, right: 200, bottom: 200, left: 200 },
      animated: true,
    });
  }

  const onLayout = (routeCoordinates: Route[]) => {
    if (routeCoordinates.length === 0) {
      return;
    }
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        routeCoordinates,
        {
          edgePadding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          animated: true,
        },
      );
    }, 1000);
  };
  return (
    <>
      <Header name={vehicle.name} onPress={() => handleVehicleDetailsTrips({ vehicle, position, routeCoordinates })} />

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onLayout={() => onLayout(routeCoordinates)}
        initialRegion={region}
        region={region}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="#ff0000"
        />
      </MapView>

    </>
  );
}