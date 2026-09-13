export function connectTraceWebSocket(runId, onMessageCallback, onErrorCallback) {
  const wsUrl = `ws://localhost:8000/api/runs/${runId}/trace`;
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log(`[WebSocket Connected] Listening to trace feed for run: ${runId}`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    } catch (err) {
      console.error('[WebSocket Error parsing message]', err);
    }
  };

  socket.onerror = (err) => {
    console.error('[WebSocket Error]', err);
    if (onErrorCallback) onErrorCallback(err);
  };

  socket.onclose = () => {
    console.log(`[WebSocket Disconnected] Closed for run: ${runId}`);
  };

  return socket;
}
