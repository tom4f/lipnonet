import React, { useContext } from 'react';
import ShowMeteoTableLipno from './ShowMeteoTableLipno';
import DateContext from './DateContext';
import ChangeDate from './ChangeDate';

const SelectDate = ( ) => {

    const { date : { yearSum }, globalDate } = useContext(DateContext);

    const year = yearSum.getFullYear();

    return (
        <>
            <header className="header">
                Roční graf - vyberte rok :&nbsp;
                <button onClick ={ () => globalDate('yearSum', ChangeDate('yearSum', yearSum, 'year', -1) ) } > &nbsp; {'<'} &nbsp; </button>&nbsp;
                {yearSum.getFullYear()}&nbsp;
                <button onClick ={ () => globalDate('yearSum', ChangeDate('yearSum', yearSum, 'year', +1) ) } > &nbsp; {'>'} &nbsp; </button>  
            </header>
                <img alt="voda"     src={ `./graphs/graph_voda_${year}.gif` } /> 
                <img alt="hladina"  src={ `./graphs/graph_hladina_${year}.gif` } /> 
                <img alt="odtok"    src={ `./graphs/graph_odtok_${year}.gif` } /> 
                <img alt="pritok"   src={ `./graphs/graph_pritok_${year}.gif` } /> 
                <img alt="vzduch"   src={ `./graphs/graph_vzduch_${year}.gif` } /> 
            <ShowMeteoTableLipno />
        </>
    )
}

export default SelectDate;