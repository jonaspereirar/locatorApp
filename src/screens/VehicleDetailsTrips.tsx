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
import PropTypes, { string } from "prop-types";
import React, { Component, useEffect, useState } from "react";
import CalendarStrip from "react-native-calendar-strip";

import Timeline from "../components/timeline";
import * as constants from "../constants/constants";
import styles from "./styles";
import { api } from "@services/api";

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
  const [trips, setTrips] = useState([]);
  const [summary, setSummary] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [messageToDisplay, setMessageToDisplay] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    fetchDailyTrips(deviceId);
    fetchDailySummaryDaily(deviceId);
  }, [deviceId]);

  const onSelectedDayChanged = (momentDate: moment.Moment) => {
    fetchDailyTrips(deviceId, momentDate);
    fetchDailySummaryDaily(deviceId, momentDate);
  };

  const onSelectedDayChangeInMap = (momentDate: moment.Moment) => {
    onSelectedDayChanged(momentDate);
    fetchSummaryMap(momentDate);
  };

  const onLayout = (routeCoordinates: number[][]) => {
    if (routeCoordinates.length === 0) {
      return;
    }
    setTimeout(() => {
      mapRef.current.fitToCoordinates(
        routeCoordinates,
        {
          edgePadding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          animated: true,
        },
      );
    }, 2000);
  };

  function fetchDailySummaryDaily(selectedDayMoment: moment.Moment | undefined, deviceId: string) {
    const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
    const toMoment = fromMoment.clone().add(1, 'day');
    const url = `${api}/api/reports/route?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${deviceId}`;
    axios.get(url)
      .then((response) => {
        setLoading(false);
        setSummary(response.data);
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

  function getTripsForList() {
    const [trips, setTrips] = useState([]);
    return trips;
  }

  const fetchSummaryMap = (selectedDayMoment: moment.Moment | undefined) => {
    setWaitingResponse(true);
    setMessageToDisplay("A carregar...");
    const fromMoment =
      selectedDayMoment === undefined
        ? moment().startOf("day")
        : selectedDayMoment.startOf("day");
    const toMoment = fromMoment.clone().add(1, "day");
    const url = `${api
      }/api/reports/route?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${props.deviceId}`;
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

  function fetchDailyTrips(deviceId: string, selectedDayMoment: moment.Moment | undefined) {
    const [loading, setLoading] = useState(true);

    const fromMoment = selectedDayMoment === undefined ? moment().startOf('day') : selectedDayMoment.startOf('day');
    const toMoment = fromMoment.clone().add(1, 'day');
    const url = `${api}/api/reports/trips?from=${fromMoment.toISOString()}&to=${toMoment.toISOString()}&deviceId=${deviceId}`;
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
        <View>
          <View>
            <CalendarStrip
              daySelectionAnimation={{
                type: 'border',
                duration: 200,
                borderWidth: 1,
                borderHighlightColor: 'white',
              }}
              style={{ height: 100, paddingTop: 5, paddingBottom: 5 }}
              calendarHeaderStyle={{ color: 'white' }}
              calendarColor="#008385"
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
                info
                full
                background="#008385"
                onPress={() => fetchSummaryMap(onSelectedDayChangeInMap(selectedDate))}
              />
              <Text style={styles.boldText}>
                {messageToDisplay}
              </Text>
            </Text>
          </Card>
          {loading ? (
            <Text> A Carregar ... </Text>
          ) : (
            <FlatList
              style={{ marginBottom: 180 }}
              data={getTripsForList()}
              renderItem={({ item: trip }) => (
                <Box
                  borderBottomWidth="5"
                  borderColor="coolGray.200"
                  pl="4"
                  pr="5"
                  py="2"
                >
                  <Card style={styles.card}>
                    <View style={styles.listItem}>
                      <View style={styles.listItemLine}>
                        <Timeline
                          data={trip}
                          extraData={
                            constants.getHourFormattedHms(trip.duration)
                              < constants.getFormattedDateFromIsoString(3600000)
                              ? constants.getMinutesFormattedHms(trip.duration)
                              : constants.getHourFormattedHms(trip.duration)
                          }
                        />
                      </View>
                    </View>
                  </Card>
                </Box>
              )}
              keyExtractor={(trip) => trip.id}
            />
          )}
        </View>
      </NativeBaseProvider>
    );
  }
};

