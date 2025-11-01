import { Middleware, MiddlewareAPI } from 'redux';
import { RootState, AppDispatch } from '../store';
import { TOrder } from '@utils-types';

// Базовые типы для WebSocket сообщений
export type TWsMessage = {
  success?: boolean;
  orders: TOrder[];
  total?: number;
  totalToday?: number;
  message?: string;
};

export type TWsActions = {
  wsInit: string;
  wsSendMessage?: string;
  onOpen: (event: Event) => { type: string };
  onClose: (event: CloseEvent) => { type: string };
  onError: (event: Event) => { type: string; payload: Event };
  onMessage: (data: TWsMessage) => { type: string; payload: TWsMessage };
};

export const socketMiddleware =
  (wsActions: TWsActions): Middleware<{}, RootState> =>
  (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const { dispatch } = store;
      const { type, payload } = action as { type: string; payload?: string };
      const { wsInit, onOpen, onClose, onError, onMessage, wsSendMessage } =
        wsActions;

      if (type === wsInit) {
        socket = new WebSocket(payload as string);
      }

      if (socket) {
        socket.onopen = (event: Event) => {
          dispatch(onOpen(event));
        };

        socket.onerror = (event: Event) => {
          dispatch(onError(event));
        };

        socket.onclose = (event: CloseEvent) => {
          dispatch(onClose(event));
        };

        socket.onmessage = (event: MessageEvent) => {
          const { data } = event;
          const parsedData: TWsMessage = JSON.parse(data);
          const { success, ...restParsedData } = parsedData;

          if (success) {
            dispatch(onMessage(restParsedData));
          }
        };

        if (wsSendMessage && type === wsSendMessage) {
          const message = payload;
          socket.send(JSON.stringify(message));
        }
      }

      next(action);
    };
  };
