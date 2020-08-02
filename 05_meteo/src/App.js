import React, { useState }  from 'react';
import { DateProvider }     from './components/DateContext';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import { SelectDay }        from './components/SelectDay';
import { SelectYear }       from './components/SelectYear';
import { SelectOldStation } from './components/SelectOldStation';
import { ModifyPocasi }     from './components/ModifyPocasi';

import './css/main.css';
import './css/meteo.css';

export const App = () => {

  // store actual menu
  const [menu, setMenu] = useState('start');

  // css per clicked button
  const btnOn  = { background: `#555555`, color: 'white' };
  const btnOff = { background: `white`  , color: 'black' };

  const newMeteo = { color: 'white', fontSize: '20px' };

  // render based on menu : elements per clicked button
  return (
    <div className="top_container">
      <Top/>
      <nav>
        <button style={ btnOn }>
          &nbsp;<br/>
          <a style={ newMeteo } href="https://www.frymburk.com/projects/92_canvas_graph/"> Testujeme nové interaktivní grafy - klikněte zde </a>
          <br/>&nbsp;
        </button>
      </nav>
      <nav>
          <button style={ menu === 'start'      ? btnOn : btnOff } onClick={ () => setMenu('start') } >meteostanice<br/>Davis Vantage Pro<br/>Frymburk</button>
          <button style={ menu === 'povodi'     ? btnOn : btnOff } onClick={ () => setMenu('povodi') } ><br/>denní hodnoty<br/>Lipno u hráze</button>
          <button style={ menu === 'oldStation' ? btnOn : btnOff } onClick={ () => setMenu('oldStation') } >původní<br/>meteostanice<br/>Frymburk</button>
      </nav>
      <div className="graphs">
        <DateProvider>
            {
              window.location.search === '?edit=yes'  ? <ModifyPocasi edit="yes" />
              : menu === 'start'                      ? <SelectDay />
              : menu === 'povodi'                     ? <SelectYear />
              : menu === 'oldStation'                 ? <SelectOldStation />
              : null
            }
        </DateProvider>
      </div>
      <Bottom/>
    </div>
  );
}
