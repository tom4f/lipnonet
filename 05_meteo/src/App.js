import React, { useState } from 'react';
// import { 
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   Link,
//   //useRouteMatch, // https://reacttraining.com/react-router/web/guides/quick-start
//   //useParam
// } from "react-router-dom";

import './css/main.css';
import './css/meteo.css';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import SelectDate           from './components/SelectDate';
import SelectYear           from './components/SelectYear';
import SelectDavis          from './components/SelectDavis';

const App = () => {

  // store Date values for different graphs
  const [date, setDate] = useState(
    {
      // day graph
      daily       : new Date(),
      // year graph
      yearSum     : new Date(),
      // month graph
      davisStat   : new Date()
    }
  );
  // update of  Dates
  const globalDate = (param, value) => {
    setDate( prevDate => ({ ...prevDate, [param] : value }) )
  }

  // render elements+css per clicked button
  const [menu, setMenu] = useState('start');
  const content = () => {
    if ( menu === 'start' )  return <SelectDate  date={date} globalDate={globalDate} />
    if ( menu === 'povodi' ) return <SelectYear  date={date} globalDate={globalDate} />
    if ( menu === 'stat' )   return <SelectDavis date={date} globalDate={globalDate} />
  }
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
          <button style={ rgbCss('stat')   } onClick={ () => setMenu('stat')   } > Meteostanice<br/>Davis Vantage Pro<br/>Frymburk</button>
      </nav>

      <div className="graphs">
      { content() }



{/*           <Router>
              <Link to="/">SelectDate</Link> - 
              <Link to="/select-year">SelectYear</Link> - 
              <Link to="/select-statistic">SelectStatistic</Link> -
              <Switch>
                  <Route path="/"   exact component={() =>
                      <SelectDate  date={date} globalDate={globalDate} />
                  } />
                  
                  <Route path="/select-year"      exact component={() => 
                      <SelectYear  date={date} globalDate={globalDate} />
                  } />

                  <Route path="/select-statistic" exact component={() =>
                      <SelectDavis date={date} globalDate={globalDate} />
                  } />
              </Switch>
          </Router> */}



      </div>
      <Bottom/>
    </div>
  );
}

export default App;
