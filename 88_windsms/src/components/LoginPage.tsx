import React, { useState, useEffect } from 'react';
import { apiPath } from './apiPath';

import axios from 'axios';
import { AlertBox }   from './AlertBox';

interface LoginPageTypes {
    setOrigSettings: Function;
    setItems: Function;
    loginStatus: Function;
}

interface loginParamsTypes {
    username: string;
    password: string;
}

const LoginPage = ( { setOrigSettings, setItems, loginStatus }: LoginPageTypes ) => {

    const [ loginParams, setLoginParams ]   = useState<loginParamsTypes>( { username: '', password: '' } );

    const [ alert, setAlert ] = useState( { header: '', text: '' } );
    const [ showPassword, setShowPassword ] = useState( false );
    const [ showOnPhone, setShowOnPhone ] = useState( '');

    const getData = () => {

        if (!loginParams.username || !loginParams.password) {
          setAlert( { header: 'Uživatelské jméno / heslo', text: 'vyplňte údaje' } );
          return null
      }

      if (!/[0-9a-zA-Z]{3,}/.test(loginParams.username)) {
        setAlert( { header: 'Uživatelské jméno', text: 'zadejte minimálně 3 znaky' } );
        return null;
    } 
    if (!/[0-9a-zA-Z]{3,}/.test(loginParams.password)) {
        setAlert( { header: 'Heslo', text: 'zadejte minimálně 3 znaky' } );
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
                        resp.days = 1 * resp.days;
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
    
      const getLastSmsData = () => {
        
        fetch('../../davis/data_davis.txt')
            .then( (res)  => res.text() )
                .then( (lastData) => 
                {
                    const limitedText = lastData.split('!');
                    const smsDate =  limitedText[1].split('_');
                setShowOnPhone(limitedText[0] + smsDate[0]);
                })
            .catch( (error) => console.log(error) )
      }

      useEffect( getLastSmsData, [] );

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
            <section className="input-section password">
                    <label>Zobrazení SMS na mobilu / emailu:</label><br/>
                    { showOnPhone }
                </section>
        </article>
    );
};

export default LoginPage;