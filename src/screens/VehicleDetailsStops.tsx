import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View, Text, NativeBaseProvider, extendTheme, v3CompatibleTheme, Box, HStack, VStack, FlatList, useTheme,
} from 'native-base';
import { Dimensions } from 'react-native'
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import * as constants from '../constants/constants';
import { VehicleDetailsStopsDTO } from '@dtos/VehicleDetailsStopsDTO';
import { VehiclesDTO } from '../dtos/vehiclesDTO';
import { Loading } from '@components/Loading';
import { Header } from '@components/Header';
import { PositionsDTO } from '@dtos/PositionsDTO';

interface Params {
  vehicle: VehiclesDTO;
  position: PositionsDTO
  selectedDayMoment?: moment.Moment;
  momentDate?: moment.Moment;
}
export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params) => void
}

export function VehicleDetailsStops() {
  const { height, width } = Dimensions.get('window')
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<VehicleDetailsStopsDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  useEffect(() => {
    fetchDailyStops(vehicle);
  }, []);

  const onSelectedDayChanged = (momentDate: moment.Moment) => {
    fetchDailyStops(vehicle, momentDate);
  };

  async function fetchDailyStops(vehicle: VehiclesDTO, selectedDayMoment?: moment.Moment) {
    setLoading(true);
    try {
      const selectedDateMonment = selectedDayMoment === undefined ? moment() : selectedDayMoment;
      const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
      const toMoment = fromMoment.clone().add(1, 'day');
      const response = await axios.get(`${constants.API_BASE_URL}/api/reports/stops?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`);
      setLoading(false);
      setStops(response.data);
      setSelectedDate(selectedDateMonment);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  return (
    <NativeBaseProvider theme={extendTheme(v3CompatibleTheme)}>
      <Header name={vehicle.name} onPress={() => handleVehicleDetails({ vehicle, position })} />
      <CalendarStrip
        daySelectionAnimation={
          {
            type: 'border',
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: 'white',
          }
        }
        style={{ height: 100, paddingTop: 5, paddingBottom: 5 }}
        calendarHeaderStyle={{ color: 'white' }}
        calendarColor="#008385"
        dateNumberStyle={{ color: 'white' }}
        dateNameStyle={{ color: 'white' }}
        highlightDateNumberStyle={{ color: 'yellow' }}
        highlightDateNameStyle={{ color: 'yellow' }}
        disabledDateNameStyle={{ color: 'black' }}
        disabledDateNumberStyle={{ color: 'black' }}
        iconContainer={{ flex: 0.1 }}
        onDateSelected={onSelectedDayChanged}
        selectedDate={selectedDate}
      />
      <VStack>
        <View mt='1' mb={height / 5}>
          {loading ? <Loading /> : (
            <FlatList
              data={stops}
              key={'stops'}
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 64, marginLeft: 10, marginRight: 10 }}
              keyExtractor={(stops, index) => String(index)}
              renderItem={({ item }) => (
                <Box
                  bg='white'
                  borderRadius='10'
                  borderBottomWidth="10"
                  borderColor="#a59999"
                  shadow='2'
                  p='15'
                  pl="4"
                  pr="5"
                  py="2"
                  mb='2'
                >
                  <HStack>
                    <MaterialCommunityIcons name='map-marker-outline' size={20} color='#464444' />
                    <Text style={{ color: '#464444', fontSize: 12 }}>
                      {item.address}
                    </Text>
                  </HStack>
                  <HStack>
                    <View ml='8'>
                      <Text color='#5fb504' >
                        De:
                        {' '}
                        {constants.getFormattedDateFromIsoString(item.startTime)}
                        {' '}
                        <Text color='#464444'>até</Text>
                        {' '}
                        {constants.getFormattedDateFromIsoString(item.endTime)}
                      </Text>
                      <Text color='#464444' >
                        Duração:
                        {' '}
                        {constants.getMillisecondsFormattedHms(item.duration)}
                      </Text>
                    </View>

                  </HStack>
                </Box>
              )}
            />
          )}
        </View>
      </VStack>
    </NativeBaseProvider>
  );
};
