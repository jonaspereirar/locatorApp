import { View, Text } from "native-base";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons
} from "@expo/vector-icons";
import * as constants from "../../constants/constants";
import styles from "./styles";

interface TimelineItemProps {
  data: {
    startAddress: string,
    startTime: string,
    distance: number,
    averageSpeed: number,
    maxSpeed: number,
    endTime: string,
    endAddress: string
  };
  extraData: any;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ data, extraData }) => {
  return (
    <View style={styles.ViewContainer}>
      <View style={styles.timelineStart} />
      <View style={styles.firstLine}>
        <Text style={styles.startAddress}>
          {data.startAddress}
        </Text>
        <Text style={styles.starTime}>
          {constants.getFormattedDateFromIsoString(data.startTime)}
        </Text>
      </View>
      <View style={styles.spanStartAddressIcon}>
        <MaterialIcons name="play-circle-outline" size={34} color="#26cb76" />
      </View>
      <View style={styles.secondLine}>
        <Text style={styles.runTime}>
          {extraData}
        </Text>
        <View style={styles.spanInfo}>
          <Ionicons name="navigate-circle-outline" size={24} color="#6fbbfe" />
        </View>
        <View style={styles.spanWay}>
          <MaterialCommunityIcons name="highway" size={16} color="#0597fb" />
          <Text style={styles.textWayDistance}>Distância</Text>
          <Text style={styles.textWay}>
            {(data.distance / 1000).toFixed(1)}
            km
          </Text>
        </View>
        <View style={styles.speedOmeter}>
          <Ionicons name="speedometer" size={16} color="#0597fb" />
          <Text style={styles.textAverageSpeed}>Vel. Média</Text>
          <Text style={styles.textSpeedOmeter}>
            {Math.round(data.averageSpeed * 1.852)}
            km/h
          </Text>
        </View>
        <View style={styles.spanTime}>
          <Ionicons name="time" size={16} color="#0597fb" />
          <Text style={styles.textMaxSpeed}>Vel. Máxima</Text>
          <Text style={styles.textSpanTime}>
            {Math.round(data.maxSpeed * 1.852)}
            km/h
          </Text>
        </View>
      </View>
      <View style={styles.timelineEnd} />
      <View style={styles.thirdLine}>
        <Text style={styles.endTime}>
          {constants.getFormattedDateFromIsoString(data.endTime)}
        </Text>
        <Text style={styles.endAddress}>
          {data.endAddress}
        </Text>
        <View style={styles.spanEndAddressIcon}>
          <MaterialCommunityIcons
            name="alpha-p-circle-outline"
            size={24}
            color="#fd0303"
          />
        </View>
      </View>
    </View>
  );
};

export default TimelineItem;
