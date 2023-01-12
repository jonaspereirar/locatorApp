import React, { useEffect, useRef, useState } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import {
  View, NativeBaseProvider, extendTheme, v3CompatibleTheme, VStack,
} from 'native-base';
import { Dimensions } from "react-native";
import axios from 'axios';
import moment, { Moment } from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import * as constants from '../constants/constants';
import { VehicleDetailsTripsDTO } from '@dtos/VehicleDetailsTripsDTO';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VehiclesDTO } from '@dtos/vehiclesDTO';
import { PositionsDTO } from '@dtos/PositionsDTO';
import { Header } from '@components/Header';
import { fetchSummaryMapDTO } from '@dtos/fetchSummaryMapDTO';
import { Loading } from '@components/Loading';

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
interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function MapRouteDay() {
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
  const [region, setRegion] = useState<IRegion>({
    latitude: 39.5501,
    longitude: -8.0969,
    latitudeDelta: 7.5,
    longitudeDelta: 7.5,
  });

  const navigation = useNavigation<NavigationProps>();
  const mapRef = useRef<MapView>(null);

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  useEffect(() => {
    setLoading(true);
    fetchSummaryMap(momentDate).then(() => {
      setLoading(false);
    });
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


  const onLayout = (routeCoordinates: Route[]) => {
    if (routeCoordinates.length === 0) {
      return;
    }
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        routeCoordinates,
        {
          edgePadding: {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100,
          },
          animated: true,
        },
      );
    }, 1000);
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

  if (routeCoordinates && routeCoordinates?.length > 0) {
    mapRef.current?.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 200, right: 200, bottom: 200, left: 200 },
      animated: true,
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

      <View style={{ flex: 1 }}>
        <VStack>
          {loading ? <Loading /> : (
            <>
              <MapView
                ref={mapRef}
                style={{ flex: 1, minHeight: height, minWidth: '100%' }}
                onLayout={() => onLayout(routeCoordinates)}
                initialRegion={region}
              >
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={4}
                  strokeColor="#ff0000"
                />
              </MapView>
            </>
          )}
        </VStack>
      </View>
    </NativeBaseProvider>
  );
};