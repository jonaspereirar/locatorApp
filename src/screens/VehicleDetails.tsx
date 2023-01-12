import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Box, Heading, HStack, Text, View, VStack, Pressable, FlatList } from 'native-base'

import { useEffect, useState, useRef } from 'react';
import { CardInfoVehicle } from '@components/CardInfoVehicle';
import { CardInfoHome } from '@components/CardInfoHome';
import { ReportButton } from '../components/ReportButton'
import { Header } from '@components/Header';
import moment from 'moment';
import { PositionsDTO } from '@dtos/PositionsDTO';
import { DeviceDTO } from '@dtos/deviceDTO';
import MapMarker from '@components/MapMarker';
import { Dimensions } from 'react-native';

interface Params {
  vehicle: DeviceDTO
  position: PositionsDTO
}

export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params) => void
}

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function VehicleDetails() {
  const mapRef = useRef<MapView>(null);
  const { width, height } = Dimensions.get('window');
  const [showModal, setShowModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const navigation = useNavigation<NavigationProps>();
  const [deviceModal, setDeviceModal] = useState({ name: '', lastUpdate: '' });
  const [positionModal, setPositionModal] = useState({
    address: '',
    speed: 0, attributes: { ignition: true }
  });
  const [cards, setCards] = useState([1])
  const [region, setRegion] = useState<IRegion>({
    latitude: 39.5501,
    longitude: -8.0969,
    latitudeDelta: 7.5,
    longitudeDelta: 7.5,
  });

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  useEffect(() => {
    const interval = setInterval(() => {

      parseIgnition(position.attributes.ignition)
      upDateTime()
    }, 3000);
    return () => clearInterval(interval);
  }, [vehicle.lastUpdate]);


  function handleVehicleDetailsStops({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetailsStops', { vehicle, position })
  }

  function VehicleDetailsTrips({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetailsTrips', { vehicle, position })
  }
  function handleVehicleList({ vehicle, position }: Params) {
    navigation.navigate('VehicleList', { vehicle, position })
  }
  function handleVehicleEvents({ vehicle, position }: Params) {
    navigation.navigate('VehicleEvents', { vehicle, position })
  }
  function handleMapRouteDay({ vehicle, position }: Params) {
    navigation.navigate('MapRouteDay', { vehicle, position })
  }

  function handleSmsNotifications({ vehicle, position }: Params) {
    navigation.navigate('SmsNotifications', { vehicle, position })
  }

  function parseIgnition(ignitionValue: boolean) {
    if (ignitionValue) {
      return 'Ligada';
    }
    return 'Desligada';
  };

  function upDateTime() {
    const pastDate = moment(vehicle.lastUpdate);
    const currentDate = moment();
    const difference = currentDate.diff(pastDate, 'minutes');

    if (difference < 60) {
      const minutes = moment.duration(difference, 'minutes').minutes();
      setLastUpdate(`há ${minutes} minutos`);
    } else {
      const hours = moment.duration(difference, 'minutes').hours();
      const minutes = moment.duration(difference, 'minutes').minutes();
      setLastUpdate(`há ${hours} horas e ${minutes} minutos`);
    }
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

  return (

    <VStack flex={1} >
      <Header name={vehicle.name} onPress={() => handleVehicleList({ vehicle, position } as Params)} />
      <Pressable
        backgroundColor='blue.300'
        _pressed={{
          borderColor: 'green.500',
          borderWidth: 2
        }}
      >
        <HStack rounded='md' justifyContent='space-around' mb={3} mt={1}>
          <View flex={1} flexDirection='column' mt={2} mb={1} ml={3} mr={5} size={48}>
            <MapView
              ref={mapRef}
              style={{ flex: 1, minHeight: 100, minWidth: '100%' }}
              initialRegion={region}
              onMapReady={onMapReady}
            >
              {position.latitude !== 0 && (
                <MapMarker
                  reposition={() => reposition(
                    { latitude: position.latitude, longitude: position.longitude },
                    {
                      name: vehicle.name,
                      lastUpdate: vehicle.lastUpdate,
                    },
                    {
                      address: position.address,
                      speed: position.speed,
                      attributes: position.attributes,
                    },
                    showModal
                  )}
                  device={vehicle}
                  showModal={showModal}
                  width={width}
                  height={height}
                  position={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                    course: position.course,
                    speed: position.speed,
                    rpm: position.attributes.rpm,
                  }}
                />
              )}
            </MapView>
          </View>
          <Box mt={1} ml='2' mr='8'>
            <Heading color='gray.100' fontSize='md'>
              {vehicle.name}
            </Heading>
            <Text color='gray.100' fontSize='md' >
              Veiculo: {vehicle.category}{'\n'}
              Marca: {vehicle.model}{'\n'}
              Modelo: {vehicle.model}{'\n'}
              Vim: {vehicle.vim}
            </Text>
          </Box>
        </HStack>

      </Pressable>

      <Pressable
        rounded='md'
        backgroundColor='blue.300'
        alignItems='center'
        justifyContent='space-around'
        mt={1}
        _pressed={{
          borderColor: 'green.500',
          borderWidth: 2
        }} >
        <Box mt={3} mb={3} >
          <Heading color='gray.100' fontSize='sm'
            onPress={() => handleSmsNotifications({ vehicle, position })}
          >
            Não há notificações
          </Heading>
        </Box>
      </Pressable>
      <FlatList
        data={cards}
        key='item'
        keyExtractor={item => String(item)}
        renderItem={({ item }) => (
          <>
            <CardInfoHome
              position={{
                address: position.address,
                speed: position.speed,

                attributes: {
                  ignition: parseIgnition(position.attributes.ignition),
                  power: position.attributes.power / 1000
                },
              }}
              vehicle={{
                lastUpdate: lastUpdate,
                name: vehicle.name,
                status: vehicle.status,
              }}


            />
            <CardInfoVehicle
              data={{
                rpm: position.attributes.rpm,
                engineTemperature: position.attributes.io115 - 40,
                fuel: Math.round(position.attributes.io207 * 0.4),
                Odometro: Math.round((position.attributes.io114 * 5) / 1000),
              }}
            />
          </>

        )
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 1 }}
      />
      <Box mt={1} ml='4'>
        <Heading color='white' fontSize='md'>
          Relatorios
        </Heading>
      </Box>
      <HStack ml='auto' mr='auto'>
        <VStack mb='4' flexDirection='column' ml='4' mr='4'>
          <ReportButton onPress={() => handleVehicleDetailsStops({ vehicle, position })} iconColor='green.400' color='white' title="Viagens" mt={3} />
          <ReportButton onPress={() => handleVehicleEvents({ vehicle, position })} iconColor='blue.500' color='white' title="Eventos" mt={3} />
        </VStack>
        <VStack mb='4' flexDirection='column' ml='4' mr='4'>
          <ReportButton onPress={() => VehicleDetailsTrips({ vehicle, position })} iconColor='sunglow.100' color='white' title="Paragens" mt={3} />
          <ReportButton onPress={() => handleMapRouteDay({ vehicle, position })} iconColor='green.400' color='white' title="Rotas" mt={3} />
        </VStack>
      </HStack>
    </VStack>

  )
}