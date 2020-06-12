export const addQuerySelector = ( pocasi, setEditMeteo, webToken ) => {
    // set 'click' event listener for all table <div>

    const editTermin = (event) => {
        const clickedTd = event.target;
        const childsTd = clickedTd.parentNode.children;
        // previous <td>
        let prevTd = clickedTd;
        let clicedColumnNr = 0;
        // instead 'while'
        for ( let i = childsTd.length - 1; i > 0; i--) {
            if ( prevTd.previousElementSibling ) {
                prevTd = prevTd.previousElementSibling;
                clicedColumnNr++;
            }
        } 
        // order of table columns
        const allKeys = [ 'hladina', 'pritok', 'odtok', 'voda', 'vzduch', 'pocasi' ];
        // if column number is not 0 (date column), continue :
        // get clicked week from first column, e.g. 27.06-04.07.2020
        const clickedDate = childsTd[0].innerText;
        // reduce method is not optimal like search, but works
        const clickedRowNr = pocasi.reduce( (total, value, index) => value.datum === clickedDate ? total + index : total, 0 )
        // get edited property (e.g. 'hladina')
        const editKey = allKeys[clicedColumnNr - 1];
        // descructuring 'datum' & 'clicked property'
        const { datum : editDate, [editKey] : editValue } = pocasi[clickedRowNr];

        console.log(`${editDate}, ${editKey}: ${editValue}`);

        if ( clicedColumnNr ) {
            setEditMeteo(
                {
                    editDate,
                    editKey,
                    editValue,
                    dispEdit : true,
                    dispDelete : false
                }
            );

        } else {
            setEditMeteo(
                {
                    editDate,
                    editKey,
                    editValue,
                    dispEdit : false,
                    dispDelete : true
                }
            );
            console.log(pocasi[clickedRowNr].datum);
        }
        }

    const clickedDiv = document.querySelectorAll('td');
    // add eventListener only if login OK
    if ( webToken !== 'error' ) {
        clickedDiv.forEach( div => div.addEventListener('click', (e) => editTermin(e) ))
    }
}