import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface IWebSocket {
  webSocket: WebSocket | null;
}

export function useWebSocket(): IWebSocket | null {
  const [webSocket, setWebsocket] = useState<WebSocket | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {

    if (!webSocket) {
      const ws = new WebSocket('wss://gpsdata.tlbt.pt/api/socket');
      //console.log('conectado')
      setWebsocket(ws);

      return () => {
        ws.close();
        //console.log('desconectado')
      };
    }
  }, []);

  return {

    webSocket: appState ? webSocket : null,

  };
}

