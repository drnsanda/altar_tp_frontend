import React, { useState, useEffect } from 'react';
import styles from './Payments.module.css';
import LiveCode from '../Grid/LiveCode';
import { useForm } from 'react-hook-form';
import { useGridSocket } from '../../contexts/GridSocketProvider';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
const Payments = () => {
    const { isConnected, message: data, socket } = useGridSocket();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [paymentsHTML, setPaymentsHTML] = useState<string>("");
    const [liveCode, setLiveCode] = useState<string>();
    const [gridViewHTML, setGridViewHTML] = useState<string>();
    const navigate = useNavigate();


    type FormProps = {
        name: string;
        amount: number;
    }
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormProps>({ mode: "onChange" });

    useEffect(() => {
        //Configure Handler for Grid Socket Provider
        const _gridSocketHandler = (data: any) => {
            if (data?.status === 'updating_payments') {
                setIsFetching(true);
                setTimeout(() => {
                    setIsFetching(false);
                }, 2000)
            }
            else if (data?.status === 'fetching_grid') {
                setIsFetching(false);
                setGridViewHTML(data?.html);
            }
            else if (data?.status === 'fetching_payments') {
                setPaymentsHTML(data?.html);
            } else if (data?.status === 'payment_completed') {
                setTimeout(() => {
                    toast.success('Payment has been received');
                }, 500);

            }
            else if (data?.status === 'payment_failed') {
                setTimeout(() => {
                    toast.error('Failed to process your payment');
                }, 1500);
            }
        }
        _gridSocketHandler(data);
    }, [data]);

    useEffect(() => {
        if (isConnected === false) {
            navigate("/");//Navigates to home page if socket is disconnected
        }
        //eslint-disable-next-line
    }, [isConnected])

    const onSubmit = (formData: FormProps) => {
        if (isConnected) {
            socket?.send(JSON.stringify({ code: "execute_payment", data: { ...formData, code: liveCode, grid: gridViewHTML } }));
            reset();
        }
    }

    return <>
        <div className={styles?.wrapper}>
            <div className="container">
                <LiveCode setLiveCode={setLiveCode} />
                <div className={styles?.header}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles?.formWrapper}>
                        {/*PAYMENT NAME INPUT*/}
                        <div className={styles?.inputWrapper}>
                            <label>PAYMENT</label>
                            <input {...register("name", {
                                required: "Please insert a name for the payment."
                            })} name='name' type='text' placeholder='Payment' alt='payment-name' />
                            <span className={`${styles?.error} ${errors?.name ? styles?.active : ''}`}>{errors?.name?.message}</span>
                        </div>
                        {/*PAYMENT AMOUNT INPUT*/}
                        <div className={styles?.inputWrapper}>
                            <label>AMOUNT</label>
                            <input type="number" {...register("amount", {
                                required: "Please insert payment amount.",
                                min: {
                                    value: 1,
                                    message: "Amount must be at least 1."
                                }
                            })} name='amount' placeholder='Amount' alt='payment-amount' />
                            <span className={`${styles?.error} ${errors?.amount ? styles?.active : ''}`}>{errors?.amount?.message}</span>
                        </div>
                        {/*PAYMENT SUBMIT BTN*/}
                        <div className={styles?.paymentsBtnWrapper}>
                            <button className={styles?.paymentsBtn} >+ ADD</button>
                        </div>
                    </form>
                </div>
                <div className={styles?.notificationsWrapper}>
                    <span className={`${styles?.badgeFetching} ${isFetching ? styles?.active : ''}`}>Payment in progress...</span>
                </div>
                <div className={styles?.paymentListWrapper}>
                    <div className={styles?.gridWrapperContent} dangerouslySetInnerHTML={{ __html: paymentsHTML }}>

                    </div>
                </div>
                <div className={styles?.goBackBtnWrapper}>
                    <button onClick={() => navigate(-1)} className={styles?.goBackBtn} >GO BACK</button>
                </div>
            </div>

        </div>
    </>
}

export default Payments;