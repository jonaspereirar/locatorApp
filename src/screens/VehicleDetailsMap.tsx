import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import {
  Text, Box, HStack, Spacer, Stack, Heading,
} from 'native-base';
import moment from 'moment';

interface Props {
  vehicle: any;
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
  },
  bottomView: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

const parseIgnition = (ignitionValue: boolean) => {
  if (ignitionValue) {
    return 'Ligada';
  }
  return 'Desligada';
};

export function VehicleDetailsMap({ vehicle }: Props) {
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  useEffect(() => {
    setRouteCoordinates([{
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
    }]);
  }, []);

  const onLayout = () => {
    if (routeCoordinates.length === 0) {
      return;
    }
    setTimeout(() => {
      (mapRef as any).fitToCoordinates(
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
    }, 500);
  };

  let mapRef: any = null;

  return (
    <View
      style={styles.mainView}
    >
      <MapView
        ref={(ref) => {
          mapRef = ref;
        }}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 38.76825,
          longitude: -9.4324,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0421,
        }}
        provider="google"
        onLayout={onLayout}
      >
        <Marker
          coordinate={{
            latitude: vehicle.latitude,
            longitude: vehicle.longitude,
          }}
          title={vehicle.name}
        />
      </MapView>
      <Box p="2" rounded="8" bg="cyan.700">
        <HStack alignItems="flex-start">
          <Text fontSize={12} color="cyan.50" fontWeight="medium">
            Velocidade:
            {Math.round(vehicle.speed * 1.852)}
            km/h
          </Text>
          <Spacer />
          <Text fontSize={10} color="cyan.100">
            Última actualização:
            {' '}
            {moment(vehicle.lastUpdate).fromNow()}
          </Text>
        </HStack>
        <Text color="cyan.50" mt="3" fontWeight="medium" fontSize={20}>
          Morada:
          {vehicle.address}
        </Text>
        <Text mt="2" fontSize={14} color="cyan.100">
          Estado:
          {vehicle.status}
          {'\n'}
          Ignição:
          {parseIgnition(vehicle.attributes.ignition)}
          {'\n'}
          Voltímetro:
          {vehicle.attributes.power / 1000}
          V
        </Text>
      </Box>
      <Box p="2" rounded="8">
        <Stack p="4" space={1}>
          <Stack space={1}>
            <Heading size="md" ml="-1">
              Informação CAN
            </Heading>
          </Stack>
          <HStack alignItems="center" space={1} justifyContent="space-between">
            <Text
              color="coolGray.600"
              fontWeight="400"
            >
              Rotações do Motor:
              {vehicle.attributes.rpm}
              rpm
              {'\n'}
              Temperatura refrigerante motor:
              {vehicle.attributes.io115 - 40}
              º
              {'\n'}
              Nivel de Combustível:
              {Math.round(vehicle.attributes.io207 * 0.4)}
              %
              {'\n'}
              Odometro:
              {Math.round((vehicle.attributes.io114 * 5) / 1000)}
              KM
            </Text>
          </HStack>
        </Stack>
      </Box>
    </View>
  );
}