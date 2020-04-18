import React, { useState, useEffect} from 'react';

const SelectDavis = ( { date : { davisStat }, globalDate } ) => {


    const [davisText, setDavisText]         = useState('');
    const [davisYearText, setDavisYearText] = useState('');
  
    const start = new Date(2012,8);

    // handling border values

    const prevMonth = () => {
        const prev  = new Date( davisStat.setMonth( davisStat.getMonth() - 1 ) );
        return start < prev ? prev : start;
    }
    const nextMonth = () => {
        const next = new Date( davisStat.setMonth( davisStat.getMonth() + 1 ) );
        const now  = new Date();
        return now > next ? next : now;
    }

    const nextYear = () => {
        const next = new Date( davisStat.setFullYear( davisStat.getFullYear() + 1 ) );
        const now  = new Date();
        return now > next ? next : now;
    }
    const prevYear = () => {
        const prev  = new Date( davisStat.setFullYear( davisStat.getFullYear() - 1 ) );
        return start < prev ? prev : start;
    }

    const year  = davisStat.getFullYear();
    let   month = davisStat.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    
    useEffect(() => {
        fetch(`../davis/archive/NOAAMO-${year}-${month}.TXT`)
        .then( res  => res.text() )
        .then( output => {
            const [,,,,, ...reducedOutput] =  output.split('\r\n');
            setDavisText(reducedOutput.join('\r\n'));
            })
        .catch( error => console.log(error) )
        // conditions to start useEffect:
    }, [ davisStat, month, year ]);

    useEffect(() => {
        fetch(`../davis/archive/NOAAYR-${year}.TXT`)
        .then( res  => res.text() )
        .then( output => {
            const [,,,,, ...reducedOutput] =  output.split('\r\n');
            setDavisYearText(reducedOutput.join('\r\n'));
            })
        .catch( error => console.log(error) )
        // conditions to start useEffect:
    }, [ davisStat, year ]);
    
    return (
        <>
        <header className="header" >&nbsp;</header>
        <br/>
        <header className="header">
            Měsíční a roční statistiky - vyberte měsíc :&nbsp;
            <button onClick={ () => globalDate('davisStat', prevMonth() ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {davisStat.getMonth() + 1}&nbsp;
            <button onClick={ () => globalDate('davisStat', nextMonth() ) } > &nbsp; {'>'} &nbsp; </button>  
            &nbsp;- rok :&nbsp;
            <button onClick ={ () => globalDate('davisStat', prevYear() ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
            {davisStat.getFullYear()}&nbsp;
            <button onClick ={ () => globalDate('davisStat', nextYear() ) } > &nbsp; {'>'} &nbsp; </button>  
        </header>

        <article className="davisMonth">
            <section className="myPre">{davisText}</section>
        </article>

        <header className="header">
                Roční statistiky - rok { year }
            </header>
            <article className="davisMonth">
                <section className="myPre">{davisYearText}</section>
            </article>
        </>
    )
}

export default SelectDavis;