import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

import { apiPath }  from './apiPath';
import { AlertBox } from './AlertBox';
import { Delay }    from './AlertBox';

type myItems = {
    date: string;
    days: number;
    email: string;
    id: number;
    name: string;
    password: string;
    sms: number;
    username: string;
    todayRainLimit: number;
    todayRainSent: number;
  };

interface LoginPageTypes {
    setOrigSettings: Dispatch<SetStateAction<myItems>>;
    setItems       : Dispatch<SetStateAction<myItems>>;
    loginStatus    : (status : boolean) => void;
}
const LoginPage = ( { setOrigSettings, setItems, loginStatus }: LoginPageTypes ) => {

    // login definition
    interface loginParamsTypes {
        username: string;
        password: string;
    }
    const [ loginParams, setLoginParams ]   = useState<loginParamsTypes>( { username: '', password: '' } );
    
    // alert definition
    interface alertTypes {
        header : string;
        text   : string;
        color? : string;
    }
    const [ alert, setAlert ] = useState<alertTypes>( { header: '', text: '' } );
    // if 'alert' changed - wait 5s and clear 'alert'
    Delay( alert, setAlert );

    const [ showPassword, setShowPassword ] = useState( false );
    const [ showOnPhone , setShowOnPhone  ] = useState( '');
    const [ showRainOnPhone , setShowRainOnPhone  ] = useState( '');

    const getData = () => {

        if (!loginParams.username || !loginParams.password) {
            setAlert( { header: 'Uživatelské jméno / heslo', text: 'vyplňte údaje' } );
            return null
        }

        if (!/^[a-zA-Z0-9\-_]{3,10}$/.test(loginParams.username)) {
            setAlert( { header: 'Špatné jméno', text: 'zadejte 3 až 10 znaků (0-9 a..z A..Z - _ )' } );
            return null;
        } 

        if (!/^[a-zA-Z0-9.\-_]{3,10}$/.test(loginParams.password)) {
            setAlert( { header: 'Špatné heslo!', text: 'zadejte 3 až 10 znaků (0-9 a..z A..Z - . _ )' } );
            return null;
        } 

    
          axios
              .post(
                  `${apiPath()}pdo_read_sms.php`,
                  //`https://www.frymburk.com/rekreace/api/pdo_read_sms.php`,
                  loginParams,
                  { timeout: 5000 }
              )
              .then(res => {
    
                    // allForum = JSON.parse(res.data); --> for native xhr.onload 
                    const resp = res.data[0] || res.data;
    
                    // if error in response
                    if (typeof resp.sms_read === 'string') {
                        resp.sms_read === 'error' && setAlert( { header: 'Přihlášení se nepovedlo !', text: 'zkuste později...' } );
                        return null
                    }
      
                    // if no user data
                    if (typeof resp.id === 'string') {
                        // convert string from mySQL to number
                        resp.days = +resp.days;
                        resp.id   = +resp.id;
                        resp.sms  = +resp.sms;
                        resp.todayRainLimit = +resp.todayRainLimit;
                        resp.todayRainSent  = +resp.todayRainSent;
                        setOrigSettings( resp );
                        setItems( resp ); 
                        loginStatus(true);
                        return null
                    }
                    
                    console.log(res);
                    setAlert( { header: 'Neznámá chyba !', text: 'zkuste později...' } );
      
              })
              .catch(err => {
                  if (err.response) {
                    // client received an error response (5xx, 4xx)
                    setAlert( { header: 'Neznámá chyba !', text: 'error response (5xx, 4xx)' } );
                    console.log(err.response);
                  } else if (err.request) {
                    // client never received a response, or request never left
                    setAlert( { header: 'Neznámá chyba !', text: 'never received a response, or request never left' } );
                    console.log(err.request);
                  } else {
                    // anything else
                    setAlert( { header: 'Neznámá chyba !', text: 'Error: anything else' } );
                    //console.log(err);
                  }
              });   
      }


      const [ counter, setCounter ]           = useState( 0 );


      const getCounter = () => {
          axios.post(`${apiPath()}pdo_sms_counter.php`)
          .then(res => {
    
                // allForum = JSON.parse(res.data); --> for native xhr.onload 
                const resp = res.data[0] || res.data;
                console.log(resp.count);
    
                setCounter( resp.count );
          })
          .catch(err => {
              if (err.response) {
                // client received an error response (5xx, 4xx)
                console.log(err.response);
              } else if (err.request) {
                // client never received a response, or request never left
                console.log(err.request);
              } else {
                // anything else
                //console.log(err);
              }
          });   
      }
    
      useEffect( getCounter, [] );
    
      // get wind data shown in mobile
      const getLastSmsData = () => {
        
        fetch('../../davis/data_davis.txt')
            .then( (res)  => res.text() )
                .then( (lastData) => 
                {
                    const limitedText = lastData
                        // Select from string 'Vitr' included
                        .split(/(?=Vitr)/)[1]
                        // Till character '_'
                        .split('_')[0];
                    setShowOnPhone(limitedText);
                })
            .catch( (error) => console.log(error) )
      }

      useEffect( getLastSmsData, [] );

      // get rain data shown in mobile
      const getLastRainData = () => {
        
        fetch('../../davis/data_davis_json.txt')
            .then( (res)  => res.text() )
                .then( (lastData) => 
                {
                    const { raincelk, Rain_rate_max } = JSON.parse( lastData )

                    setShowRainOnPhone( `todayRain : ${raincelk}mm, todayRainMaxRate : ${Rain_rate_max}mm/h, LIPNO.net` );
                })
            .catch( (error) => console.log(error) )
      }

      useEffect( getLastRainData, [] );


    return (
        <article className="container-login">
            <header className="header-label">Přihlášení uživatele</header>
            <form onSubmit={(event) => {
                event.preventDefault();
                getData();
                //setLoginParams({ username: '', password: '' });
            }} name="formular" encType="multipart/form-data">
                
                <section className="input-section">
                    <label>Zadejte uživatelské jméno</label>
                    <input
                        type="text"
                        placeholder="Username or Email..."
                        onChange={ (e) => setLoginParams( current => ({ ...current,  username: e.target.value }) )     }
                        value={loginParams.username}
                    />
                </section>
                <section className="input-section password">
                    <label>Zadejte heslo</label><br/>
                    <input
                        type={ showPassword ? "text" : "password" }
                        placeholder="Password..."
                        onChange={ (e) => setLoginParams( current => ({ ...current,  password: e.target.value }) )     }
                        value={loginParams.password}
                        autoComplete="on"
                    />
                    <span onMouseOver={ () => setShowPassword( true ) }
                          onMouseOut ={ () => setShowPassword( false ) } >
                        Show
                    </span>
                </section>
                { alert.header ? <AlertBox alert={ alert } /> : null }
                <section className="submit-section">
                    <input type="submit" name="odesli" value="Přihlásit" />
                </section>
            </form>
            <header className="header-counter">Počet uživatelů: {counter}</header>
            <section className="input-section ">
                <label>Zobrazení větru na mobilu / emailu:</label>
                <span className="smsText">
                    <br/>From: 4f@lipno.net
                    <br/>Text: { showOnPhone }
                </span>
            </section>
            <section className="input-section ">
                <label>Zobrazení deště na mobilu / emailu:</label>
                <span className="smsText">
                    <br/>From: 4f@lipno.net
                    <br/>Text: { showRainOnPhone }
                </span>
            </section>
        </article>
    );
};

export default LoginPage;