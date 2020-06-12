import React, { useState }  from 'react';

export const ShowLogin = ({
    user, setUser, password, setPassword, setWebToken, 
    refresh, setRefresh
}) => {

   let fotoGalleryOwner = '_ubytovani'; 
   
   const [ loginResp, setLoginResp ] = useState('empty');
    
   // get webToken and webAccess from server
    const loginGetToken = (event) => {
        event.preventDefault();
        const object = {
            fotoGalleryOwner,
            user,
            password
        }
        let xhr = new XMLHttpRequest();
        // xhr.open('POST', `api/foto_login.php`, true);
        xhr.open('POST', `http://localhost/lipnonet/rekreace/api/foto_login.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState === 4 && this.status === 200) {
                const id = JSON.parse(this.responseText);
                const newWebToken = id[0].webToken;
                   console.log(newWebToken);
                if ( newWebToken === 'error' ) {
                    setLoginResp('error');
                } else {
                    // reload table => update 'pocasi' => addQuerySelector
                    setRefresh( refresh + 1 );
                    
                    setLoginResp('loginSuccess');
                    setWebToken(newWebToken);
                }
            }
        }
        xhr.send(JSON.stringify(object));
    }

    return (
        <div className="login-container">
            { loginResp==='error' ? <div> Někde nastala chyba :-(</div> : null }
            <form onSubmit={ (e) => loginGetToken(e) }>
                <div className="form_booking">
                    <div className="input_booking">
                        <label>Uživatel :</label><br />
                        <input name="user" onChange={ (e) => setUser(e.target.value) } value={user} type="text" placeholder="zadejte uživatele" size="10" minLength="5" required />
                    </div>
                    <div className="input_booking">
                        <label>Heslo :</label><br />    
                        <input name="password" onChange={ (e) => setPassword(e.target.value) } value={password} type="password" placeholder="zadejte heslo" size="10"  minLength="5" required />
                    </div>
                    <div className="submit_booking">
                        <input type="submit" value="Odeslat" />
                    </div>
                </div>
            </form>
        </div>
    )
}