import React, {Component} from 'react';

export default class RangeSlider extends Component {

    ranger = (e) => {
        // destructing props to use simple variables
        const { reactChange, day, hour, minute} = this.props;
        const selectedValue = e.target.value;
        if (e.target.name === 'day') {
            console.log(day);
            reactChange({
                day:    selectedValue < 10 ? `0${selectedValue}` : `${selectedValue}`,
            })
        }
        if (e.target.name === 'hour') {
            let hourSelected = 7 + Math.floor(selectedValue / 60);
            hourSelected = hourSelected < 10 ? `0${hourSelected}` : `${hourSelected}`;
            const minuteSelected = selectedValue  - 60 * Math.floor(selectedValue / 60) ;
            console.log(`hour=${hour}, hourSelected=${hourSelected}, minuteSelected=${minuteSelected}`);
            reactChange({
                hour :   hourSelected,
                minute : minuteSelected
            })
        }
    }
    rangerStyle = {
        display: 'block',
        width : '90%',
        maxWidth : '640px',
        margin: '1rem auto',
    }

    render(){
        const { day, hour, minute } = this.props;
        return(
            <span>
                <input
                    style={this.rangerStyle}
                    type="range"
                    name="day"
                    min="1"
                    max="31"
                    onChange={ (e) => this.ranger(e) }
                    value={ day }
                />
                <input
                    style={this.rangerStyle}
                    type="range"
                    name="hour"
                    min="12"
                    max={ 16 * 60 - 3 }
                    step="15"
                    onChange={ (e) => this.ranger(e) }
                    value={ Number(hour) * 60 - 7 * 60 + Number(minute) }
                />
            </span>
        )

    }

}