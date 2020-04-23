import React, { useState, useEffect, useContext} from 'react';
import DateContext from './DateContext';
import ChangeDate from './ChangeDate';

const SelectDavis = ( ) => {

    const { date : { davisStat }, globalDate } = useContext(DateContext);

    const [davisText, setDavisText]         = useState('');
    const [davisYearText, setDavisYearText] = useState('');

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
            <br/>
            <header className="header">
                Měsíční a roční statistiky - vyberte měsíc :&nbsp;
                <button onClick={ () => globalDate('davisStat', ChangeDate('davisStat', davisStat, 'month', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
                {davisStat.getMonth() + 1}&nbsp;
                <button onClick={ () => globalDate('davisStat', ChangeDate('davisStat', davisStat, 'month', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
                &nbsp;- rok :&nbsp;
                <button onClick ={ () => globalDate('davisStat', ChangeDate('davisStat', davisStat, 'year', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
                {davisStat.getFullYear()}&nbsp;
                <button onClick ={ () => globalDate('davisStat', ChangeDate('davisStat', davisStat, 'year', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
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