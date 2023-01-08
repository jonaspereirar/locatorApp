import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapView from 'react-native-maps';
import { Fab, Icon, NativeBaseProvider, Text, extendTheme, v3CompatibleTheme } from 'native-base';
import { View, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import 'moment/locale/pt';

import { useWebSocket } from '../../components/WebSocket';
import { MapMarker } from '../../components/MapMarker';
import { ModalInfoBox } from '@components/ModalInfoBox';

import { PositionsDTO, DeviceDTO } from '../../dtos';
import * as constants from '../../constants/constants';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapProps {
  position: Array<{
    deviceId: string;
    latitude: number;
    longitude: number;
  }>;
  device: Array<{
    id: string;
    name: string;
  }>;
}
type MapTypes =
  | 'standard'
  | 'satellite'
  | 'hybrid'
  | 'terrain'
  | 'none'
  | 'mutedStandard';

export function Map() {
  const { webSocket } = useWebSocket() || {};
  const mapRef = useRef<MapView>(null);
  const [deviceModal, setDeviceModal] = useState({ name: '', lastUpdate: '' });
  const [positionModal, setPositionModal] = useState({
    address: '',
    speed: 0, attributes: { ignition: true }
  });
  const { width, height } = Dimensions.get('window');
  const [position, setPosition] = useState<PositionsDTO[]>([]);
  const [device, setDevice] = useState<DeviceDTO[]>([]);
  const [showsTraffic, setShowsTraffic] = useState(false);
  const [mapType, setMapType] = useState<MapTypes>('standard');
  const [loading, setLoading] = useState(true);
  const [manualZoom, setManualZoom] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [region, setRegion] = useState<IRegion>({
    latitude: calculateAverageCoordinates(position).latitude || 39.5501,
    longitude: calculateAverageCoordinates(position).longitude || -8.0969,
    latitudeDelta: 7.5,
    longitudeDelta: 7.5,
  });


  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      // Fecha o WebSocket quando a tela atual perde o foco (é escondida)
      return () => webSocket?.close();
    }, [webSocket])
  );

  useEffect(() => {
    // Atualiza o estado deviceModal a cada 30 segundos
    const interval = setInterval(() => {
      setDeviceModal(deviceModal);
    }, 3000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    // Atualiza o estado positionModal a cada 30 segundos
    const interval = setInterval(() => {
      setPositionModal(positionModal);
    }, 3000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    // Chama a função para buscar as posições dos veículos a cada 30 segundos
    const interval = setInterval(() => {
      loadPositions();
    }, 3000);
    loadListVehicles();
    focusAllVehicles();
    return () => clearInterval(interval);
  }, [])


  function focusAllVehicles() {
    const avgCoordinates = calculateAverageCoordinates(position);
    const newRegion = {
      latitude: avgCoordinates.latitude,
      longitude: avgCoordinates.longitude,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0421,
    };

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
    setManualZoom(false);
  }

  function calculateAverageCoordinates(vehicles: PositionsDTO[]) {
    if (!vehicles || vehicles.length === 0) {
      return {
        latitude: 39.5501,
        longitude: -8.0969,
      };
    }

    let sumLat = 0;
    let sumLng = 0;

    for (const v of vehicles) {
      sumLat += v.latitude;
      sumLng += v.longitude;
    }
    const avgLat = sumLat / vehicles.length;
    const avgLng = sumLng / vehicles.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
    };
  }

  async function loadListVehicles() {
    if (position) {
      try {
        const res = await axios.get(`${constants.API_BASE_URL}/api/devices?userId=${user.id}`)
        setDevice(res.data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  async function loadPositions() {
    if (position) {
      try {
        const res = await axios.get(`${constants.API_BASE_URL}/api/positions`)
        setPosition(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  const coordinates = position.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,

  }));

  if (!manualZoom) {
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
    setManualZoom(true)
  }

  function reposition(
    coordinate: { latitude: number; longitude: number },
    device: { name: string, lastUpdate: string },
    data: { address: string; speed: number; attributes: { ignition: boolean } },
    showModal: boolean) {
    setRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 7.5,
      longitudeDelta: 7.5,
    });

    setShowModal(!showModal);
    setDeviceModal({ ...device, lastUpdate: device.lastUpdate });
    setPositionModal(data);
  }
  const onMapReady = () => {
    if (mapRef.current) {
      mapRef.current.fitToElements();
    }
  };


  function onButtonTrafficClick() {
    setShowsTraffic(!showsTraffic)
  }

  const onButtonChangeMapClick = (newMapType: MapTypes) => {

    if (mapType === 'standard') {
      newMapType = 'hybrid';
    }
    if (mapType === 'hybrid') {
      newMapType = 'standard';
    }
    setMapType(newMapType);
  };

  useEffect(() => {
    if (webSocket) {
      webSocket.onopen = () => {
        webSocket.send('WebSocket foi aberto');
      };

      webSocket.onclose = () => {
        console.log('WebSocket foi fechado');
      };

      webSocket.onmessage = (event) => {
        console.log(event.data);
        // processar a mensagem aqui
      };

      return () => {
        webSocket.close();
      };
    }
  }, [webSocket]);

  return (
    <NativeBaseProvider
      theme={extendTheme(v3CompatibleTheme)}
    >
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={region}
          onMapReady={onMapReady}
          region={manualZoom ? undefined : region}
          onRegionChangeComplete={(region) => setManualZoom(true)}
          showsTraffic={showsTraffic}
          mapType={mapType}
          pitchEnabled={true}
        >

          {position.map((item, index) => (
            <MapMarker
              key={index}
              device={{
                name: `${device.find((el) => el.id === item.deviceId)?.name}`,
                lastUpdate: `${device.find((el) => el.id === item.deviceId)?.lastUpdate}`,
              }}
              reposition={() => reposition(
                { latitude: item.latitude, longitude: item.longitude },
                {
                  name: `${device.find((el) => el.id === item.deviceId)?.name}`,
                  lastUpdate: `${device.find((el) => el.id === item.deviceId)?.lastUpdate}`
                },
                {
                  address: item.address,
                  speed: item.speed,
                  attributes: item.attributes,
                },
                showModal
              )}
              showModal={showModal}
              width={width}
              height={height}
              position={{
                latitude: item.latitude,
                longitude: item.longitude,
                course: item.course,
                speed: item.speed,
                rpm: item.attributes.rpm,
              }}
            />
          ))}
        </MapView>

        <Fab
          placement="bottom-right"
          position='absolute'
          onPress={onButtonTrafficClick}
          icon={<Icon color="white" as={MaterialIcons} name="traffic" size="4" />}
        />
        <Fab
          placement="top-left"
          position='absolute'
          onPress={() => onButtonChangeMapClick('hybrid')}
          icon={<Icon color="white" as={MaterialIcons} name="map" size="4" />}
        />
        <Fab
          placement="top-right"
          position='absolute'
          onPress={() => focusAllVehicles()}
          icon={<Icon color="white" as={MaterialCommunityIcons} name="car-multiple" size="4" />}
        />
      </View>
      {position.map((item, index) => (
        <ModalInfoBox
          key={index}
          device={{ name: deviceModal.name }}
          data={{
            address: positionModal.address,
            speed: positionModal.speed,
            ignition: positionModal.attributes.ignition,
            lastUpdate: deviceModal.lastUpdate,


          }}
          height={height}
          width={width}
          show={showModal}
          onClose={() => setShowModal(false)}

        />
      ))}

    </NativeBaseProvider>
  )
}