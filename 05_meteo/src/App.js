import React, { useState }  from 'react';
import { DateProvider }     from './components/DateContext';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import { SelectDay }        from './components/SelectDay';
import { SelectYear }       from './components/SelectYear';
import './css/main.css';
import './css/meteo.css';

export const App = () => {

  // store actual menu
  const [menu, setMenu] = useState('start');

  // css per clicked button
  const btnOn  = { background: `#555555`, color: 'white' };
  const btnOff = { background: `white`  , color: 'black' };

  // render based on menu : elements per clicked button
  return (
    <div className="top_container">
      <Top/>
      <nav>
          <button style={ menu === 'start' ? btnOn : btnOff } onClick={ () => setMenu('start') } >Meteostanice<br/>Davis Vantage Pro<br/>Frymburk</button>
          <button style={ menu === 'povodi' ? btnOn : btnOff } onClick={ () => setMenu('povodi') } ><br/>denní hodnoty<br/>Lipno u hráze</button>
      </nav>
      <div className="graphs">
        <DateProvider>
            { menu === 'start' ? <SelectDay /> : <SelectYear />}
        </DateProvider>
      </div>
      <Bottom/>
    </div>
  );
}
