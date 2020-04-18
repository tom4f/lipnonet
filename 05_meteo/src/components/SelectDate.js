import React from 'react';
import ShowMeteoTable       from './ShowMeteoTable';

const SelectDate = ( { date, date : { daily }, globalDate } ) => {

    const start = new Date(2012,9,1);
    //const optionYear = [];
    //for (let year = yearStart  ; year<2021; year++)  optionYear.push(<option key={year} value={ year } >{year}  </option>);

    // handling border values
    const prevDay = () => {
        const prev  = new Date( daily.setDate( daily.getDate() - 1 ) );
        return start < prev ? prev : start;
    }
    const nextDay = () => {
        const next = new Date( daily.setDate( daily.getDate() + 1 ) );
        const now  = new Date();
        return now > next ? next : now;
    }

    const prevMonth = () => {
        const prev  = new Date( daily.setMonth( daily.getMonth() - 1 ) );
        return start < prev ? prev : start;
    }
    const nextMonth = () => {
        const next = new Date( daily.setMonth( daily.getMonth() + 1 ) );
        const now  = new Date();
        return now > next ? next : now;
    }

    const nextYear = () => {
        const next = new Date( daily.setFullYear( daily.getFullYear() + 1 ) );
        const now  = new Date();
        return now > next ? next : now;
    }
    const prevYear = () => {
        const prev  = new Date( daily.setFullYear( daily.getFullYear() - 1 ) );
        return start < prev ? prev : start;
    }

    const year  = daily.getFullYear();
    let month   = daily.getMonth() + 1;
    let day     = daily.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return (
        <>
        <header id="detail_graphs" className="header">
            Denní graf - vyberte den :&nbsp;
            <button onClick={ () => globalDate('daily', prevDay() ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {daily.getDate()}&nbsp;
            <button onClick={ () => globalDate('daily', nextDay() ) } > &nbsp; {'>'} &nbsp; </button>  
            &nbsp;- měsíc :&nbsp; 
            <button onClick={ () => globalDate('daily', prevMonth() ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {daily.getMonth() + 1}&nbsp;
            <button onClick={ () => globalDate('daily', nextMonth() ) } > &nbsp; {'>'} &nbsp; </button>  
            &nbsp;- rok :&nbsp;
            <button onClick ={ () => globalDate('daily', prevYear() ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {daily.getFullYear()}&nbsp;
            <button onClick ={ () => globalDate('daily', nextYear() ) } > &nbsp; {'>'} &nbsp; </button>  
        </header>
        <article className="dayGraph">
            <a href={ `https://frymburk.com/davis/archive/wind-${year}-${month}-${day}.gif` }>
                <img alt="wind" src={ `https://frymburk.com/davis/archive/wind-${year}-${month}-${day}.gif` } /> 
            </a>
            <a href={ `https://frymburk.com/davis/archive/temp-${year}-${month}-${day}.gif` }>
                <img alt="temp" src={ `https://frymburk.com/davis/archive/temp-${year}-${month}-${day}.gif` } /> 
            </a>
            <a href={ `https://frymburk.com/davis/archive/bar-${year}-${month}-${day}.gif` }>
                <img alt="bar" src={ `https://frymburk.com/davis/archive/bar-${year}-${month}-${day}.gif` } /> 
            </a>
        </article>
        <ShowMeteoTable date={date} globalDate={globalDate} />
        </>
    )
}

export default SelectDate;