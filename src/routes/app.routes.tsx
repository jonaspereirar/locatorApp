import React from "react";
import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Hidden, useTheme } from "native-base";
import { VehicleList } from "@screens/VehicleList";
import { Map } from "@screens/Map";
import { More } from "@screens/More";
import { VehicleDetails } from '@screens/VehicleDetails';

type AppRoutes = {
  Veículos: undefined;
  Mapa: undefined;
  Mais: undefined;
  VehicleDetails: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[8];
  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.green[500],
      tabBarInactiveTintColor: colors.gray[200],
      tabBarStyle: {
        // height: Platform.OS === 'android' ? 'auto' : 96,
        // paddingBottom: sizes[10],
        // paddingTop: sizes[6],
        backgroundColor: colors.green[800],
        borderTopWidth: 0,

      }
    }}>
      <Screen
        name="Veículos"
        component={VehicleList}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="car-multiple"
              size={iconSize}
              color={color} />
          ),
        }}
      />

      <Screen
        name="Mapa"
        component={Map}
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ios-map"
              size={iconSize}
              color={color} />
          ),
        }}
      />

      <Screen
        name="Mais"
        component={More}
        options={{
          tabBarLabel: 'Mais',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ios-ellipsis-horizontal"
              size={iconSize}
              color={color} />
          ),
        }}
      />

      <Screen
        name="VehicleDetails"
        component={VehicleDetails}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />
    </Navigator>
  )
}