import React, { createContext, useContext, useEffect, useState } from "react";

type MessageHandler = (data: any) => void;

type GridSocketContextType = {
  sendMessage: (data: any) => void;
  registerHandler: (handler: MessageHandler) => void;
  unregisterHandler: () => void;
  isConnected: boolean;
  setUrl: (url:string)=>void;
};

const GridSocketContext = createContext<GridSocketContextType | undefined>(undefined);

export const GridSocketProvider: React.FC<{ children:any }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [handler, setHandler] = useState<MessageHandler | null>(null);
  const [url,setUrl] = useState<string>();
  

  useEffect(() => {
    if(url){
    try{
        const server = new WebSocket(url);
        server.onopen = () => {
            setIsConnected(true);
            server.send("connect");
          };
      
          server.onmessage = ($event:MessageEvent) => {
            try {
              const data = JSON.parse($event.data);
              if (handler) {
                handler(data);
              } else {
                console.warn("No handler registered to process the message:", data);
              }
            } catch (error) {
              console.error("Failed to parse WebSocket message:", error);
            }
          };
      
          server.onclose = () => {
            console.info("GRID_SOCKET_DISCONNECTED");
            setIsConnected(false);
            server.send("disconnect");
          };
      
          server.onerror = (error) => {
            console.error("GRID_SOCKET_ERROR\n", error);
          };
      
          setSocket(server);
    } catch (error) {
        console.error("GRID_SOCKET_INIT_ERROR", error);
    }   
   
    }
    //Close connection onf unmount
    return () => {
      socket && socket.close();
    };
  }, [url]);

  const sendMessage = (data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  const registerHandler = (newHandler: MessageHandler) => {
    setHandler(() => newHandler);
  };

  const unregisterHandler = () => {
    setHandler(null);
  };

  return (
    <GridSocketContext.Provider value={{ sendMessage, registerHandler, unregisterHandler,setUrl,isConnected }}>
      {children}
    </GridSocketContext.Provider>
  );
};

export const useGridSocket = () => {
  const context = useContext(GridSocketContext);
  if (!context) {
    throw new Error("useGridSocket must be used within a GridSocketProvider");
  }
  return context;
};
