import React, { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../contexts/global";

function convertMillisecondsToTimeString(duration: number) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    let s_hours = (hours < 10) ? "0" + hours : hours;
    let s_minutes = (minutes < 10) ? "0" + minutes : minutes;
    let s_seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return `${s_hours} hrs ${s_minutes} mins ${s_seconds} secs`
}

export interface ITimerComp {
    onTimeUp: () => void
}

const TimerComp: React.FC<ITimerComp> = React.memo(({ onTimeUp }) => {
    const {
        isMarked
    } = useContext(GlobalContext);

    const [timeRemaining, setTimeRemaining] = useState(+`${localStorage.getItem("remainingTime")}`|| 0);
    const [timeIsUp, setTimeIsUp] = useState<boolean>(false)

    const timeRemainingDisplay = useMemo(() => 
        convertMillisecondsToTimeString(timeRemaining < 0 ? 0 : timeRemaining), [timeRemaining])

    useEffect(() => {
        if (timeRemaining <= 0) {
            setTimeIsUp(true);

            // to prevent a double marking bug :)
            if (!isMarked) {
                onTimeUp();
            }

            return;
        }

        localStorage.setItem("remainingTime", `${timeRemaining >= 0 ? timeRemaining : 0}`);
    }, [timeRemaining]);

    useEffect(() => {
        if (!timeIsUp || !isMarked) {
            let interval = setInterval(() => {
                setTimeRemaining(old => old - 1000);
            }, 1000)

            return () => { clearInterval(interval) }
        }
    }, [timeIsUp])



    return (
        <>
            <button className="waves-effect waves-light btn-small z-depth-0 white black-text">
                {timeRemainingDisplay}
            </button>
        </>
    )
})

export default TimerComp