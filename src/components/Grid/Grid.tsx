import React, { Fragment, useEffect, useState } from 'react';
import styles from './Grid.module.css';
import { useForm } from 'react-hook-form';
import LiveCode from './LiveCode';
import { useGridSocket } from '../../contexts/GridSocketProvider';
import {useNavigate} from 'react-router';

type MessageHandler = (data: any) => void;

const Grid = () => {
    const [gridViewHTML, setGridViewHTML] = useState<string>('<div></div>');
    const [isPending,setIsPending] = useState<boolean>(false);//TODO: Handle multiple insertions
    const [isFetching,setIsFetching] = useState<boolean>(false);
    const {isConnected,message:data,connect:connectGridSocket,socket} = useGridSocket();
    const [isBiasDisabled,setIsBiasDisabled] = useState<boolean>(false);   
    const navigate = useNavigate();

    const {
        register,
        watch,
        formState: {errors},
        resetField
    } = useForm<{ character: string }>({mode:"onChange"});  

    const getGridManually = () => {
        const bias = watch();   
        return fetch('http://localhost:3200/api/users/grid', {
            method: "POST",
            body: JSON.stringify({ bias: bias.character ?? "" }),
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
            connectGridSocket();   
        } catch (error) {
            console.error("GRID_SOCKET_INIT_ERROR", error);
        }
    }
     
    const stopGrid = ()=>{
        try{
            socket?.send(JSON.stringify({code:"disconnect"}));
            socket?.close();
        }catch(error:any){
            console.error("Failed to stop grid <Socket> connection\n",error);
        }
    }

    const triggerGridWeight = ()=>{
        const bias = watch();
        if(isConnected && /^[a-zA-z]{1,1}$/.test(bias.character)){
            socket?.send(JSON.stringify({
                code:"bias",
                data:bias.character
            }));
            setIsBiasDisabled(true);
            setTimeout(()=>{
                setIsBiasDisabled(false);
                resetField("character");   
            },4000);    
        }
    }


    useEffect(() => {
        //Configure Handler for Grid Socket Provider
        const _gridSocketHandler = (data:any)=>{
            if (data?.status === 'updating_grid') {
                setIsFetching(true);
            } else if (data?.status === 'fetching_grid') {
                setIsFetching(false);
                setGridViewHTML(data?.html);     
            }
        }
        _gridSocketHandler(data);   
        //Close connection on closure 
   /*      return () => {
            if (socket) {
                socket.send('disconnect');
                socket.close();
            }
        } */
    }, [data]);

    return (
        <section className={styles?.wrapper}>
            <div className="container">
                <div className={styles?.header}>
                    <div className={styles?.inputWrapper}>
                        <label>CHARACTER</label>
                        <input disabled={isBiasDisabled} {...register("character", {
                            pattern: {
                                value: /^[a-zA-Z]$/,
                                message: "Only alphabetic characters are allowed (no numbers or special characters).",
                            },
                            maxLength: {
                                value: 1,
                                message: "Only one character is allowed.",
                            },
                        })} name='character' type='text' placeholder='Character' alt='input-char' onBlur={triggerGridWeight} />
                        <span className={`${styles?.error} ${errors?.character ? styles?.active : ''}`}>{errors?.character?.message}</span>
                        {isPending && <span className={styles?.badgePending}>Pending</span>}
                    </div>
                    <div className={styles?.artworkWrapper}>
                        <span className={styles?.artwork}></span>   
                    </div>
                    <div className={styles?.gridBtnWrapper}>
                        <button className={`${styles?.gridBtn} ${isConnected ? styles?.active : ''}`} onClick={isConnected ? stopGrid : getGrid}>{isConnected ? 'STOP 2D GRID' : 'GENERATE 2D GRID'}</button>  
                    </div>
                </div>
                {isConnected && <Fragment>
                <div className={styles?.notificationsWrapper}>
                <span className={`${styles?.badgeFetching} ${isFetching ? styles?.active : ''}`}>Updating...</span>
                </div>
                <div className={styles?.gridWrapper} >
                    <div className={styles?.gridWrapperContent} dangerouslySetInnerHTML={{ __html: gridViewHTML }}>

                    </div>
                </div>
                <LiveCode />
                <div className={styles?.paymentsBtnWrapper}>
                        <button className={styles?.paymentsBtn} onClick={()=>navigate("/payments")}>GO TO PAYMENTS</button>  
                </div>
                </Fragment>}  
            </div>
        </section>   
    )
}


export default Grid;