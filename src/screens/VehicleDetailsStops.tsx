import React, { useEffect, useState } from 'react';
import {
  View, Text, NativeBaseProvider, extendTheme, v3CompatibleTheme, Box, HStack, VStack, FlatList,
} from 'native-base';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import * as constants from '../constants/constants';
import { api } from '@services/api';

interface Props {
  deviceId: string;
}

export function VehicleDetailsStops({ deviceId }: Props) {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    fetchDailyStops(deviceId);
  }, []);

  const onSelectedDayChanged = (momentDate: moment.Moment) => {
    fetchDailyStops(deviceId, momentDate);
  };

  const getStopsForList = () => stops;

  export function fetchDailyStops({ deviceId, selectedDayMoment }: Props) {
    setLoading(true);
    const selectedDate = selectedDayMoment === undefined ? moment() : selectedDayMoment;
    const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
    const toMoment = fromMoment.clone().add(1, 'day');
    const url = `${api}/api/reports/stops?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${deviceId}`;
    axios.get(url)
      .then((response) => {
        setLoading(false);
        setStops(response.data);
        setSelectedDate(selectedDate);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <NativeBaseProvider
      theme={extendTheme(v3CompatibleTheme)}
    >
      <View>
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
          selectedDate={momentDate}
        />
        {loading ? (
          <Text> A Carregar ... </Text>
        ) : (
          <FlatList
            data={getStopsForList()}
            style={{ marginBottom: 100 }}
            renderItem={({ item: stop }) => (
              <Box
                borderBottomWidth="8"
                borderColor="coolGray.200"
                pl="4"
                pr="5"
                py="2"
              >
                <VStack>
                  <Text>
                    <MaterialCommunityIcons name="google-maps" />
                    {stop.address}
                  </Text>
                  <Text note>
                    De:
                    {' '}
                    {constants.getFormattedDateFromIsoString(stop.startTime)}
                    {' '}
                    até
                    {' '}
                    {constants.getFormattedDateFromIsoString(stop.endTime)}
                  </Text>
                </VStack>
                <HStack>
                  <Text note>
                    Duração:
                    {' '}
                    {constants.getMillisecondsFormattedHms(stop.duration)}
                  </Text>
                </HStack>
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </NativeBaseProvider>
  );
};