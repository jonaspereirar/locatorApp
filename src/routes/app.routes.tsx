import React, { useRef, useState } from "react";
import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from "native-base";
import { VehicleList } from "@screens/TabBottom/VehicleList";
import { Map, MapProps } from "@screens/TabBottom/Map";
import { More } from "@screens/TabBottom/More";
import { VehicleDetails } from '@screens/VehicleDetails';
import { VehicleDetailsStops } from '@screens/VehicleDetailsStops';
import { VehicleDetailsTrips } from '@screens/VehicleDetailsTrips';
import { VehicleEvents } from '@screens/VehicleEvents';
import { SmsNotifications } from "@screens/SmsNotifications";
import { VehiclesDTO } from "@dtos/vehiclesDTO";



type AppRoutes = {
  VehicleList: VehiclesDTO | undefined;
  Mapa: MapProps | undefined;
  Mais: undefined;
  VehicleDetails: undefined;
  VehicleDetailsStops: undefined;
  VehicleDetailsTrips: undefined
  VehicleEvents: undefined;
  SmsNotifications: undefined;
}


export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const App = createBottomTabNavigator<AppRoutes>();
// const { webSocket, close } = useWebSocket() as { webSocket: WebSocket | null, close: () => void };
export function AppRoutes() {
  const { sizes, colors } = useTheme();
  const iconSize = sizes[8];

  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.green[800],
          borderTopWidth: 0,
        }

      }}>
      <App.Screen
        name="VehicleList"
        component={VehicleList}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="car-multiple"
              size={iconSize}
              color={color} />
          ),
        }}
      />

      <App.Screen
        name="Mapa"
        component={Map}
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="ios-map"
              size={iconSize}
              color={color} />
          ),
        }}
      />

      <App.Screen
        name="Mais"
        component={More}
        options={{
          tabBarLabel: 'Mais',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="ios-ellipsis-horizontal"
              size={iconSize}
              color={color} />
          ),
        }}
      />

      <App.Screen
        name="VehicleDetails"
        component={VehicleDetails}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <App.Screen
        name="VehicleDetailsStops"
        component={VehicleDetailsStops}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <App.Screen
        name="VehicleDetailsTrips"
        component={VehicleDetailsTrips}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <App.Screen
        name="VehicleEvents"
        component={VehicleEvents}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <App.Screen
        name="SmsNotifications"
        component={SmsNotifications}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />
    </App.Navigator>
  )
}