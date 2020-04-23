import React, { useContext } from 'react';
import ShowMeteoTable        from './ShowMeteoTable';
import SelectDavis           from './SelectDavis';
import DateContext           from './DateContext';
import ChangeDate            from './ChangeDate';

const SelectDate = () => {

    const { date : { daily }, globalDate } = useContext(DateContext);
    const year  = daily.getFullYear();
    let month = daily.getMonth() + 1;
    let day = daily.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return (
        <>
        <header id="detail_graphs" className="header">
            Denní graf - vyberte den :&nbsp;
            <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'day', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {daily.getDate()}&nbsp;
            <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'day', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
            &nbsp;- měsíc :&nbsp; 
            <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'month', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {daily.getMonth() + 1}&nbsp;
            <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'month', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
            &nbsp;- rok :&nbsp;
            <button onClick ={ () => globalDate('daily', ChangeDate('daily', daily, 'year', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {daily.getFullYear()}&nbsp;
            <button onClick ={ () => globalDate('daily', ChangeDate('daily', daily, 'year', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
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
        <ShowMeteoTable />
        <SelectDavis />
        </>
    )
}

export default SelectDate;