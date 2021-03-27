import  React, { useState , useEffect } from 'react'

export const DateTimeClock = () => {

    var [date,setDate] = useState(new Date());
    
    useEffect(() => {
        var timer = setInterval(()=>setDate(new Date()), 15000 )
        return function cleanup() {
            clearInterval(timer)
        }
    
    });
    var dateString = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short'}).format(date);
    var timeString = new Intl.DateTimeFormat('en-GB', {hour: 'numeric', minute: 'numeric'}).format(date);

    return(
        <div className="dateTimeClock">
            {dateString} | {timeString}
        </div>
    )
}

export default DateTimeClock