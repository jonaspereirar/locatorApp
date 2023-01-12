import React, { useEffect, useRef, useState } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import {
  View, Text, Card, Box, Button, NativeBaseProvider, extendTheme, v3CompatibleTheme, FlatList, HStack, VStack,
} from 'native-base';
import { ActivityIndicator, Dimensions, ViewToken } from "react-native";
import axios from 'axios';
import moment, { Moment } from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import * as constants from '../constants/constants';
import Timeline from '../components/timeline';
import styles from './styles';
import { VehicleDetailsTripsDTO } from '@dtos/VehicleDetailsTripsDTO';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { PositionsDTO } from '@dtos/PositionsDTO';
import { Header } from '@components/Header';
import { fetchSummaryMapDTO } from '@dtos/fetchSummaryMapDTO';
import { Loading } from '@components/Loading';
import { FlatListAnimated } from '../components/FlatListAnimated';
import { useSharedValue } from 'react-native-reanimated';

interface Route {
  latitude: number;
  longitude: number;
}

interface Params {
  vehicle: VehiclesDTO;
  position: PositionsDTO
  selectedDayMoment?: moment.Moment;
  momentDate?: moment.Moment;
  routeCoordinates?: Route[] | undefined;
}

export interface NavigationProps {
  navigate: (
    screen: string,
    param: Params) => void
}

export function VehicleDetailsTrips() {
  const { width, height } = Dimensions.get('window')
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [trips, setTrips] = useState<VehicleDetailsTripsDTO[]>([]);
  const [summary, setSummary] = useState<fetchSummaryMapDTO[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<Route[]>([]);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messageToDisplay, setMessageToDisplay] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [momentDate, setMomentDate] = useState(moment());
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const navigation = useNavigation<NavigationProps>();
  let totalDistance = 0;
  let totalFuel = 0;
  trips.forEach((data) => {
    totalDistance += data.distance;
    totalFuel += data.spentFuel;
  });

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  function handleRoutesInMap({ vehicle, routeCoordinates }: Params) {
    navigation.navigate('MapRoute', { vehicle, routeCoordinates, position })
  }

  useEffect(() => {
    setLoading(true);
    fetchSummaryMap(momentDate).then(() => {
      setLoading(false);
    });
    fetchDailyTrips(vehicle, momentDate);
    fetchDailySummaryDaily(vehicle, momentDate);
  }, [momentDate]);


  const onSelectedDayChanged = (momentDate: Moment) => {
    setMomentDate(momentDate);
    fetchDailyTrips(vehicle, momentDate);
    fetchDailySummaryDaily(vehicle, momentDate);
  };

  useEffect(() => {
    setLoading(true);
    fetchSummaryMap(momentDate)
      .then(() => {
        setWaitingResponse(true);
      });
  }, [momentDate]);


  const onSelectedDayChangeInMap = (momentDate: Moment) => {
    onSelectedDayChanged(momentDate);
    handleRoutesInMap({ vehicle, routeCoordinates, position }) // Funcao Navigate
  };

  const getRouteCoordinatesFromReport = (routesReport: Route[]) => {
    const routeCoordinates: Route[] = [];
    let lastLat = 0;
    let lastLng = 0;
    routesReport.forEach((item) => {
      if (item.latitude !== lastLat || item.longitude !== lastLng) {
        lastLat = item.latitude;
        lastLng = item.longitude;
        routeCoordinates.push({ latitude: item.latitude, longitude: item.longitude });
      }
    });
    return routeCoordinates as Route[];
  };

  async function fetchDailyTrips(vehicle: VehiclesDTO, selectedDayMoment?: moment.Moment) {
    try {
      setWaitingResponse(true);
      setMessageToDisplay("A carregar...");
      const selectedDate = selectedDayMoment === undefined ? moment() : selectedDayMoment;
      const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
      const toMoment = fromMoment.clone().add(1, 'day');
      const url = `${constants.API_BASE_URL}/api/reports/trips?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`;
      const response = await axios.get<VehicleDetailsTripsDTO[]>(url);
      setLoading(false);
      setTrips(response.data);
      setSelectedDate(selectedDate);
    } catch (error) {
      setLoading(false);
      setMessageToDisplay("Erro na obenção de dados");

    }
  };

  async function fetchDailySummaryDaily(vehicle: VehiclesDTO, selectedDayMoment?: Moment) {
    try {
      setWaitingResponse(true);
      setMessageToDisplay("A carregar...");
      const selectedDate = selectedDayMoment === undefined ? moment() : selectedDayMoment;
      const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
      const toMoment = fromMoment.clone().add(1, 'day');
      const url = `${constants.API_BASE_URL}/api/reports/summary?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`;
      const response = await axios.get<fetchSummaryMapDTO[]>(url);
      setLoading(false);
      setSummary(response.data);
      setSelectedDate(selectedDate);
      setMessageToDisplay("Sem dados para o dia selecionado");
    } catch (error) {
      setLoading(false);
      setMessageToDisplay("Erro na obenção de dados");
    }
  };

  async function fetchSummaryMap(selectedDayMoment: Moment) {
    try {
      setWaitingResponse(true);
      setMessageToDisplay("A carregar...");
      const fromMoment = selectedDayMoment.startOf('day');
      const toMoment = fromMoment.clone().add(1, 'day');
      const url = `${constants.API_BASE_URL}/api/reports/route?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${vehicle.id}`;
      const response = await axios.get<fetchSummaryMapDTO[]>(url);
      const routeCoordinates = getRouteCoordinatesFromReport(response.data);
      setWaitingResponse(false);
      setRouteCoordinates(routeCoordinates);
      setShowMap(true);
      setMessageToDisplay("Sem dados para o dia selecionado");
    } catch (error) {
      setWaitingResponse(false);
      setMessageToDisplay("Erro na obenção de dados");
    }
  };

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
            {loading ?
              <Text ml='4' color='#99c3c3' fontSize='md' fontWeight='md'>
                Distancia total: {(Math.round(totalDistance / 1000 * 100) / 100).toFixed(2)} </Text> :
              <Text ml='4' color='white' fontSize='md' fontWeight='md'>
                Distancia total: {(Math.round(totalDistance / 1000 * 100) / 100).toFixed(2)} </Text>
            }
            <Text mt='1.5' color='white' fontSize='xs' fontWeight='md' >KM</Text>
          </Box>
          <Box flexDirection='row' w='full' bg='#008385'>
            {loading ?
              <Text ml='4' color='#99c3c3' fontSize='md' fontWeight='md'>
                Consumo total:  {(totalFuel.toFixed(1))} </Text> :
              <Text ml='4' color='white' fontSize='md' fontWeight='md'>
                Consumo total:  {(totalFuel.toFixed(1))} </Text>
            }
            <Text mt='1.5' color='white' fontSize='xs' fontWeight='md' >L</Text>
          </Box>
        </VStack>
        <View alignContent='center' alignItems='center' >
          <Box mb='2' ml='6' height='12' borderRadius='20' background='white'>
            <Box mb='1' ml='1' mr='1' height='12' borderRadius='20' background='#008385' >
              <Button
                onPress={() => onSelectedDayChangeInMap(selectedDate)}
                borderRadius='20'
                _pressed={{ bg: '#01484a' }}
                bg='transparent'
                disabled={loading}
              >
                {loading ?
                  <Text ml='4' mr='4' color='#99c3c3' fontSize='md' fontWeight='bold'>
                    Trajeto
                  </Text> :
                  <Text ml='4' mr='4' color='#fbff00' fontSize='md' fontWeight='bold'>
                    Trajeto
                  </Text>
                }
              </Button>
            </Box>
          </Box>
        </View>
      </HStack>
      <View mt='1'>

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
    </NativeBaseProvider>
  );
};