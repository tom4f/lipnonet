import React, { useState }          from 'react';

export const AddPocasi = ( { pocasi, webToken, refresh, setRefresh } ) => {

    const { hladina, pritok, odtok, voda, vzduch, pocasi : komentar } = pocasi[0];
   
    let fotoGalleryOwner = '_ubytovani'; 

    const today = ( now ) => {
        let day = now.getDate();
        day = day < 10 ? `0${day}` : day; 
        let month = now.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;    
        const year = now.getFullYear();
        return `${year}-${month}-${day}`;
    }


    const [ newValues, setNewValues ] = useState({
        datum : today( new Date() ),
        hladina,
        pritok,
        odtok,
        voda,
        vzduch,
        pocasi: komentar
    });

    const [ showForm, setShowForm ] = useState(false);
    const [ loginResp, setLoginResp ] = useState('empty');
 
    const insert = (e) =>{
        e.preventDefault();
        // AJAX
        let xhr = new XMLHttpRequest();
        
        xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_add_pocasi.php`, true);
        //xhr.open('POST', `api/pdo_update_pocasi.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState === 4 && this.status === 200) {
                const editResult = JSON.parse(this.responseText);
                console.log(editResult.result);
                if ( editResult.result === 'pocasi_added' ) {
                    setShowForm(false);
                    setRefresh( refresh + 1 );
                    setLoginResp('success'); 
                } else {
                    setLoginResp('error');
                }

            }
        }
        xhr.onerror = function () {
        }
        xhr.send(JSON.stringify( { ...newValues, webToken, fotoGalleryOwner }));

    }

    const set = (e) =>{
        const param = e.target.name;
        const value = e.target.value;
        setNewValues( { ...newValues, [param]: value });
    }

    return (
        <>
            <div className="form_booking">
                <div className="submit_booking">
                    <input type="submit" onClick={ () => setShowForm(!showForm) } value="+ Vytvřit nový záznam" />
                </div>
            </div>
        { showForm ?
        <div className="add-container">
          { loginResp==='error' ? <div> Někde nastala chyba :-(</div> : null }
          <div className="close-btn" onClick={ () => setShowForm(false) } ><span>x</span></div>
          <h4>Nový záznam  </h4>
          <form onSubmit={ e => insert(e) }  autoComplete="off" id="edit_form_pocasi" name="edit_form_pocasi">
              <div className="form_booking add_booking">
                  <div className="input_booking">
                      <label>datum:</label><br />
                      <input type="text" name="datum" value={ newValues.datum } onChange={ (e) => set(e)}  />
                  </div>
                  <div className="input_booking">
                      <label>voda:</label><br />
                      <input type="text" name="voda" value={newValues.voda} onChange={ (e) => set(e) } />
                  </div>
                  <div className="input_booking">
                      <label>vzduch:</label><br />
                      <input type="text" name="vzduch" value={newValues.vzduch} onChange={ (e) => set(e) } />
                  </div>
                  <div className="input_booking">
                      <label>hladina:</label><br />
                      <input type="text" name="hladina" value={newValues.hladina} onChange={ (e) => set(e) } />
                  </div>
                  <div className="input_booking">
                      <label>přítok:</label><br />
                      <input type="text" name="pritok" value={newValues.pritok} onChange={ (e) => set(e) } />
                  </div>
                  <div className="input_booking">
                      <label>odtok:</label><br />
                      <input type="text" name="odtok" value={newValues.odtok} onChange={ (e) => set(e) } />
                  </div>
                  <div className="input_booking">
                      <label>komentář:</label><br />
                      <input type="text" name="pocasi" value={newValues.pocasi} onChange={ (e) => set(e) } />
                  </div>

                  <div className="submit_booking">
                      <input type="submit" name="odesli" value="Odeslat" />
                  </div>
              </div>
          </form>
        </div>
        : null }

        </>
    )
}