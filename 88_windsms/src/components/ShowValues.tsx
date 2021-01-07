import React, { useState } from 'react';
import { AlertBox }   from './AlertBox';
import { ShowWindDays } from './ShowWindDays';
import { ShowWindSpeed } from './ShowWindSpeed';
import axios from 'axios';
import { apiPath } from './apiPath';


type myItems = {
  date: string;
  days: number;
  email: string;
  id: number;
  name: string;
  password: string;
  sms: number;
  username: string;
};

interface ShowValuesTypes  {
  items: myItems;
  setItems: any;
  origSettings: myItems;
  setOrigSettings: any;
}

const ShowValues = ( { items, setItems, origSettings, setOrigSettings }: ShowValuesTypes ) => {

  const [ alert, setAlert ] = useState( { header: '', text: '' } );
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
                setAlert( { header: 'Success !', text: 'data updated...' } );

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

  const sendEdit = () => {
      // password validation
      passwordAgain === items.password
          ? passwordAgain.length > 2
              ? updateData()
              : setAlert( { header: 'No change', text: 'short password?' } )
          : setAlert( { header: 'No change', text: 'wrong password?' } );
  }

return (
    <article className="container-show-values">
        <header className="header-label">Administrace - <label ><small>user (id):</small> {items.username} ({items.id})</label></header>

        <form onSubmit={(event) => {
          event.preventDefault();
          origSettings === items
              ? setAlert( { header: 'No change', text: 'blabla' } )
              : sendEdit();
          }} name="formular" encType="multipart/form-data">
              <ShowWindDays items={items} setItems={setItems} />
              <ShowWindSpeed items={items} setItems={setItems} />
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
                  <input type="submit" name="odesli" value="Odeslat" />
              </section>
        </form>
    </article>

    );
};

export default ShowValues;