export function convertMillisecondsToTimeString(duration: number, ignoreHrs = false) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    const s_hours = (hours < 10) ? "0" + hours : hours;
    const s_minutes = (minutes < 10) ? "0" + minutes : minutes;
    const s_seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return `${ignoreHrs ? "" : `${s_hours} hrs`} ${s_minutes} mins ${s_seconds} secs`
}