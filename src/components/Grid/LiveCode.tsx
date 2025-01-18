import React from 'react';
import styles from './Grid.module.css';

const LiveCode = () => {
    //TODO: GET SOCKET AND SET CODE
    return <>
        <div className={styles?.liveCodeWrapper}>
            <div className={styles?.liveCodeContent}>
            <p className={styles?.liveCodeBadge}><span className={styles?.liveCodeSignal}></span> LIVE</p>
            <div className={styles?.liveCode}>
                <p className={styles?.liveCodeHeader}>
                    YOUR CODE NOW: <span className={styles?.liveCodeResult}>22</span>
                </p>
            </div>
            </div>
        </div>
    </>
}

export default LiveCode;   