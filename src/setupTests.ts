import '@testing-library/jest-dom';

// Моки
global.WebSocket = class WebSocket {
  constructor() {}
  close() {}
  send() {}
  onopen() {}
  onclose() {}
  onerror() {}
  onmessage() {}
} as any;

// Мок для ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
