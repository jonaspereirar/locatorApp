import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textRunCard: {
    color: '#fbfbfb',
    alignItems: 'center',
    marginLeft: 2,
  },
  runCard: {
    backgroundColor: '#008385',
    position: 'absolute',
    alignItems: 'center',
    borderRadius: 20,
    height: 80,
    width: Platform.OS === 'android' ? 77 : 100,
    marginLeft: 275,
    marginTop: 105,

  },
  fuelCard: {
    backgroundColor: '#008385',
    alignItems: 'center',
    borderRadius: 20,
    height: 80,
    width: 250,
    marginHorizontal: 15,
    marginRight: 'auto',
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'column',
  },
  card: {
    alignItems: 'center',
    borderRadius: 20,
    height: 153,
    width: 'auto',
    backgroundColor: '#fbfbfb',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
