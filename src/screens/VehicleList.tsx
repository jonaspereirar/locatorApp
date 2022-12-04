import { useState } from 'react';
import { Icon, View, FlatList, Box } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

import { useAuth } from '@contexts/auth'


export function VehicleList() {
  const { signOut } = useAuth()
  const [vehicle, setVehicle] = useState([])

  async function fetchVehicles() {
    const { userId, setDevicesAction } = this.props;
    this.setState({ loading: true });
    try {
      await axios.get(`https://gpsdata.tlbt.pt/api/devices?userId=${userId}`)
        .then((response) => {
          setDevicesAction(response.data);
          console.log(response.data)
        });
      // eslint-disable-next-line no-empty
    } catch (error) {
    }
  }

  async function fetchPositionsFromVehicles() {
    try {
      await axios.get('https://gpsdata.tlbt.pt/api/positions')
        .then((response) => {
          setVehicle(response.data);
        });
    } catch (error) {
    }
  }

  return (
    <View backgroundColor='red'>
      <FlatList
        data={vehicle}
        renderItem={({ item }) => (
          <Box>
            {fetchPositionsFromVehicles}{fetchVehicles}
          </Box>
        )}
      />


      <TouchableOpacity style={{ marginTop: 50 }} onPress={signOut}>
        <Icon as={Feather} name='arrow-left' color='green.400' size={6} />
      </TouchableOpacity>
    </View>
  )
}
