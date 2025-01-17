import React, {useEffect,useState} from 'react';
import styles from './Grid.module.css';
const Grid = ()=>{
const [gridViewHTML,setGridViewHTML] = useState<string>('<div></div>');
const [socket,setSocket] = useState<WebSocket>();

const getGridManually=()=>{
    return fetch('http://localhost:3200/api/users/grid',{
        method:"POST",
        body:JSON.stringify({bias:"h"}),
        headers:{
            "Content-Type":"application/json"
        },
    })
    .then(res=>res.json())
    .then((res)=>{
        if(res?.statusCode===200){
            setGridViewHTML(res?.data);
        }else{
            //Alert failure
            console.error("Failed to retrieve live grid from server");
        }
    })
    .catch((error)=>{
        console.error("GET_GRID_MANUALLY\n",error);
    });
}   

const getGrid = ()=>{
try{
const server = new WebSocket("ws://localhost:3210");//GRID_SOCKET_PORT

server.onopen = ()=>{
    console.log("GRID_SOCKET_CONNECTED");
    server.send("Testing connection client");
}

server.onmessage = ($event:MessageEvent)=>{
    console.log("Current Message ::: ",$event.data);
}

server.onclose = ()=>{
    console.info("GRID_SOCKET_DISCONNECTED");
}

server.onerror = (error:Event)=>{
    console.info("GRID_SOCKET_ERROR\n",error);
}

}catch(error){
    console.error("GRID_SOCKET_INIT_ERROR",error);
}
}


useEffect(()=>{
//TODO Get any socket information to be closed or not
return ()=>{
    if(socket){
        //TODO: Close Connection with Socket
    }
}
},[])

return (
    <section className={styles?.wrapper}>
        <div className={styles?.container}>
            <div className={styles?.header}>
                <button onClick={getGridManually}>Get Grid</button>
            </div>
            <div className={styles?.gridWrapper} dangerouslySetInnerHTML={{__html:gridViewHTML}}></div>
        </div>
    </section>
)
}


export default Grid;