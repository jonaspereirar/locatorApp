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
  Text,
  Button,
} from "native-base";
import CalendarStrip from "react-native-calendar-strip";
import Timeline from "../components/timeline";
import * as constants from "../constants/constants";
import styles from "./styles";
import { VehiclesDTO } from "@dtos/vehiclesDTO";
import { VehicleDetailsTripsDTO } from "@dtos/VehicleDetailsTripsDTO";
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

export function VehicleDetailsTrips() {
  const { width, height } = Dimensions.get('window')
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [trips, setTrips] = useState<VehicleDetailsTripsDTO[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messageToDisplay, setMessageToDisplay] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  function navigateToMap({ vehicle, position }: Params) {
    navigation.navigate('Map', { vehicle, position })
  }

  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  useEffect(() => {
    fetchDailyTrips(vehicle);
  }, []);

  const onSelectedDayChanged = (selectedDate: moment.Moment) => {
    fetchDailyTrips(vehicle, selectedDate);
  };

  const onSelectedDayChangeInMap = (momentDate: moment.Moment) => {
    onSelectedDayChanged(momentDate);
    fetchSummaryMap(momentDate);
  };

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
          style={{ height: 90, paddingTop: 1, paddingBottom: 5 }}
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
      <HStack bg='#008385' alignItems='center' alignContent='center' >
        <VStack>
          <Box flexDirection='row' bg='#008385'>
            <Text ml='4' color='white' fontSize='md' fontWeight='md'>
              Distancia total: 190.75 </Text>
            <Text mt='1.5' color='white' fontSize='xs' fontWeight='md' >KM</Text>
          </Box>
          <Box flexDirection='row' w='full' bg='#008385'>
            <Text ml='4' color='white' fontSize='md' fontWeight='md'>
              Consumo total: 89 </Text>
            <Text mt='1.5' color='white' fontSize='xs' fontWeight='md' >L</Text>
          </Box>
        </VStack>
        <View alignContent='center' alignItems='center' >
          <Box mb='2' ml='6' height='12' borderRadius='20' background='white'>
            <Box mb='1' ml='1' mr='1' height='12' borderRadius='20' background='#008385' >
              <Button onPress={() => onSelectedDayChangeInMap(selectedDate)} borderRadius='20' _pressed={{ bg: '#01484a' }} bg='transparent'>
                <Text ml='4' mr='4' color='white' fontSize='md' fontWeight='bold'>
                  Trajeto </Text>
              </Button>
            </Box>
          </Box>
        </View>
      </HStack>

      <VStack>
        <View mt='1' mb={height / 4}>

          {loading ? <Loading /> : (
            <FlatList
              data={trips}
              key={'trips'}
              keyExtractor={(trips, index) => String(index)}
              style={{ marginBottom: '10%' }}
              renderItem={({ item }) => (
                <Box
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
                            < constants.getFormattedDateFromIsoString('3600000')
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
        </View>
      </VStack>
    </NativeBaseProvider>
  );
}

