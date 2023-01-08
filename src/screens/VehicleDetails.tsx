import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Box, Heading, HStack, Text, View, VStack, Pressable, FlatList } from 'native-base'

import { useEffect, useState } from 'react';
import { CardInfoVehicle } from '@components/CardInfoVehicle';
import { CardInfoHome } from '@components/CardInfoHome';
import { ReportButton } from '../components/ReportButton'
import { Header } from '@components/Header';
import moment from 'moment';
import { PositionsDTO } from '@dtos/PositionsDTO';
import { DeviceDTO } from '@dtos/deviceDTO';

interface Params {
  vehicle: DeviceDTO
  position: PositionsDTO
}

export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params) => void
}

export function VehicleDetails() {
  const [lastUpdate, setLastUpdate] = useState('');
  const navigation = useNavigation<NavigationProps>();
  const [cards, setCards] = useState([1])



  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  useEffect(() => {
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

  function handleSmsNotifications({ vehicle, position }: Params) {
    navigation.navigate('SmsNotifications', { vehicle, position })
  }

  const parseIgnition = (ignitionValue: boolean) => {
    if (ignitionValue) {
      return 'Ligada';
    }
    return 'Desligada';
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
              ref={(ref) => {

              }}
              style={{ flex: 1, minHeight: 100, minWidth: '100%' }}
              initialRegion={{
                latitude: 38.76825,
                longitude: -9.4324,
                latitudeDelta: 0.0322,
                longitudeDelta: 0.0421,
              }}
              provider="google"
            >
              {position.latitude !== 0 && (
                <Marker
                  coordinate={{ latitude: position.latitude, longitude: position.longitude }}
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
              data={{
                speed: position.speed,
                lastUpdate: lastUpdate,
                address: vehicle.name,
                status: vehicle.status,
                attributes: {
                  ignition: Boolean(position.attributes.ignition ? 'Ligada' : 'Desligada'),
                  voltmeter: Math.round((vehicle.attributes.io114 * 5) / 1000)
                }

              }}

            />
            <CardInfoVehicle
              data={{
                distance: position.attributes.distance,
                engineTemperature: vehicle.attributes.io115,
                fuel: vehicle.attributes.io207,
                Odometro: vehicle.attributes.io114 * 5,
                rpm: vehicle.attributes.rpm
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
          <ReportButton iconColor='green.400' color='white' title="Rotas" mt={3} />
        </VStack>
      </HStack>
    </VStack>

  )
}