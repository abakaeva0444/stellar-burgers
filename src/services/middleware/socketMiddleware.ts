import { Middleware, MiddlewareAPI } from 'redux';
import { RootState, AppDispatch } from '../store';

// Базовые типы для WebSocket сообщений
export type TWsMessage = {
  success?: boolean;
  orders: any[];
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

export const socketMiddleware = (
  wsActions: TWsActions
): Middleware<{}, RootState> => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const { dispatch } = store;
      const { type, payload } = action as { type: string; payload?: any };
      const { wsInit, onOpen, onClose, onError, onMessage, wsSendMessage } =
        wsActions;

      if (type === wsInit) {
        socket = new WebSocket(payload);
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
};
