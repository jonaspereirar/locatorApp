export const SET_VEHICLE_DATA = 'SET_VEHICLE_DATA';
export const CLEAR_VEHICLE_DATA = 'CLEAR_VEHICLE_DATA';

export function setVehicleData(vehicle) {
  return {
    type: SET_VEHICLE_DATA,
    vehicle,
  };
}

export function clearVehicleData() {
  return {
    type: CLEAR_VEHICLE_DATA,
  };
}
