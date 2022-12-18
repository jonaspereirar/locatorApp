import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  ViewContainer: {
    paddingRight: 10,
    paddingLeft: 0,
    width: Platform.OS === 'android' ? 320 : 350,
  },
  timelineStart: {
    backgroundColor: '#b5b5b5',
    marginLeft: 50,
    marginTop: 20,
    width: 2,
    height: 33,
    position: 'absolute',
  },
  timelineEnd: {
    backgroundColor: '#b5b5b5',
    marginLeft: 50,
    marginTop: 0,
    width: 2,
    height: 32,
  },
  firstLine: {
    position: 'absolute',
    marginTop: 0,
  },
  spanStartAddressIcon: {
    position: 'absolute',
    marginTop: -10,
    marginLeft: 35,
  },
  spanEndAddressIcon: {
    position: 'absolute',
    marginLeft: 40,
  },
  spanInfo: {
    position: 'absolute',
    marginTop: 0,
    marginLeft: 40,
  },
  spanWay: {
    position: 'absolute',
    marginTop: 5,
    marginLeft: 75,
  },
  textWay: {
    fontSize: Platform.OS === 'android' ? 12 : 10,
    marginTop: -5,
    marginLeft: 20,
  },
  textWayDistance: {
    fontSize: Platform.OS === 'android' ? 10 : 9,
    lineHeight: 10,
    marginTop: -25,
    marginLeft: 20,
    color: '#b5b5b5',
  },
  speedOmeter: {
    position: 'absolute',
    marginTop: 5,
    marginLeft: 152,
  },
  textSpeedOmeter: {
    fontSize: Platform.OS === 'android' ? 12 : 10,
    marginTop: -5,
    marginLeft: 20,
  },
  textAverageSpeed: {
    fontSize: Platform.OS === 'android' ? 10 : 9,
    lineHeight: 10,
    marginTop: -25,
    marginLeft: 20,
    color: '#b5b5b5',
  },
  spanTime: {
    position: 'absolute',
    marginTop: 5,
    marginLeft: 230,
  },
  textSpanTime: {
    fontSize: Platform.OS === 'android' ? 12 : 10,
    marginTop: -5,
    marginLeft: 20,
  },
  textMaxSpeed: {
    fontSize: Platform.OS === 'android' ? 10 : 9,
    lineHeight: 10,
    marginTop: -25,
    marginLeft: 20,
    color: '#b5b5b5',
  },
  startAddress: {
    lineHeight: 12,
    fontSize: 12,
    color: '#1e1c1c',
    marginTop: 0,
    marginLeft: 80,
    marginRight: 10,
  },
  starTime: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
  secondLine: {
    marginTop: 50,
  },
  runTime: {
    marginLeft: 10,
    fontSize: 10,
    fontWeight: 'bold',
  },
  thirdLine: {
    position: 'absolute',
    marginTop: 100,
  },
  endTime: {
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
  },
  endAddress: {
    fontSize: 12,
    color: '#1e1c1c',
    marginTop: 0,
    marginLeft: 80,
    marginRight: 1,
    lineHeight: 12,
  },
});
