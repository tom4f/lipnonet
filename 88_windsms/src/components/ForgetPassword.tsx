import React, { useState } from 'react';
import { AlertBox }   from './AlertBox';
import axios from 'axios';
import { apiPath } from './apiPath'

const ForgetPassword: React.FC = (): React.ReactElement => {


    const [ alert, setAlert ] = useState( { header: '', text: '' } );

    const [ identification, setIdentification ] = useState('');

    const getPasw = () => {

        if (!identification) {
            setAlert( { header: 'No item entered', text: 'Please enter username or password' } );
            return null
      }

      if (!/[0-9a-zA-Z]{3,}/.test(identification)) {
        setAlert( { header: 'short userid or email', text: 'Please enter at least 3 characters' } );
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
                        resp.sms_pasw === 'password_sent' && setAlert( { header: 'Heslo bylo odesláno na email:', text: `${resp.email}...` } );
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
                <article className="input-section">
                    <label>Zadeje uživatelské jméno, nebo email</label>
                    <input
                        placeholder="Username or Email..."
                        onChange={ (e) => setIdentification( e.target.value  ) }
                        value={identification}
                    />
                </article>
                { alert.header ? <AlertBox alert={ alert } /> : null }
                <div className="submit-section">
                    <input type="submit" name="odesli" value="Send Password" />
                </div>
            </form>
        </article>
    );
};

export default ForgetPassword ;