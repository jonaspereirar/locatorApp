import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { Box, Heading, HStack, Text, View, VStack, Pressable, FlatList } from 'native-base'

import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { useState } from 'react';
import { CardInfoVehicle } from '@components/CardInfoVehicle';
import { CardInfoHome } from '@components/CardInfoHome';
import { ReportButton } from '../components/ReportButton'

interface Params {
  vehicle: VehiclesDTO;
}
export interface NavigationProps {
  navigate: (
    screen: string,
    param: {
      vehicle: VehiclesDTO
    }
  ) => void
}

export function VehicleDetails() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [groupSelected, setGroupSelected] = useState('')
  const navigation = useNavigation<NavigationProps>();
  const [cards, setCards] = useState([1])

  const route = useRoute();
  const { vehicle } = route.params as Params;


  function handleSelectMapPosition(e: MapEvent) {
    setPosition(e.nativeEvent.coordinate);
  }

  function handleVehicleDetailsStops(vehicle: VehiclesDTO) {
    navigation.navigate('VehicleDetailsStops', { vehicle })
  }

  function VehicleDetailsTrips(vehicle: VehiclesDTO) {
    navigation.navigate('VehicleDetailsTrips', { vehicle })
  }


  return (

    <VStack flex={1} px={2} mt={12} my={1} backgroundColor='transparent' >

      <Pressable
        backgroundColor='blue.300'
        _pressed={{
          borderColor: 'green.500',
          borderWidth: 2
        }}
      >
        <HStack rounded='md' justifyContent='space-around' mb={3} mt={5}>
          <View flex={1} flexDirection='column' mt={2} mb={1} ml={3} mr={5} size={48}>
            <MapView
              ref={(ref) => {

              }}
              style={{ flex: 1 }}
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
          <Box mt={5} mr={1}>
            <Heading color='gray.100' fontSize='md'>
              {vehicle.name}
            </Heading>
            <Text color='gray.100' fontSize='xs' >
              Veiculo: {vehicle.category}{'\n'}
              Marca: {vehicle.brand}{'\n'}
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
        mb={3} mt={3}
        _pressed={{
          borderColor: 'green.500',
          borderWidth: 2
        }} >
        <Box mt={3} mb={3} >
          <Heading color='gray.100' fontSize='md'>
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
              name={vehicle.name}
              address={vehicle.address}
              power={vehicle.attributes.power}
              fuel={vehicle.attributes.fuel}
              speed={vehicle.speed}
              rpm={vehicle.rpm}
              status={vehicle.status}
              distance={vehicle.attributes.distance}
              ignition={vehicle.attributes.ignition}
              voltmeter={vehicle.attributes.voltmeter}
              isActive={groupSelected.toLocaleUpperCase() === vehicle.name.toLocaleUpperCase()}
            />
            <CardInfoVehicle
              power={vehicle.attributes.power}
              fuel={vehicle.attributes.fuel}
              rpm={vehicle.rpm}
              status={vehicle.status}
              distance={vehicle.attributes.distance}
              isActive={groupSelected.toLocaleUpperCase() === vehicle.name.toLocaleUpperCase()}
            />
          </>

        )
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 1 }}
      />
      <Box mt={1} ml='4'>
        <Heading color='gray.100' fontSize='lg'>
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