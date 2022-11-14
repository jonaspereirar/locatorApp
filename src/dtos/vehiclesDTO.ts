export interface VehiclesDTO {
      id: string,
      name: string,
      color: string,
      avatar: string,
      address: string,
      speed: number,
      brand: string,
      status: string,
      rpm : number,
      vim: string,
        speedLimit: number,
        category: string,
        contact: number,
        disabled: boolean,
        geofenceIds: null,
        groupId: number,
        lastUpdate: string,
        model: string,
        phone: number,
        positionId: number,
        uniqueId: number,
        accuracy: number,
        altitude: number,
        
        attributes: {
          battery: number,
          voltmeter: string,

          distance: number,
          driverUniqueId: string,
          address: string,
          event: number,
          fuel: number,
          hdop: number,
          hours: number,
          ignition: boolean,
          io114: number,
          io115: number,
          io128: number,
          io129: number,
          io130: number,
          io131: number,
          io135: number,
          io137: number,
          io139: number,
          io15: number,
          io17: number,
          io201: number,
          io207: number,
          io208: number,
          io215: number,
          io216: number,
          io38: number,
          motion: boolean,
          power: number,
          rpm: number,
          sat: number,
          totalDistance: number
        };
        couse: {
        course: number,
        deviceId: number,
        deviceTime: string,
        fixTime: string,
        id: number,
        latitude: number,
        longitude: number,
        network: null,
        outdated: false,
        protocol: string,
        serverTime: string,
        speed: number,
        valid: boolean,
        Marker: void
      };
    }