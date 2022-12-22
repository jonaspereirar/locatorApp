import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  View, Text, NativeBaseProvider, extendTheme, v3CompatibleTheme, Box, HStack, VStack, FlatList, useTheme,
} from 'native-base';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import * as constants from '../constants/constants';
import { VehicleDetailsStopsDTO } from '@dtos/VehicleDetailsStopsDTO';
import { VehiclesDTO } from '../dtos/vehiclesDTO';
import { Loading } from '@components/Loading';

interface Params {
  vehicle: VehiclesDTO;
  selectedDayMoment?: moment.Moment;
  momentDate?: moment.Moment;
}
export interface NavigationProps {
  navigate: (
    screen: string,
    param: {
      vehicle: VehiclesDTO
    }
  ) => void
}

export function VehicleDetailsStops() {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<VehicleDetailsStopsDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment());

  const route = useRoute();
  const { vehicle } = route.params as Params;

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

  return (
    <NativeBaseProvider
      theme={extendTheme(v3CompatibleTheme)}
    >
      <VStack>
        <View mt='20' mb='2'>
          {loading ? <Loading /> : (
            <FlatList
              data={stops}
              key={'stops'}
              style={{ marginBottom: 32 }}
              keyExtractor={(stops, index) => String(index)}
              renderItem={({ item }) => (
                <Box
                  borderBottomWidth="8"
                  borderColor="coolGray.500"
                  pl="4"
                  pr="5"
                  py="2"
                >
                  <VStack>
                    <View ml='1'>
                      <Text color='green.400'>
                        <MaterialCommunityIcons name="google-maps" />
                        {item.address}
                      </Text>
                    </View>
                    <View ml='8'>
                      <Text color='green.400' >
                        De:
                        {' '}
                        {constants.getFormattedDateFromIsoString(item.startTime)}
                        {' '}
                        <Text color='white'>até</Text>
                        {' '}
                        {constants.getFormattedDateFromIsoString(item.endTime)}
                      </Text>
                      <Text color='white' >
                        Duração:
                        {' '}
                        {constants.getMillisecondsFormattedHms(item.duration)}
                      </Text>
                    </View>

                  </VStack>
                </Box>
              )}
            />
          )}
        </View>
        <View mt='-8' mb='-32'>
          <CalendarStrip
            calendarHeaderPosition="above"
            daySelectionAnimation={
              {
                type: 'border',
                duration: 200,
                borderWidth: 1,
                borderHighlightColor: '#1DE9B6',
              }
            }
            style={{ height: 100, paddingTop: -16, paddingBottom: -16 }}
            calendarHeaderStyle={{ color: 'white' }}
            calendarColor="transparent"
            dateNumberStyle={{ color: 'white' }}
            dateNameStyle={{ color: 'white' }}
            highlightDateNumberStyle={{ color: '#1DE9B6' }}
            highlightDateNameStyle={{ color: '#1DE9B6' }}
            disabledDateNameStyle={{ color: 'white' }}
            disabledDateNumberStyle={{ color: 'white' }}
            iconContainer={{ flex: 0.1 }}
            onDateSelected={onSelectedDayChanged}
            selectedDate={selectedDate}
          />
        </View>
      </VStack>
    </NativeBaseProvider>
  );
};