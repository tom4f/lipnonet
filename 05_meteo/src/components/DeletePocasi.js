import React    from 'react';

export const DeletePocasi = ({ 
        editMeteo,
        editMeteo : { editDate },
        setEditMeteo,
        webToken,
        refresh, setRefresh
    }) => {

    let fotoGalleryOwner = '_ubytovani';

    const deleteMySQL = (e) => {
        e.preventDefault();
        console.log('Delete');
        const form = document.getElementById('delete_form_pocasi');
        const FD = new FormData(form);
        FD.append('fotoGalleryOwner', fotoGalleryOwner);
        FD.append('webToken', webToken);
        const FDobject = {};
        FD.forEach( (value, key) => FDobject[key] = value );
        // AJAX
        {
            let xhr = new XMLHttpRequest();
            
            xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_delete_pocasi.php`, true);
            //xhr.open('POST', `api/pdo_update_pocasi.php`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function(){
                if (this.readyState === 4 && this.status === 200) {
                    const editResult = JSON.parse(this.responseText);
                    console.log(editResult);
                    setRefresh( refresh + 1 );
                    setEditMeteo( { ...editMeteo, dispDelete : false } );
                } 
            }
            xhr.onerror = function () {
                const editResultAjaxEror = JSON.parse('{"mailResult" : "ajax_failed"}');
                console.log(editResultAjaxEror)
            }
            xhr.send(JSON.stringify(FDobject));
        }
    }

    return (
        <div className="delete-container">
          <div className="close-btn" onClick={ () => setEditMeteo( { ...editMeteo, dispDelete : false } ) }><span>x</span></div>
          <h4>Mažete datum {editDate} </h4>
          <form onSubmit={ (e) => deleteMySQL(e) } autoComplete="off" id="delete_form_pocasi">
              <div className="form_booking edit_booking">
                  <input type="hidden" name="datum" value={editDate} />
                  <div className="submit_booking edit_input_booking">
                      <input type="submit" name="odesli" value="Opravdu smazat?" />
                  </div>
              </div>
          </form>
        </div>
    )
}