export const SET_DEVICES = 'SET_DEVICES';

export function setDevices(devices) {
  return {
    type: SET_DEVICES,
    devices,
  };
}
