import React from 'react';
import ShowMeteoTableLipno from './ShowMeteoTableLipno';

const SelectDate = ( { date, date: { yearSum }, globalDate } ) => {
    
    const nextYear = () => {
        const next = new Date( yearSum.setFullYear( yearSum.getFullYear() + 1 ) );
        const now  = new Date();
        return now > next ? next : now;
    }

    const prevYear = () => {
        const start = new Date(2000,1);
        const prev  = new Date( yearSum.setFullYear( yearSum.getFullYear() - 1 ) );
        return start < prev ?prev : start;
    }

    const year = yearSum.getFullYear();

    return (
        <>
        <header className="header">
            Roční graf - vyberte rok :&nbsp;
            <button onClick ={ () => globalDate('yearSum', prevYear() ) } > &nbsp; {'<'} &nbsp;</button>&nbsp;
            {yearSum.getFullYear()}&nbsp;
            <button onClick ={ () => globalDate('yearSum', nextYear() ) } > &nbsp; {'>'} &nbsp;</button>  
        </header>
            <img alt="voda"     src={ `./graphs/graph_voda_${year}.gif` } /> 
            <img alt="hladina"  src={ `./graphs/graph_hladina_${year}.gif` } /> 
            <img alt="odtok"    src={ `./graphs/graph_odtok_${year}.gif` } /> 
            <img alt="pritok"   src={ `./graphs/graph_pritok_${year}.gif` } /> 
            <img alt="vzduch"   src={ `./graphs/graph_vzduch_${year}.gif` } /> 
        <ShowMeteoTableLipno date={date} globalDate={globalDate} />
        </>
    )
}

export default SelectDate;