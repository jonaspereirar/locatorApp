import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';

export interface ICoordinate {
  latitude: number;
  longitude: number;
}
export interface IDevice {
  name: string;
}

export interface IMapState {
  position: {
    latitude: number;
    longitude: number;
    speed: number;
    course: number
    rpm: number;
  }
  device: {
    name: string;
  }

  reposition: (
    coordinate: ICoordinate,
    device: IDevice,
  ) => Promise<void>;
}

export function MapMarker({ position, device, reposition }: IMapState) {
  const [coordinate, setCoordinate] = useState({ latitude: 0, longitude: 0 });


  const { colors } = useTheme();

  let colorMarker = '';
  if (position.speed > 0) {
    colorMarker = colors.green[600]
  }
  if (position.speed === 0) {
    colorMarker = colors.red[500]
  }
  if (position.speed === 0 && position.rpm > 0) {
    colorMarker = colors.blue[500]
  }

  return (
    <Marker
      onPress={() => reposition(coordinate, device)}
      coordinate={coordinate}
    >
      <View
        style={{
          backgroundColor: colorMarker,
          paddingHorizontal: 10,
          paddingVertical: 3,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 9,
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            left: 35,
            bottom: -10,
          }}
        />
        <Text
          style={{
            color: 'white',
            fontWeight: '400',
          }}
        >
          {device.name}
          <View
            style={{
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                transform: [{ rotate: `${position.course}deg` }],
                alignItems: 'center',
              }}
            >
              <Ionicons name="md-arrow-up" color="white" />
            </View>
          </View>
        </Text>
      </View>
    </Marker>
  );
}
