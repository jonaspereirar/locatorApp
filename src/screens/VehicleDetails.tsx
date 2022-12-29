import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Box, Heading, HStack, Text, View, VStack, Pressable, FlatList } from 'native-base'

import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { useEffect, useState } from 'react';
import { CardInfoVehicle } from '@components/CardInfoVehicle';
import { CardInfoHome } from '@components/CardInfoHome';
import { ReportButton } from '../components/ReportButton'
import { Header } from '@components/Header';
import moment from 'moment';
import { PositionsDTO } from '@dtos/PositionsDTO';

interface Params {
  vehicle: VehiclesDTO;
}
export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params,
  ) => void
}

export function VehicleDetails() {
  const [lastUpdate, setLastUpdate] = useState('');
  const [position, setPosition] = useState<PositionsDTO>({ latitude: 0, longitude: 0 } as PositionsDTO);
  const navigation = useNavigation<NavigationProps>();
  const [cards, setCards] = useState([1])

  const rpm = { attributes: {} };

  const route = useRoute();
  const { vehicle } = route.params as Params;

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


  function handleVehicleDetailsStops(vehicle: VehiclesDTO) {
    navigation.navigate('VehicleDetailsStops', { vehicle })
  }

  function VehicleDetailsTrips(vehicle: VehiclesDTO) {
    navigation.navigate('VehicleDetailsTrips', { vehicle })
  }
  function handleVehicleDetails(vehicle: VehiclesDTO) {
    navigation.navigate('Veículos', { vehicle })
  }

  return (

    <VStack flex={1} >
      <Header name={vehicle.name} onPress={() => handleVehicleDetails(vehicle)} />

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
              Marca: {vehicle.attributes.brand}{'\n'}
              Modelo: {vehicle.model}{'\n'}
              Vim: {vehicle.attributes.vin}
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
          <Heading color='gray.100' fontSize='sm'>
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
              speed={vehicle.attributes.speedLimit}
              lastUpdate={lastUpdate}

              address={vehicle.name}
              status={vehicle.status}
              data={{
                ignition: true,
                speed: 2323,
                voltmeter: 1233,
              }}

            />
            <CardInfoVehicle
              data={{
                distance: 23234,
                engineTemperature: 3434,
                fuel: 453,
                Odometro: 3454,
                rpm: 345
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
        <Heading color='gray.800' fontSize='md'>
          Relatorios
        </Heading>
      </Box>
      <HStack ml='auto' mr='auto'>
        <VStack mb='4' flexDirection='column' ml='4' mr='4'>
          <ReportButton onPress={() => handleVehicleDetailsStops(vehicle)} iconColor='green.400' color='white' title="Viagens" mt={3} />
          <ReportButton iconColor='blue.500' color='white' title="Eventos" mt={3} />
        </VStack>
        <VStack mb='4' flexDirection='column' ml='4' mr='4'>
          <ReportButton onPress={() => VehicleDetailsTrips(vehicle)} iconColor='sunglow.100' color='white' title="Paragens" mt={3} />
          <ReportButton iconColor='green.400' color='white' title="Paragens" mt={3} />
        </VStack>
      </HStack>
    </VStack>

  )
}