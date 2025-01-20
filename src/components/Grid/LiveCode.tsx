import React, { useEffect, useState } from 'react';
import styles from './Grid.module.css';
import { useGridSocket } from '../../contexts/GridSocketProvider';
import {getLowestIntegerByDivision} from '../../utils';   

type LiveCodeProps = {
    setLiveCode?: (code:string)=>void
}

const LiveCode = ({setLiveCode}:LiveCodeProps) => {
    const [code, setCode] = useState<string>();
    const { message: data } = useGridSocket();

    useEffect(() => {
        const GRID_SIZE = 10;
        if (data?.status === 'fetching_grid') {
            if (Array.isArray(data?.raw)) {
                const timeSeconds = new Date().getSeconds().toString().padStart(2, '0');
                //console.log("Time Seconds ::: ",timeSeconds);   
                const positions: Array<number | string> = timeSeconds.split("");
                positions[0] = parseInt(positions[0] as string);
                positions[1] = parseInt(positions[1] as string);
                //console.log("Positions :: ",positions);
                const letters = ["", ""];
                letters[0] = data?.raw[positions[0] * GRID_SIZE];
                letters[1] = data?.raw[(positions[0] * GRID_SIZE) + positions[1]];
                //Calculate Code
                const occurences = [0,0];
                occurences[0] = getLowestIntegerByDivision([...data?.raw].filter(letter => letter === letters[0]).length);
                occurences[1] = getLowestIntegerByDivision([...data?.raw].filter(letter => letter === letters[1]).length);

                setCode(`${occurences[0]}${occurences[1]}`);      
                //console.log("Code ::: ",`${letters[0]},${letters[1]}`);  
                setLiveCode && setLiveCode(`${occurences[0]}${occurences[1]}`);  
            }
        }
        //eslint-disable-next-line
    }, [data])     
    return <>
        <div className={styles?.liveCodeWrapper}>
            <div className={styles?.liveCodeContent}>
                <p className={styles?.liveCodeBadge}><span className={styles?.liveCodeSignal}></span> LIVE</p>
                <div className={styles?.liveCode}>
                    <p className={styles?.liveCodeHeader}>
                        YOUR CODE NOW: <span className={styles?.liveCodeResult}>{code}</span>
                    </p>
                </div>
            </div>
        </div>
    </>
}

export default LiveCode;   