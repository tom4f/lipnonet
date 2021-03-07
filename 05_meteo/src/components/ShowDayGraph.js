import React, { useContext } from 'react';
import { DateContext }       from './DateContext';
// change Date logic
import { ChangeDate }        from './ChangeDate';

export const ShowDayGraph = () => {

    // instead context.date we used descructuring { date }
    const { 
        date : { daily },
        globalDate
    } = useContext(DateContext);

    const year  = daily.getFullYear();
    let month = daily.getMonth() + 1;
    let day = daily.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    const imgUrl = ( type ) => `../davis/archive/${year}/${type}-${year}-${month}-${day}.gif`;
    const imgBig = `./aktuality_big_graph.php?width_graph=1480&year=${year}&id=${year}-${month}-${day}`;

    return (
        <>
            <header id="detail_graphs" className="header">
                Denní graf - vyberte den :&nbsp;
                {/* for useState */}
                {/* <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'day', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp; */}
                <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'day', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
                { day }&nbsp;
                <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'day', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
                &nbsp;- měsíc :&nbsp; 
                <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'month', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
                { month }&nbsp;
                <button onClick={ () => globalDate('daily', ChangeDate('daily', daily, 'month', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
                &nbsp;- rok :&nbsp;
                <button onClick ={ () => globalDate('daily', ChangeDate('daily', daily, 'year', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
                { year }&nbsp;
                <button onClick ={ () => globalDate('daily', ChangeDate('daily', daily, 'year', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
            </header>
            <article className="dayGraph">
                <a href={ imgBig }><img alt="wind" src={ imgUrl('wind') } /></a>
                <a href={ imgBig }><img alt="temp" src={ imgUrl('temp') } /></a>
                <a href={ imgBig }><img alt="bar"  src={ imgUrl('bar')  } /></a>
            </article>
        </>
    )
}