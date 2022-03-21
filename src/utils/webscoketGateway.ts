import QS from 'query-string';
import socket from 'socket.io-client';
import { AutoDV } from 'auto-dv-type';

export type Query = {
  appId: AutoDV.AppID;
  type: SocketLinkType;
};

export type SocketLinkType = 'edit' | 'online';

export const createIO = (query: Query) => {
  const url = QS.stringifyUrl({ url: process.env.REACT_APP_API_WSS_URL || '', query });
  return socket(url, {
    transports: ['websocket'],
  });
};
