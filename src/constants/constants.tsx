import moment from 'moment';

// API EndPoints
export const API_BASE_URL: string = 'https://gpsdata.tlbt.pt';
export const URL_WSS: string = 'wss://gpsdata.tlbt.pt/api/socket';

// DateTime format
export const DATE_TIME_FORMAT: string = 'HH:mm';

// Milliseconds to Hms
export const getMillisecondsFormattedHms = (milliseconds: number): string => {
  // Get hours from milliseconds
  const hours = milliseconds / (1000 * 60 * 60);
  const absoluteHours = Math.floor(hours);
  const h = absoluteHours > 9 ? absoluteHours : `0${absoluteHours}`;
  // Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : `0${absoluteMinutes}`;
  // Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60;
  const absoluteSeconds = Math.floor(seconds);
  const s = absoluteSeconds > 9 ? absoluteSeconds : `0${absoluteSeconds}`;
  // Returned formatted time
  return `${h}:${m}:${s}`;
};

export const getHourFormattedHms = (milliseconds: number): string => {
  // Get hours from milliseconds
  const hours = milliseconds / (1000 * 60 * 60);
  const absoluteHours = Math.floor(hours);
  const h = absoluteHours > 9 ? absoluteHours : `0${absoluteHours}`;
  // Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : `0${absoluteMinutes}`;
  // Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60;
  const absoluteSeconds = Math.floor(seconds);
  const s = absoluteSeconds > 9 ? absoluteSeconds : `0${absoluteSeconds}`;
  // Returned formatted time
  return `${`${h}h`}`;
};

export const getMinutesFormattedHms = (milliseconds: number): string => {
  // Get hours from milliseconds
  const hours = milliseconds / (1000 * 60 * 60);
  const absoluteHours = Math.floor(hours);
  // Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : `0${absoluteMinutes}`;
  return `${`${m}m`}`;
};

export const getFormattedDateFromIsoString = (isoStringDate: string): string => {
  const momentDate = moment(isoStringDate);
  return momentDate.format(DATE_TIME_FORMAT);
};
