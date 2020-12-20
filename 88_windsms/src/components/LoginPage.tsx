import React, { useState } from 'react';
import { apiPath } from './apiPath'

import axios from 'axios';
import { AlertBox }   from './AlertBox';

interface LoginPageTypes {
    setOrigSettings: Function;
    setItems: Function;
    setIsLogged: Function;
}

interface loginParamsTypes {
    username: string;
    password: string;
}

const LoginPage = ( { setOrigSettings, setItems, setIsLogged }: LoginPageTypes ) => {

    const [ loginParams, setLoginParams ]   = useState<loginParamsTypes>( { username: '', password: '' } );

    const [ alert, setAlert ] = useState( { header: '', text: '' } );

    const getData = () => {

        if (!loginParams.username || !loginParams.password) {
          setAlert( { header: 'No item entered', text: 'Please enter username and password' } );
          return null
      }

      if (!/[0-9a-zA-Z]{3,}/.test(loginParams.username)) {
        setAlert( { header: 'short username', text: 'Please enter at least 3 characters' } );
        return null;
    } 
    if (!/[0-9a-zA-Z]{3,}/.test(loginParams.password)) {
        setAlert( { header: 'short password', text: 'Please enter at least 3 characters' } );
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
                        resp.sms_read === 'error' && setAlert( { header: 'login Error !', text: 'try later...' } );
                        return null
                    }
      
                    // if no user data
                    if (typeof resp.id === 'string') {
                        // setAlert( { header: 'login Success !', text: 'see actual settings...' } );
                        resp.days = 1 * resp.days;
                        setOrigSettings( resp );
                        setItems( resp ); 
                        setIsLogged( true );
                        return null
                    }
                    
                    console.log(res);
                    setAlert( { header: 'unknown Error !', text: 'try later...' } );
      
              })
              .catch(err => {
                  if (err.response) {
                    // client received an error response (5xx, 4xx)
                    setAlert( { header: 'Failed !', text: 'error response (5xx, 4xx)' } );
                    console.log(err.response);
                  } else if (err.request) {
                    // client never received a response, or request never left
                    setAlert( { header: 'Failed !', text: 'never received a response, or request never left' } );
                    console.log(err.request);
                  } else {
                    // anything else
                    setAlert( { header: 'Failed !', text: 'Error: anything else' } );
                    //console.log(err);
                  }
              });   
      }
    

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
                        type="password"
                        placeholder="Password..."
                        onChange={ (e) => setLoginParams( current => ({ ...current,  password: e.target.value }) )     }
                        value={loginParams.password}
                        autoComplete="on"
                    />
                    <span >Show</span>
                </section>
                { alert.header ? <AlertBox alert={ alert } /> : null }
                <section className="submit-section">
                    <input type="submit" name="odesli" value="Přihlásit" />
                </section>
            </form>
        </article>
    );
};

export default LoginPage;