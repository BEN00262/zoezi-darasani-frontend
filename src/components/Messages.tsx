// @ts-ignore
import M from 'materialize-css'
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext";
import { ZoeziQueryClient } from '../utils/queryclient';

const success_toastify = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    className: "sub-modal-texts",
    autoClose: 1000
})

const failure_toastify = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    className: "sub-modal-texts",
    autoClose: 2000
})

const socket = io(); //io("http://localhost:3500/");

interface IMessage {
    type: "payments" // add other message types later :)
    message: {
        status: boolean
        message: string
    }
}

const MessagesComp = () => {
    const { communicationId } = useGlobalZoeziTrackedState();
    /*
        {
            type: "payments", 
            message: {
                status: true | false ( boolean ),
                message: string
            }
        }
    */

    // listen for messages and then do the stuff ( inform :) )
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit('online',{ current_school_id: communicationId })
        });
        
        socket.on('notification', function (data){
            const message = JSON.parse(data) as IMessage;

            switch (message.type) {
                case 'payments':
                    {
                        switch (message.message.status) {
                            case true:
                                (success_toastify)(message.message.message)
                            case false:
                                (failure_toastify)(message.message.message);
                        }

                        // refetch the subscriptions view thing :)
                        ZoeziQueryClient.invalidateQueries('in_app_subscriptions_view');
                        return;
                    }
            }
        });

          // mount the drop down on launch
        M.Dropdown.init(document.querySelectorAll('#desktopprofile2'), {
            hover: true,
            coverTrigger: false
        });

        return () => {
            // notification turned off
            socket.off('notification')
            M.Dropdown.getInstance(document.getElementById("desktopprofile2")).destroy()
        }
    }, [])


    return <ToastContainer/>
}

export default MessagesComp