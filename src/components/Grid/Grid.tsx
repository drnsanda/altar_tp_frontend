import React, { useEffect, useState } from 'react';
import styles from './Grid.module.css';
import { useForm } from 'react-hook-form';

const Grid = () => {
    const [gridViewHTML, setGridViewHTML] = useState<string>('<div></div>');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isPending,setIsPending] = useState<boolean>(false);
    const [isFetching,setIsFetching] = useState<boolean>(false);
    const {
        register,
        watch,
        formState: {errors},
    } = useForm<{ character: string }>({mode:"onChange"});  

    const getGridManually = () => {
        return fetch('http://localhost:3200/api/users/grid', {
            method: "POST",
            body: JSON.stringify({ bias: "h" }),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then((res) => {
                if (res?.statusCode === 200) {
                    setGridViewHTML(res?.data);
                } else {
                    //Alert failure
                    console.error("Failed to retrieve live grid from server");
                }
            })
            .catch((error) => {
                console.error("GET_GRID_MANUALLY\n", error);
            });
    }

    const getGrid = () => {
        try {
            const server = new WebSocket("ws://localhost:3210");//GRID_SOCKET_PORT

            server.onopen = () => {
                server.send("connect");
                setSocket(server); //Save Reference
            }

            server.onmessage = ($event: MessageEvent) => {
                const data = JSON.parse($event?.data);
                if (data?.status === 'updating') {
                    console.info("Updating Grid");
                } else if (data?.status === 'fetching') {
                    setGridViewHTML(data?.html);
                }
            }

            server.onclose = () => {
                console.info("GRID_SOCKET_DISCONNECTED");
                setSocket(null);   
                server.send("disconnect");
            }

            server.onerror = (error: Event) => {
                console.info("GRID_SOCKET_ERROR\n", error);
            }

        } catch (error) {
            console.error("GRID_SOCKET_INIT_ERROR", error);
        }
    }

    const stopGrid = ()=>{
        try{
            socket?.send("disconnect");
            socket?.close();
            setSocket(null);
        }catch(error:any){
            console.error("Failed to stop grid <Socket> connection\n",error);
        }
    }


    useEffect(() => {
        //Close connection on closure 
        return () => {
            if (socket) {
                socket.close();
            }
        }
    }, []);

    return (
        <section className={styles?.wrapper}>
            <div className="container">
                <div className={styles?.header}>
                    <div className={styles?.inputWrapper}>
                        <label>CHARACTER</label>
                        <input {...register("character", {
                            pattern: {
                                value: /^[a-zA-Z]$/,
                                message: "Only alphabetic characters are allowed (no numbers or special characters).",
                            },
                            maxLength: {
                                value: 1,
                                message: "Only one character is allowed.",
                            },
                        })} name='character' type='text' placeholder='Character' alt='input-char' />
                        <span className={`${styles?.error} ${errors?.character ? styles?.active : ''}`}>{errors?.character?.message}</span>
                        {isPending && <span className={styles?.badgePending}>Pending</span>}
                    </div>
                    <div className={styles?.artworkWrapper}>
                        <span className={styles?.artwork}></span>   
                    </div>
                    <div className={styles?.gridBtnWrapper}>
                        <button className={`${styles?.gridBtn} ${socket ? styles?.active : ''}`} onClick={socket ? stopGrid : getGrid}>{socket ? 'STOP 2D GRID' : 'GENERATE 2D GRID'}</button>  
                    </div>
                </div>
                <div className={styles?.gridWrapper} >
                    <div className={styles?.gridWrapperContent} dangerouslySetInnerHTML={{ __html: gridViewHTML }}>

                    </div>
                </div>
            </div>
        </section>   
    )
}


export default Grid;