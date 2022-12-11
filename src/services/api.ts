import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gpsdata.tlbt.pt',
})

export { api }