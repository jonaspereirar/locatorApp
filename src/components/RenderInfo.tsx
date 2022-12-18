import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useTheme } from 'native-base';

interface Props {
  positions: {
    deviceId: string;
    address: string;
    speed: number;
    attributes: {
      ignition: boolean;
    };
  }[];
  devices: {
    id: string;
    name: string;
    lastUpdate: string;
  }[];
  width: number;
  height: number;
}

const RenderInfo = (props: Props) => {
  const { width, height } = Dimensions.get('window');
  const bottomHeight = height / 2;
  const { colors } = useTheme();
  const [state, setState] = React.useState({
    translateY: new Animated.Value(0),
    deviceId: ''
  });
  const { translateY, deviceId } = state;
  const { positions, devices } = props;
  const device = devices.find((element) => element.id === deviceId);
  const position = positions.find((element) => element.deviceId === deviceId);
  useEffect(() => {
    if (device === undefined || position === undefined) {
      return;
    }
  }, [device, position]);
  if (device === undefined || position === undefined) {
    return <Animated.View />;
  }

  function hide() {
    Animated.timing(translateY, {
      toValue: bottomHeight,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width,
        height: height / 4,
        backgroundColor: 'white',
        bottom: 0,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.green[600],
          padding: 16,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {device.name}
        </Text>
        <TouchableOpacity
          onPress={() => hide()}
          hitSlop={{
            top: 8, left: 8, bottom: 8, right: 8,
          }}
        >
          <Image
            source={require('../assets/icons/icons8-delete_sign.png')}
            style={{ height: 18, width: 18 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-flag" />
          <Text style={{ marginLeft: 8 }}>{position.address}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-speedometer" />
          <Text style={{ marginLeft: 8 }}>
            {Math.round(position.speed * 1.852)}
            km/h
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-speedometer" />
          <Text style={{ marginLeft: 8 }}>
            {Math.round(position.speed * 1.852)}
            km/h
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-key" />
          <Text style={{ marginLeft: 8 }}>{position.attributes.ignition ? 'Ligada' : 'Desligada'}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-trending-up" />
          <Text style={{ marginLeft: 8 }}>{moment(device.lastUpdate).fromNow()}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default RenderInfo;