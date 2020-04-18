import React, { Component } from 'react';

export default class SelectTime extends Component {
    
    selectClicked = event => {
        // destructing props to use simple variables
        const { reactChange, day, hour, minute } = this.props;
        let hourText    = hour;
        let minuteText  = minute;
        let dayText     = day;
        const selectTextClicked = event.target.name;
        if (selectTextClicked === 'selectDay')      dayText     = event.target.value;
        if (selectTextClicked === 'selectHour')     hourText    = event.target.value;
        if (selectTextClicked === 'selectMinute')   minuteText  = event.target.value;
        reactChange({
            day:    dayText,
            hour:   hourText,
            minute: minuteText
        
        });
    }

    render() {
        // render hour select
        const { day, hour, minute } = this.props;
        let optionDay = [];
        
        let dayText;
        // <option> for days from (Now+1) till 31
        for (let dayFor = 1 + (new Date().getDate()); dayFor<=31; dayFor+=1){
            dayText = dayFor < 10 ? `0${dayFor}` : `${dayFor}`;
            optionDay.push(<option key={dayFor} value={dayText} >{dayText}</option>)
        };
        // <option> for days from 1 .. Now
        for (let dayFor = 1; dayFor <= new Date().getDate(); dayFor+=1){
            dayText = dayFor < 10 ? `0${dayFor}` : `${dayFor}`;
            optionDay.push(<option key={dayFor} value={dayText} >{dayText}</option>)
        };
        // render hours select
        let optionHour = [];
        let hourText;
        for (let hour = 7  ; hour<23; hour++){
            hourText = hour < 10 ? `0${hour}` : `${hour}`;
            optionHour.push(<option key={hour} value={ hourText } >{hourText}  </option>)
        };
        // render minutes select
        let optionMinute = [];
        let minuteText;
        for (let minute = 12; minute<58; minute+=15){
            minuteText = minute < 10 ? `0${minute}` : `${minute}`;
            optionMinute.push(<option key={minute} value={minuteText}>{minuteText}</option>)
        };

        return (
            <span>
                Den:
                <select name="selectDay"   onChange={(e) => this.selectClicked(e)} value={day} >
                    {optionDay}
                </select>                
                / Čas: 
                <select name="selectHour"   onChange={(e) => this.selectClicked(e)} value={hour} >
                    {optionHour}
                </select>
                <b>:</b>
                <select name="selectMinute" onChange={(e) => this.selectClicked(e)} value={minute}>
                    {optionMinute}
                </select>
            </span>
        );
    }
}
// ReactJS call parent method
// https://stackoverflow.com/questions/26176519/reactjs-call-parent-method