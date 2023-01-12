import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from "axios";
import moment from "moment";
import {
  View,
  Card,
  Box,
  NativeBaseProvider,
  extendTheme,
  v3CompatibleTheme,
  FlatList,
  VStack,
  HStack,
  Spacer,
  Text,
} from "native-base";
import CalendarStrip from "react-native-calendar-strip";
import Timeline from "../components/timeline";
import * as constants from "../constants/constants";
import styles from "./styles";
import { VehiclesDTO } from "@dtos/vehiclesDTO";
import { VehicleDetailsEventsDTO } from "@dtos/VehicleDetailsEventsDTO";
import { Loading } from "@components/Loading";
import { Header } from "@components/Header";
import { PositionsDTO } from "@dtos/PositionsDTO";

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

type Coordinate = {
  latitude: number,
  longitude: number
};

type Report = {
  latitude: number,
  longitude: number
};

export function VehicleEvents() {
  const { width, height } = Dimensions.get('window')
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<VehicleDetailsEventsDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  useEffect(() => {
    fetchDailyTrips(vehicle);
  }, []);

  const onSelectedDayChanged = (selectedDate: moment.Moment) => {
    fetchDailyTrips(vehicle, selectedDate);
  };

  function fetchDailyTrips(vehicle: VehiclesDTO, selectedDayMoment?: moment.Moment | undefined) {
    setLoading(true);
    const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
    const toMoment = fromMoment.clone().add(1, 'day');
    const url = `${constants.API_BASE_URL}/api/reports/events?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`;
    axios.get(url)
      .then((response) => {
        setLoading(false);
        setTrips(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  return (
    <NativeBaseProvider theme={extendTheme(v3CompatibleTheme)}>
      <Header name={vehicle.name} onPress={() => handleVehicleDetails({ vehicle, position })} />
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
          selectedDate={selectedDate}
        />
      </View>
      <VStack>
        <View mt='1' mb={height / 5}>
          {loading ? <Loading /> : (
            <FlatList
              data={trips}
              key={'trips'}
              keyExtractor={(trips, index) => String(index)}
              style={{ marginBottom: 32 }}
              renderItem={({ item }) => (
                <Box
                  bg='white'
                  borderRadius='10'
                  borderBottomWidth="10"
                  borderColor="#a59999"
                  shadow='2'
                  pl="4"
                  pr="5"
                  py="2"

                  p='15'
                  mb='2'
                >
                  <HStack space={3} justifyContent="space-between">
                    <VStack>
                      <Text
                        color="coolGray.800"
                      >
                        {item.type}
                      </Text>
                      <Text
                        color="coolGray.800"
                      >
                        {constants.getFormattedDateFromIsoString(item.eventTime)}
                      </Text>
                    </VStack>
                    <Spacer />
                  </HStack>
                </Box>
              )}
            />
          )}
        </View>
      </VStack>
    </NativeBaseProvider>
  );
}

