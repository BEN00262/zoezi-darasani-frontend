export function convertMillisecondsToTimeString(duration: number) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    let s_hours = (hours < 10) ? "0" + hours : hours;
    let s_minutes = (minutes < 10) ? "0" + minutes : minutes;
    let s_seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return `${s_hours} hrs ${s_minutes} mins ${s_seconds} secs`
}