import React, {useState, useEffect}    from 'react';
import { ShowLogin }        from './ShowLogin';
import { ShowYearTable }    from './ShowYearTable';
import { EditPocasi }       from './EditPocasi';
import { AddPocasi }        from './AddPocasi';
import { DeletePocasi }     from './DeletePocasi';
import { addQuerySelector } from './AddQuerySelector'

import '../css/formular.css';
import '../css/modifyPocasi.css';

export const ModifyPocasi = () => {
    // last 30 meteo lines
    const [ pocasi, setPocasi ] = useState([]);
    // login data
    const [ user, setUser ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ webToken, setWebToken ] = useState('error');
    // edit params
    const [ editMeteo, setEditMeteo ] = useState( 
        {
         // values to be edited
         editDate : '',
         editKey : '',
         editValue : '',
         // show/hide edit form 
         dispEdit : false,
         dispDelete : false
        }
     );
    // trigger for table reload
    const [ refresh, setRefresh ] = useState(0);
    // update table querySelector when 'pocasi' changed
    useEffect( () => addQuerySelector(pocasi, setEditMeteo, webToken), [ pocasi ]);
    
    return (
        <>
            <div className="editPocasi">
                { webToken === 'error' ?
                    <ShowLogin
                        user={user} setUser={setUser}
                        password={password} setPassword={setPassword}
                        setWebToken={setWebToken}
                        refresh={refresh} setRefresh={setRefresh}
                    /> :
                    <AddPocasi
                        pocasi={pocasi}
                        webToken={webToken}
                        refresh={refresh} setRefresh={setRefresh}
                /> }

                { editMeteo.dispEdit ?
                    <EditPocasi
                        pocasi={pocasi}
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken}
                        refresh={refresh} setRefresh={setRefresh}
                    /> : null }
                { editMeteo.dispDelete ?
                    <DeletePocasi
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken}
                        refresh={refresh} setRefresh={setRefresh}
                    /> : null }
            </div>
            <ShowYearTable
                pocasi={pocasi} setPocasi={setPocasi}
                user={user} webToken={webToken}
                refresh={refresh}
            />
        </>

    )
}