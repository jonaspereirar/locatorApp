import { VehicleDetailsTripsDTO } from '@dtos/VehicleDetailsTripsDTO';
import { useState, useMemo, useEffect } from 'react';
import Animated, { Easing, EasingNodeFunction } from 'react-native-reanimated';

type ListItemProps = {
  item: {
    trips: VehicleDetailsTripsDTO
  };
};

export function FlatListAnimated({ item }: ListItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(0.6));

  function customEasing(t: EasingNodeFunction): number {
    return t * t * t * (t * (6 * t - 15) + 10);
  }

  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, { toValue: 1, duration: 300, easing: Easing.linear }).start();
      Animated.timing(scale, { toValue: 1, duration: 300, easing: Easing.linear }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 300 }).start();
      Animated.timing(scale, { toValue: 0.6, duration: 300 }).start();
    }
  }, [isVisible]);

  const viewableItems = useMemo(() => {
    return item.trips.filter(
      (item) => item.isViewable
    );
  }, [item]);

  useEffect(() => {
    const viewableItem = viewableItems.find(
      (viewableItem) => viewableItem.id === item.trips.id
    );
    if (viewableItem) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [viewableItems]);

  const rStyle = {
    opacity,
    transform: [
      {
        scale,
      },
    ],
  };

  return (
    <Animated.View
      style={[
        {
          height: 80,
          width: '90%',
          backgroundColor: '#78CAD2',
          alignSelf: 'center',
          borderRadius: 15,
          marginTop: 20,
        },
        rStyle,
      ]}
    />
  );
}


