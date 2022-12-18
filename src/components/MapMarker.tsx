import { View, Text } from 'react-native';
import { useTheme } from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  speed: number;
  rpm: number;
  course: number;
}

interface Device {
  name: string;
}

interface MapMarkerProps {
  position: Position;
  device: Device;
  reposition: (coordinate: Position) => void;
}

export function MapMarker({ position, device, reposition }: MapMarkerProps) {
  const [colorMarker, setColorMarker] = useState('');
  //const { latitude, longitude } = position;
  //const coordinate = { latitude, longitude };

  const { colors } = useTheme();

  useEffect(() => {
    if (position.speed > 0) {
      setColorMarker(colors.green[600]);
    } else if (position.speed === 0) {
      setColorMarker(colors.red[500]);
    } else if (position.speed === 0 && position.rpm > 0) {
      setColorMarker(colors.blue[500]);
    }
  }, [position]);

  return (
    <Marker
      onPress={() => reposition(position)}
      coordinate={position}
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
                justifyContent: 'center',
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
