import React from 'react';
import {
  Icon,
} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import colors from '../constants/colors';

type Props = {
  item: {
    speed: number,
    rpm: number,
    status: string,
    category: string,
  },
};

const TruckIcon = function (props: Props) {
  const { item } = props;
  let iconColor = '';
  if (item.speed > 0) {
    iconColor = colors.vehicleStatus.movingColor;
  } else if (item.speed === 0) {
    iconColor = colors.vehicleStatus.stoppedColor;
  } else if (item.speed === 0 && item.rpm > 0) {
    iconColor = colors.vehicleStatus.idlingColor;
  } else if (item.status === 'offline') {
    iconColor = colors.vehicleStatus.offlineColor;
  }

  return (
    <Icon
      as={FontAwesome}
      name={item.category && item.category.toLowerCase()}
      color={iconColor}
      size="30px"
    />
  );
};

export default TruckIcon;