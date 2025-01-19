import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
type MessageHandler = (data: any) => void;

type GridSocketContextType = {
  socket: WebSocket | null;
  sendMessage: (data: any) => void;
  registerHandler: (handler: MessageHandler) => void;
  unregisterHandler: () => void;
  isConnected: boolean;
  connect: ()=>void;
  message:any;
};

const GridSocketContext = createContext<GridSocketContextType | undefined>(undefined);

export const GridSocketProvider: React.FC<{ children:any }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [handler, setHandler] = useState<MessageHandler | null>(null);
  const [message,setMessage] = useState<any>({});
  
  const connect = ()=>{
    if(!isConnected){
        try{
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");
            const server = new WebSocket(`${config.baseGridSocketUrl}?token=${token}`);
            server.onopen = () => {
                setIsConnected(true);
                server.send(JSON.stringify({code:"connect"}));    
              };
          
              server.onmessage = ($event:MessageEvent) => {
                try {
                  const data = JSON.parse($event.data);
                  setMessage(data); 
                  if (handler) {
                    handler(data);
                  } else {
                    //console.warn("No handler registered to process the message:", data);
                  }
                } catch (error) {
                  console.error("Failed to parse WebSocket message:", error);
                }
              };
          
              server.onclose = ($event:CloseEvent) => {
                console.info("GRID_SOCKET_DISCONNECTED");
                if($event.code===4001 || $event.code===4002 || $event.code===4005){
                  setMessage({status:"close_error",message:$event.reason,code:$event.code});
                }
                setIsConnected(false);  
              };
          
              server.onerror = (error) => {
                console.error("GRID_SOCKET_ERROR\n", error);
              };
          
              setSocket(server);
        } catch (error) {
            console.error("GRID_SOCKET_INIT_ERROR", error);
        }   
    }
  }
  useEffect(() => {
    //Close connection onf unmount
    return () => {
      socket && socket.close();
    };
    //eslint-disable-next-line
  }, []);

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
    <GridSocketContext.Provider value={{ socket,sendMessage, registerHandler, unregisterHandler,connect,isConnected,message }}>
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
