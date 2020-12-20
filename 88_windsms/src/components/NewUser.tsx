import React, { useState } from 'react';
import { AlertBox }   from './AlertBox';
import axios from 'axios';
import { apiPath } from './apiPath';

const NewUser: React.FC = (): React.ReactElement => {
    
    interface newUserTypes {
        username: string;
        email: string;
    }

    const [ alert, setAlert ] = useState( { header: '', text: '' } );

    const [ newUser, setNewUser ] = useState<newUserTypes>({ username: '', email: '' });

    const createUser = () => {

        const { username, email } = newUser;

        if (!username || !email) {
            setAlert( { header: 'No item entered', text: 'Please enter username or password' } );
            return null
        }

        // check if min 3 characters
        if (!/[0-9a-zA-Z]{3,}/.test(username)) {
            setAlert( { header: 'short username', text: 'Please enter at least 3 characters' } );
            return null;
        } 

        // !
        //  /^
        //      [^\s@]+  - ^..negate, \s...all space variant, +...one or more occurance(same as {1,})
        //      @
        //      [^\s@]+
        //      \.
        //      [^\s@]+
        //  $/

        // check email
        //or without possibility of more @:  /\S+@\S+\.\S+/;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            setAlert( { header: 'wrong email', text: 'Please enter valid email' } );
            return null;
        } 
        
        console.log(username, email);
        
          axios
              .post(
                  `${apiPath()}pdo_sms_new.php`,
                  //`http://192.168.1.170/lipnonet/rekreace/api/pdo_sms_new.php`,
                  newUser,
                  { timeout: 5000 }
              )
              .then(res => {
    
                    // allForum = JSON.parse(res.data); --> for native xhr.onload 
                    const resp = res.data[0] || res.data;
      
                    //console.log(res); 
                    //console.log(resp.sms_new);
                    //console.log(resp);
      
                    // if error in response
                    if (typeof resp.sms_new === 'string') {
                        if (resp.sms_new === 'user_exists' ) { setAlert( { header: '', text: '' } ); setAlert( { header: 'Error !', text: 'user exists...' } ) };
                        if (resp.sms_new === 'email_exists') { setAlert( { header: '', text: '' } ); setAlert( { header: 'Error !', text: 'email exists...' } ) };
                        if (resp.sms_new === 'error'       ) { setAlert( { header: '', text: '' } ); setAlert( { header: 'Error !', text: 'heslo se nepodařilo odeslat...' } ) };
                        if (resp.sms_new === 'user_added'  ) { setAlert( { header: '', text: '' } ); setAlert( { header: `Heslo pro ${resp.username} odesláno na`, text: `${resp.email}...` } ) };
                    } else {
                        setAlert( { header: 'unknown Error !', text: 'try later...' } );

                    }

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
        <article className="container-new-user">
            <header className="header-label">Registrace</header>
            <form onSubmit={(event) => {
                    event.preventDefault();
                    createUser() 
                }} name="formular" encType="multipart/form-data">
                <section className="input-section">
                    <label>Zadejte uživatelské jméno:</label>
                    <input
                        placeholder="your new username..."
                        onChange={ (e) => setNewUser( current => ({ ...current, username: e.target.value }) ) }
                        value={newUser.username}
                    />
                </section>
                <section className="input-section">
                    <label>Zadejte emailovou adresu:</label>
                    <input
                        placeholder="your email..."
                        onChange={ (e) => setNewUser( current => ({ ...current, email: e.target.value }) ) }
                        value={newUser.email}
                    />
                </section>
                { alert.header ? <AlertBox alert={ alert } /> : null }
                <div className="submit-section">
                    <input type="submit" name="odesli" value="create user" />
                </div>
            </form>
        </article>
    );
};

export default NewUser ;