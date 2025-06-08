import React, { useState, useEffect, useRef } from "react";
import "./Chatbot_.scss";

// Define the interface for bot responses
interface BotResponse {
  response: string;
}

// Define the interface for slot data
interface SlotData {
  slot_name: string;
  inputMessage: string;
}

// Extend the Window interface to include webkitSpeechRecognition
interface ExtendedWindow extends Window {
  webkitSpeechRecognition: any;
}

// WebSocketInstance object to manage WebSocket connections
const WebSocketInstance = {
  socket: null as WebSocket | null,

  // Connect to the WebSocket server
  connect: function () {
    this.socket = new WebSocket("ws://localhost:7000/ws/chat/");
    this.socket.onopen = () => console.log("WebSocket connected");
    this.socket.onclose = (e) => console.log("WebSocket disconnected:", e);
  },

  // Disconnect from the WebSocket server
  disconnect: function () {
    if (this.socket) {
      this.socket.close();
    }
  },

  // Send a message to the WebSocket server
  sendMessage: function (message: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  },

  // Add callbacks for message reception and errors
  addCallbacks: function (
    onResponse: (data: BotResponse) => void,
    onSlot: (slotData: SlotData) => void,
    onError: (error: any) => void
  ) {
    if (this.socket) {
      // Event handler for receiving messages from the server
      this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.response) {
          onResponse(data);
        } else if (data.slot_name && data.inputMessage) {
          onSlot(data);
        }
      };

      // Event handler for handling errors
      this.socket.onerror = onError;
    }
  }
};

// Chatbot component
const Chatbot: React.FC = () => {
  // State to hold the user's message
  const [message, setMessage] = useState<string>("");

  // State to hold the bot's response
  const [response, setResponse] = useState<string>("");

  // State to hold the slot data
  const [slotData, setSlotData] = useState<SlotData | null>(null);

  // State to manage listening status
  const [isListening, setIsListening] = useState(false);

  // State to manage speaking status
  const [isSpeaking, setIsSpeaking] = useState(true);

  // Ref to hold the recognition instance
  const recognitionRef = useRef<any>(null);

  // Effect hook to manage WebSocket connection lifecycle
  useEffect(() => {
    // Connect to WebSocket when the component mounts
    WebSocketInstance.connect();

    // Add callbacks for receiving messages and handling errors
    WebSocketInstance.addCallbacks(
      (data: BotResponse) => {
        setResponse(data.response);
        setSlotData(null); // Clear slot data when a general response is received
        // Speak out the response if speaking is enabled
        if (isSpeaking) {
          speak(data.response);
        }
      },
      (data: SlotData) => {
        setSlotData(data);
        setResponse(""); // Clear general response when slot data is received
        // Speak out the slot input message if speaking is enabled
        if (isSpeaking) {
          speak(data.inputMessage);
        }
      },
      (error: any) => {
        console.error("WebSocket error:", error);
      }
    );

    // Disconnect from WebSocket when the component unmounts
    return () => {
      WebSocketInstance.disconnect();
    };
  }, [isSpeaking]);

  // Handle form submission to send a message
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      // Send the user's message to the WebSocket server
      WebSocketInstance.sendMessage({ user_input: message });

      // Clear the input field
      setMessage("");
    }
  };

  // Toggle listening status
  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in (window as ExtendedWindow))) {
      alert("This browser doesn't support speech recognition. Please try Google Chrome.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Start listening for voice input
  const startListening = () => {
    const recognition = new (window as ExtendedWindow).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Voice recognition started");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece;
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      setMessage(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error detected: " + event.error);
      alert("An error occurred: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Voice recognition ended");
      if (message.trim()) {
        // Send the voice transcript to the WebSocket server
        WebSocketInstance.sendMessage({ user_input: message });

        // Clear the message state
        setMessage("");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };
  // Stop listening for voice input
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };
  // Speak the text using the Web Speech API
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    // Stop listening when speaking
    if (isListening) {
      stopListening();
    }

    utterance.onend = () => {
      // Restart listening after speaking
      if (isListening) {
        startListening();
      }
    };

    synth.speak(utterance);
  };

  // Toggle speaking status
  const toggleSpeaking = () => {
    setIsSpeaking((prevIsSpeaking) => !prevIsSpeaking);
  };

  return (
<div className="container">
  <h1>Chatbot</h1>
  <div className="row">
    <div className="col-md-6 mx-auto">
      <div className="card">
        <div className="card-header text-center">
          <span>Chat Box</span>
        </div>
        <div className="card-body chat-care">
          <ul className="chat">
            {response && (
              <li className="agent clearfix">
                <span className="chat-img left clearfix mx-2">
                  <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="Agent" className="img-circle" />
                </span>
                <div className="chat-body clearfix">
                  <div className="header clearfix">
                    <strong className="primary-font">Bot</strong>
                    <small className="right text-muted">
                      <span className="glyphicon glyphicon-time"></span>Just now
                    </small>
                  </div>
                  <p>{response}</p>
                </div>
              </li>
            )}
            {slotData && (
              <li className="agent clearfix">
                <span className="chat-img left clearfix mx-2">
                  <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="Agent" className="img-circle" />
                </span>
                <div className="chat-body clearfix">
                  <div className="header clearfix">
                    <strong className="primary-font">Bot</strong>
                    <small className="right text-muted">
                      <span className="glyphicon glyphicon-time"></span>Just now
                    </small>
                  </div>
                  <p>{slotData.inputMessage}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
        <div className="card-footer">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-9">
                <textarea
                  className="form-control"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  required
                ></textarea>
              </div>
              <div className="col-sm-3">
                <button type="submit" className="btn btn-primary btn-sm btn-block form-control">
                  Send
                </button>
              </div>
            </div>
          </form>
          <div className="controls mt-3">
            <button onClick={toggleListening} className="btn btn-primary btn-sm me-2">
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <button onClick={toggleSpeaking} className="btn btn-primary btn-sm">
              {isSpeaking ? "Disable Speaker" : "Enable Speaker"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  
  );
};

export default Chatbot;
