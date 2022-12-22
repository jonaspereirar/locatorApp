import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from "axios";
import moment from "moment";
import {
  View,
  Text,
  Card,
  Box,
  Button,
  NativeBaseProvider,
  extendTheme,
  v3CompatibleTheme,
  FlatList,
  HStack,
  VStack,
} from "native-base";
import CalendarStrip from "react-native-calendar-strip";

import Timeline from "../components/timeline";
import * as constants from "../constants/constants";
import styles from "./styles";
import { VehiclesDTO } from "@dtos/vehiclesDTO";
import { VehicleDetailsTripsDTO } from "@dtos/VehicleDetailsTripsDTO";
import { Loading } from "@components/Loading";

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

type Coordinate = {
  latitude: number,
  longitude: number
};

type Report = {
  latitude: number,
  longitude: number
};

export function VehicleDetailsTrips() {
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [trips, setTrips] = useState<VehicleDetailsTripsDTO[]>([]);
  const [summary, setSummary] = useState<VehicleDetailsTripsDTO[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messageToDisplay, setMessageToDisplay] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute();
  const { vehicle } = route.params as Params;

  const navigateToMap = (vehicle: VehiclesDTO) => {
    navigation.navigate('Map', { vehicle });
  };

  useEffect(() => {
    fetchDailyTrips(vehicle);
    fetchDailySummaryDaily(selectedDate);
  }, []);

  const onSelectedDayChanged = (selectedDate: moment.Moment) => {
    fetchDailyTrips(vehicle, selectedDate);
    fetchDailySummaryDaily(selectedDate);
  };

  const onSelectedDayChangeInMap = (momentDate: moment.Moment) => {
    onSelectedDayChanged(momentDate);
    fetchSummaryMap(momentDate);
  };


  function fetchDailySummaryDaily(selectedDayMoment?: moment.Moment | undefined, vehicle?: VehicleDetailsTripsDTO) {
    const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
    const toMoment = fromMoment.clone().add(1, 'day');
    const url = `${constants.API_BASE_URL}/api/reports/route?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle?.deviceId}`;
    axios.get(url)
      .then((response) => {
        setLoading(false);
        setSummary(response.data);
        console.log(response.data)
        setSelectedDate(selectedDate);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const getRouteCoordinatesFromReport = (routesReport: Report[]): Coordinate[] => {
    const routeCoordinates: Coordinate[] = [];
    let lastLat = 0;
    let lastLng = 0;
    routesReport.forEach((item) => {
      if (item.latitude !== lastLat || item.longitude !== lastLng) {
        lastLat = item.latitude;
        lastLng = item.longitude;
        routeCoordinates.push({ latitude: item.latitude, longitude: item.longitude });
      }
    });
    return routeCoordinates;
  };

  const fetchSummaryMap = (selectedDayMoment: moment.Moment | undefined) => {
    setWaitingResponse(true);
    setMessageToDisplay("A carregar...");
    const fromMoment =
      selectedDayMoment === undefined
        ? moment().startOf("day")
        : selectedDayMoment.startOf("day");
    const toMoment = fromMoment.clone().add(1, "day");
    const url = `${constants.API_BASE_URL
      }/api/reports/route?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.length > 0) {
          setRouteCoordinates(getRouteCoordinatesFromReport(response.data));
          setWaitingResponse(false);
          setShowMap(true);
          setMessageToDisplay(undefined);
        } else {
          setWaitingResponse(false);
          setShowMap(false);
          setMessageToDisplay("Sem dados para o dia selecionado");
        }
      })
      .catch((error) => {
        setWaitingResponse(false);
        setMessageToDisplay("Erro na obenção de dados");
      });
  };

  function fetchDailyTrips(vehicle: VehiclesDTO, selectedDayMoment?: moment.Moment | undefined) {
    const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
    const toMoment = fromMoment.clone().add(1, 'day');
    const url = `${constants.API_BASE_URL}/api/reports/trips?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`;
    axios.get(url)
      .then((response) => {
        setLoading(false);
        setTrips(response.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }


  if (!showMap || waitingResponse) {
    return (
      <NativeBaseProvider theme={extendTheme(v3CompatibleTheme)}>
        <VStack>
          <View mt='20' mb='48'>

            {loading ? <Loading /> : (
              <FlatList
                data={trips}
                key={'trips'}
                keyExtractor={(trips, index) => String(index)}
                style={{ marginBottom: 32 }}
                renderItem={({ item }) => (
                  <Box
                    // borderBottomWidth="5"
                    // borderColor="coolGray.200"
                    pl="4"
                    pr="5"
                    py="2"
                  >
                    <Card style={styles.card}>
                      <View style={styles.listItem}>
                        <Timeline
                          data={item}
                          extraData={
                            constants.getHourFormattedHms(item.duration)
                              < constants.getFormattedDateFromIsoString(3600000)
                              ? constants.getMinutesFormattedHms(item.duration)
                              : constants.getHourFormattedHms(item.duration)
                          }
                        />
                      </View>
                    </Card>
                  </Box>
                )}
              />
            )}
            <HStack flex={1} ml='5'>
              <Card style={styles.fuelCard}>
                {summary.map((data, key) => (
                  <View key={key}>
                    <Text style={styles.textRunCard}>
                      Distância Total:
                      {(data.distance / 1000).toFixed(2)}
                      Km
                    </Text>
                    <Text style={styles.textRunCard}>
                      Consumo Total:
                      {(data.spentFuel).toFixed(1)}
                      L
                    </Text>
                  </View>
                ))}
              </Card>
              <Card style={styles.runCard}>
                <Text style={styles.textRunCard}>
                  Trajeto
                  <Button
                    background="#008385"
                    onPress={() => onSelectedDayChangeInMap(selectedDate)}
                  />
                  <Text style={styles.boldText}>
                    {messageToDisplay}
                  </Text>
                </Text>
              </Card>
            </HStack>
          </View>

          <View mt='-20' mb='-12'>
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
              style={{ height: 100, paddingTop: -8, paddingBottom: -8 }}
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
  }
};

