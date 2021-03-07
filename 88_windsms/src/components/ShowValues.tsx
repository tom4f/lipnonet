import React, { useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

import { apiPath } from './apiPath';
import { AlertBox }   from './AlertBox';
import { Delay } from './AlertBox';
import { ShowWindDays } from './ShowWindDays';
import { ShowWindSpeed } from './ShowWindSpeed';
import { ShowTodayRainLimit } from './ShowTodayRainLimit';
import { ShowRainConfig } from './ShowRainConfig';

// alias
type Dispatcher<S> = Dispatch<SetStateAction<S>>;

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

interface ShowValuesTypes  {
  items: myItems;
  setItems: Dispatcher<myItems>;
  origSettings: myItems;
  setOrigSettings: Dispatcher<myItems>;
}

const ShowValues = ( { items, setItems, origSettings, setOrigSettings }: ShowValuesTypes ) => {

  // alert definition
  interface alertTypes {
      header : string;
      text   : string;
      color? : string;
  }
  const [ alert, setAlert ] = useState<alertTypes>( { header: '', text: '' } );
  // if 'alert' changed - wait 5s and clear 'alert'
  Delay( alert, setAlert )

  const [ showPassword, setShowPassword ] = useState( false );
  const [ showPasswordAgain, setShowPasswordAgain ] = useState( false );

  //{ items, setItems, origSettings, setOrigSettings }: ShowValuesTypes = props;

  // storage of selected values in multiSelectItems
  const [ passwordAgain, setPasswordAgain ] = useState( items.password.toString() );

  const changePassword = (textValue: string) => setItems(
        // currentItems => ({ currentItems, password: textValue })
        // or same :
        { ...items, password: textValue }
     )

  const updateData = () => {
    axios
      .post(
            `${apiPath()}pdo_update_sms.php`,
            //`https://www.frymburk.com/rekreace/api/pdo_update_sms.php`,
            items,
            { timeout: 5000 }
      )
      .then(res => {
          // allForum = JSON.parse(res.data); --> for native xhr.onload 
          // in axios res.data is already object
          const resp = res.data;
    
           if (typeof resp.smsResult === 'string') {
              if (resp.smsResult === 'value_changed') {
                setOrigSettings( items );
                setAlert( { header: 'Success !', text: 'data updated...', color: 'lime' } );

              } else setAlert( { header: 'Error...resp.smsResult', text: 'Please try later...' } );
           } else {
              setAlert( { header: 'Error...other...', text: 'Please try later...' } );
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

  const sendEdit = (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (origSettings === items) {
          setAlert( { header: 'Žádná změna!', text: 'neni co odesílat' } );
          return null
      }

      // password validation
      if (passwordAgain !== items.password) {
          setAlert( { header: 'Špatné heslo!', text: 'zadejte 2x stejné heslo' } );
          return null
      }
      if (!/^[a-zA-Z0-9.\-_]{3,10}$/.test(items.password)) {
          setAlert( { header: 'Špatné heslo!', text: 'zadejte 3 až 10 znaků (0-9 a..z A..Z - . _ )' } );
          return null
      }
      // email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(items.email)) {
          setAlert( { header: 'Špatný email', text: 'zadejte platný email' } );
          return null
      }

      updateData()
  }

return (
    <article className="container-show-values">
        <header className="header-label">Administrace - <label ><small>uživatel (id):</small> {items.username} ({items.id})</label></header>

        <form onSubmit={(event) => sendEdit(event)} name="formular" encType="multipart/form-data">
            <ShowWindDays items={items} setItems={setItems} />
            <ShowWindSpeed items={items} setItems={setItems} />
            <ShowTodayRainLimit items={items} setItems={setItems} />
            <ShowRainConfig items={items} setItems={setItems} />
            <section className="input-section password">
                <label>Heslo:</label><br/>
                <input
                    type={ showPassword ? "text" : "password" }
                    placeholder="heslo..."
                    onChange={ (e) => changePassword( e.target.value )}
                    value={items.password}
                    autoComplete="on"
                />
                <span onMouseOver={ () => setShowPassword( true ) }
                      onMouseOut ={ () => setShowPassword( false ) } >
                      Show
                </span>
                <input
                    type={ showPasswordAgain ? "text" : "password" }
                    placeholder="heslo znovu..."
                    onChange={ (e) => setPasswordAgain( e.target.value )}
                    value={passwordAgain}
                    autoComplete="on"
                />
                <span onMouseOver={ () => setShowPasswordAgain( true ) }
                      onMouseOut ={ () => setShowPasswordAgain( false ) } >
                      Show
                </span>
            </section>

            <section className="input-section">
              <label>Celé jméno:</label>
              <input
                  placeholder="Full Name..."
                  onChange={ (e) => setItems( { ...items, name: e.target.value } )}
                  value={items.name}
                />
            </section>

            <section className="input-section">
                <label>E-mail</label>
                <input
                    placeholder="Email..."
                    onChange={ (e) => setItems( { ...items, email: e.target.value } )}
                    value={items.email}
                />
            </section>
            { alert.header ? <AlertBox alert={ alert } /> : null }
            <section className="submit-section">
                <input type="submit" />
            </section>
        </form>
    </article>

    );
};

export default ShowValues;