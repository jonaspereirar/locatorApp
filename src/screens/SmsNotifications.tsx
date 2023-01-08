import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from "moment";
import {
  View,
  NativeBaseProvider,
  extendTheme,
  v3CompatibleTheme,
  VStack,
} from "native-base";
import CalendarStrip from "react-native-calendar-strip";
import { VehiclesDTO } from "@dtos/vehiclesDTO";
import { Header } from "@components/Header";
import { PositionsDTO } from "@dtos/PositionsDTO";
import SMSNotifications from "@components/SMSNotifications";

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

export function SmsNotifications() {
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute();
  const { vehicle, position } = route.params as Params;

  function handleVehicleDetails({ vehicle, position }: Params) {
    navigation.navigate('VehicleDetails', { vehicle, position })
  }

  const onSelectedDayChanged = (selectedDate: moment.Moment) => {

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
        <View style={{ flex: 1 }}>
          <SMSNotifications />
        </View>

      </VStack>
    </NativeBaseProvider>
  );
}

