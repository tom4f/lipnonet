import React, { useState } from 'react';
import axios from 'axios';

import { apiPath }  from './apiPath';
import { AlertBox } from './AlertBox';
import { Delay }    from './AlertBox';


const ForgetPassword: React.FC = (): React.ReactElement => {

    // alert definition
    interface alertTypes {
        header : string;
        text   : string;
        color? : string;
    }
    const [ alert, setAlert ] = useState<alertTypes>( { header: '', text: '' } );
    // if 'alert' changed - wait 5s and clear 'alert'
    Delay( alert, setAlert );


    const [ identification, setIdentification ] = useState('');

    const getPasw = () => {

        if (!identification) {
            setAlert( { header: 'Uživatelské jméno / email', text: 'vyplňte údaje' } );
            return null
        }

        if (!/^[a-zA-Z0-9.\-_@]{3,}$/.test(identification)) {
            setAlert( { header: 'Špatné uživatelské jméno / email', text: 'vyplňte údaje' } );
            return null;
        } 
    
          axios
              .post(
                  `${apiPath()}pdo_sms_pasw.php`,
                  //`http://192.168.1.170/lipnonet/rekreace/api/pdo_sms_pasw.php`,
                  { identification },
                  { timeout: 5000 }
              )
              .then(res => {
    
                    // allForum = JSON.parse(res.data); --> for native xhr.onload 
                    const resp = res.data[0] || res.data;
      
                    console.log(typeof resp.sms_pasw);
                    //console.log(res);
      
                    // if error in response
                    if (typeof resp.sms_pasw === 'string') {
                        resp.sms_pasw === 'error' && setAlert( { header: 'Error !', text: 'heslo se nepodařilo odeslat...' } );
                        resp.sms_pasw === 'password_sent' && setAlert( { header: 'Heslo bylo odesláno na email:', text: `${resp.email}...`, color: 'lime'} );
                        return null
                    }
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
                    console.log(err);
                  }
              });   
      }

    return (
        <article className="container-forget-password">
            <header className="header-label">Zapomenuté heslo</header>
            <form onSubmit={(event) => {
                event.preventDefault();
                getPasw();
            }} name="formular" encType="multipart/form-data">
                <section className="input-section">
                    <label>Zadeje uživatelské jméno, nebo email</label>
                    <input
                        placeholder="Username or Email..."
                        onChange={ (e) => setIdentification( e.target.value  ) }
                        value={identification}
                    />
                </section>
                { alert.header ? <AlertBox alert={ alert } /> : null }
                <div className="submit-section">
                    <input type="submit" name="odesli" value="Send Password" />
                </div>
            </form>
        </article>
    );
};

export default ForgetPassword ;