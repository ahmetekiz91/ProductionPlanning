import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";
import { BotResponse } from "./BotResponse";
import { useChatbotRedirector } from './ChatbotRedirector';
import ChatbotSelect2 from "../components/ChatbotSelect2";
import { json } from "stream/consumers";


const WebSocketInstance = {
  onResponseCallback: null as any | null,
  onSlotCallback: null as any | null,
  onErrorCallback: null as any | null,
  socket: null as WebSocket | null,
  reconnectInterval: 3000, // Bağlantı koparsa 3 saniye sonra tekrar bağlanmayı dene

  connect: function () {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return; // Zaten açıksa yeni bağlantı kurma
    this.socket = new WebSocket("ws://localhost:7000/ws/chat/");
    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };
    this.socket.onclose = (e) => {
      console.log("WebSocket disconnected:", e);
      this.retryConnection();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.retryConnection();
    };

    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("WebSocket received data:", data);
      if (data.response) {
      } else if (data.formobject) {

      }
    };
  },

  disconnect: function () {
    if (this.socket) {
      this.socket.close();
    }
  },

  sendMessage: function (message: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket not connected");
    }
  },

  retryConnection: function () {
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      this.connect();
      // Bağlantı tekrar kurulduğunda callback'leri tekrar bağlayın
      if (this.socket) {
        this.addCallbacks(this.onResponseCallback, this.onSlotCallback, this.onErrorCallback);
      }
    }, this.reconnectInterval);
  },

  addCallbacks: function (
    onResponse: (data: BotResponse) => void,
    onSlot: (slotData: any) => void,
    onError: (error: any) => void
  ) {

    this.onResponseCallback = onResponse;
    this.onSlotCallback = onSlot;
    this.onErrorCallback = onError;

    if (this.socket) {
      this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.response) {
          onResponse(data);
        } else if (data.formobject) {
          onSlot(data);
        }
      };

      this.socket.onerror = onError;
    }
  },
};

const Chatbot: React.FC = () => {
  const buttonRef = useRef(null);
  const ddlarray = ['CurrencyId', 'IGID', 'UnitID', 'StoreID', 'BrandID', 'CAID']

  const chatboxRef = useRef<HTMLDivElement | null>(null);
  const { convertrelatedpage } = useChatbotRedirector();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputType, setInputType] = useState("input");
  const [message, setMessage] = useState<string>("");
  const [CsId, setCsId] = useState<number | undefined>(undefined);
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  const [state, setState] = useState<string>("");
  useEffect(() => {

    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    WebSocketInstance.connect();
    WebSocketInstance.addCallbacks(
      (data: BotResponse) => 
      {
        setChatHistory((prev) => [...prev, { sender: "Bot", text: data.response }]);
        if (data.slotname)
        {
          var isslotinclude = ddlarray.find(v => v.toString().toLocaleLowerCase() == data.slotname.toString().toLocaleLowerCase())
          if (isslotinclude !== undefined) 
          {
            setInputType("dropdowns");
            setState(isslotinclude)
          }
          else {
            if (data.slotname == "continuewish") {

              setInputType("continuewish");
            }
            else {
              setInputType("input");
            }
          }
        }
      },
      (data: any) => 
      {

       if(data.formobject.intent.includes("create_offer"))
        { 
            if (data.formobject.intent === "create_offerrevisionitems")
            {
            // Retrieve existing data from localStorage
            let existingData = localStorage.getItem("create_offerrevisionitems");
            // Parse it into an array or create a new array if empty
            let dataArray = existingData ? JSON.parse(existingData) : [];   
            // Ensure it's an array (in case something went wrong)
            if (!Array.isArray(dataArray)) 
            {
                dataArray = [];
            }
            // Add new data to the array
            dataArray.push(data);   
            // Save updated array back to localStorage
            localStorage.setItem("create_offerrevisionitems", JSON.stringify(dataArray));
           }
          if(data.formobject.intent=="create_offerrevisions"){
            localStorage.setItem("create_offerrevisions",JSON.stringify(data))
          }
          if(data.formobject.intent=="create_offers"){
            localStorage.setItem("create_offers",JSON.stringify(data))
            navigate('/offers');
          }

        }
        else
        {
          convertrelatedpage(data);
        }
    
       
      },
      (error: any) => {
        console.error("WebSocket error:", error);
      }
    );
    return () => {
      WebSocketInstance.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory((prev) => [...prev, { sender: "User", text: message }]);
      WebSocketInstance.sendMessage({ user_input: message });
      setMessage("");
      setInputType("input");
      setCsId(0)
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  const handleResetChat = () => {
    WebSocketInstance.disconnect();
    WebSocketInstance.connect();
    setChatHistory([]);
    setMessage("");
    setInputType("input");
  };
  return (
    <div className="chatbot-container">
      <button className="chatbox-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span style={{ padding: "5px" }}>{isOpen ? "✕" : "💬"}</span>
      </button>

      {isOpen && (
        <div className="chatbox">
          <h4 className="text-black mt-4 text-center"><b>Chatbot</b> </h4>
          <div ref={chatboxRef} className="chatbox-content">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "Bot" ? "bot-message" : "user-message"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          {
            inputType == "dropdowns" && (
              <form onSubmit={handleSubmit} style={{ bottom: "140px" }} >
                <ChatbotSelect2 slotType={state} value={CsId || undefined} placeholder="Choose"
                  onSelect={(selected: any) => {
                    setCsId(0)
                    setMessage("")
                    if (selected !== null && selected !== undefined) {
                      if (selected.length > 0) {
                        setCsId(selected[0].id)
                        setMessage(selected[0].id.toString())
                      }
                    }
                  }}
                />
                <button type="submit" ref={buttonRef} className="btn thema-button btn-sm"  >Choose <i className="send-icon">➤</i></button>
              </form>
            )
          }
          {
            inputType == "continuewish" && (
              <form onSubmit={handleSubmit} style={{ bottom: "140px" }} >
                <div className="form-check border-primary">
                  <input className="form-check-input border-primary" type="radio" name="exampleRadios" id="exampleRadios1" value={message} onChange={(e) => setMessage("yes")} />
                  <label className="form-check-label">
                    Yes
                  </label>
                </div>
                <div className="form-check border-primary">
                  <input className="form-check-input border-primary" type="radio" name="exampleRadios2" id="exampleRadios2" value={message} onChange={(e) => setMessage("no")} />
                  <label className="form-check-label" >
                    No
                  </label>
                </div>
                <button type="submit" ref={buttonRef} className="btn thema-button btn-sm"  > <i className="send-icon">➤</i></button>
              </form>
            )
          }
          {
            inputType == "input" && (

              <form onSubmit={handleSubmit} className="chatbox-form" >
      {
        /* 
            <button className="chatbox-send" onClick={handleResetChat}>
                  <span style={{ padding: "5px" }}>{isOpen ? "D" : "D"}</span>
                </button>
        
        */
      }      
                <input type="text" className="chatbox-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message..." required
                  onKeyDown={handleKeyDown}
                />
                <button type="submit" ref={buttonRef} className="chatbox-send"> <i className="send-icon">➤</i> </button>
              </form>

            )
          }
        </div>
      )}
    </div>
  );
};

export default Chatbot;