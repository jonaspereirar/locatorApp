import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import colors from '../constants/colors';

interface MapMarkerProps {
  position: {
    latitude: number;
    longitude: number;
    speed: number;
    rpm: number;
    course: number;
  };
  device: {
    name: string;
    lastUpdate: string;
  };
  showModal: boolean
  width: number,
  height: number,
  reposition: (
    coordinate: { latitude: number; longitude: number },
    device: { name: string },
    showModal: boolean) => void;
}

export function MapMarker({ position, device, reposition }: MapMarkerProps) {
  const { width, height } = Dimensions.get('window')
  const [showModal, setShowModal] = useState(false)
  const [colorMarker, setColorMarker] = useState('');
  const { latitude, longitude } = position;
  const coordinate = { latitude, longitude };

  useEffect(() => {
    if (position.speed > 0) {
      setColorMarker(colors.vehicleStatus.movingColor);
    } else if (position.speed === 0) {
      setColorMarker(colors.vehicleStatus.stoppedColor);
    } else if (position.speed === 0 && position.rpm > 0) {
      setColorMarker(colors.vehicleStatus.idlingColor);
    }
  }, [position]);

  return (
    <>
      <Marker
        onPress={() => reposition(coordinate, device, showModal)}
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
            onPress={() => setShowModal(true)}
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
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="md-arrow-up" color="white" />
              </View>
            </View>
          </Text>
        </View>
        <View>
        </View>
      </Marker>
    </>

  );
};

export default MapMarker;