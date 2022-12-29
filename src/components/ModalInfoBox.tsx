import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

interface ModalProps {
  device: {
    name: string
  }
  data: {
    address: string
    speed: number
    ignition: boolean
    lastUpdate: string
  }
  width: number;
  height: number;
  show: boolean;
  onClose: () => void;
}

export function ModalInfoBox({
  device, width, height, show, data, onClose
}: ModalProps) {
  return (
    <View style={{
      position: 'absolute',
      width,
      height: height / 4,
      backgroundColor: 'white',
      bottom: 0,
      display: show ? 'flex' : 'none',
    }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#008385',
          padding: 16,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {device.name}
        </Text>
        <TouchableOpacity
          onPress={() => onClose()}
          hitSlop={{
            top: 8, left: 8, bottom: 8, right: 8,
          }}
        >
          <Image
            source={require('../assets/icons/icons8-delete_sign.png')}
            style={{ height: 18, width: 18 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-flag" />
          <Text style={{ marginLeft: 8 }}>{data.address}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-speedometer" />
          <Text style={{ marginLeft: 8 }}>
            {Math.round(data.speed * 1.852)}
            km/h
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-key" />
          <Text style={{ marginLeft: 8 }}>{data.ignition ? 'Ligada' : 'Desligada'}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="md-trending-up" />
          <Text style={{ marginLeft: 8 }}>{moment(data.lastUpdate).fromNow()}</Text>
        </View>
      </View>
    </View>
  )
}