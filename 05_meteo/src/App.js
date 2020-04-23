import React, { useState } from 'react';

import './css/main.css';
import './css/meteo.css';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import SelectDate           from './components/SelectDate';
import SelectYear           from './components/SelectYear';
import DateContext          from './components/DateContext';


// get Dates from localStorage
class Store {
    static getDateFromStorage() {
        let myDate;
        if (localStorage.getItem('myDate') === null) {
            myDate =     {
              daily       : new Date(),
              yearSum     : new Date(),
              davisStat   : new Date()
            }
        } else {
            const { daily, yearSum, davisStat } = JSON.parse(localStorage.getItem('myDate'));
            myDate =     {
              daily       : new Date(daily),
              yearSum     : new Date(yearSum),
              davisStat   : new Date(davisStat)
            }
        }
        console.log(myDate);
        return myDate;
    } 
}

const App = () => {

  // store Dates values for different graphs
  const [date, setDate] = useState( Store.getDateFromStorage() );

  // update Dates
  const globalDate = (param, value) => {
    setDate( prevDate => ({ ...prevDate, [param] : value }) );
    // update localStorage - can be disabled
    localStorage.setItem('myDate', JSON.stringify(date));
  }

  // store actual menu
  const [menu, setMenu] = useState('start');
  // render based on menu : elements per clicked button
  const content = () => {
    if ( menu === 'start' )  return <SelectDate />
    if ( menu === 'povodi' ) return <SelectYear />
  }
  // css per clicked button
  const rgbCss = (btnCss) => {
    const btnOn = { 
        background: `#555555`,
        color: 'white'
      };
    const btnOff = {
        background: `white`,
        color: 'black'
      };
    if ( menu === btnCss ) return btnOn
    else return btnOff;
  };  

  return (
    <div className="top_container">
      <Top/>
      <nav>
          <button style={ rgbCss('start')  } onClick={ () => setMenu('start')  } > Meteostanice<br/>Davis Vantage Pro<br/>Frymburk</button>
          <button style={ rgbCss('povodi') } onClick={ () => setMenu('povodi') } > <br/>denní hodnoty<br/>Lipno u hráze</button>
      </nav>
      <div className="graphs">
        <DateContext.Provider value={ { date, globalDate } }  >
            {content()}
        </DateContext.Provider>
      </div>
      <Bottom/>
    </div>
  );
}

export default App;
