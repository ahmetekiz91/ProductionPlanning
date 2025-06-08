import WebSocket from 'isomorphic-ws';

const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsUrl = `${wsScheme}://localhost:7000/ws/chat/`;

interface UserInput {
  user_input: string;
}

class WebSocketInstance {
  private websocket: WebSocket | null;
  private callbacks: {
    message: ((data: any) => void) | null;
    error: ((error: any) => void) | null;
  };

  constructor() {
    this.websocket = null;
    this.callbacks = {
      message: null,
      error: null,
    };
  }

  connect() {
    this.websocket = new WebSocket(wsUrl);
    this.websocket.onopen = () => {
      console.log('WebSocket connected');
    };
    this.websocket.onmessage = (e) => {
      const data = JSON.parse(e.data.toString());
      if (this.callbacks.message) {
        this.callbacks.message(data);
      }
    };
    this.websocket.onerror = (e) => {
      console.error('WebSocket error:', e);
      if (this.callbacks.error) {
        this.callbacks.error(e);
      }
    };
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  addCallbacks(messageCallback: (data: any) => void, errorCallback: (error: any) => void) {
    this.callbacks.message = messageCallback;
    this.callbacks.error = errorCallback;
  }

  sendMessage(message: UserInput) {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      try {
        // Serialize the UserInput object into a JSON string
        const jsonString = JSON.stringify(message);
        this.websocket.send(jsonString);
      } catch (error) {
        console.error('Error sending message over WebSocket:', error);
      }
    } else {
      console.error('WebSocket is not open');
    }
  }
}

const instance = new WebSocketInstance();
export default instance;
