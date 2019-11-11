import React from 'react';

const Paginations = ( {begin, postsPerPage, paginate, paginateSize, next, filteredEntriesBySearch, buttonText} ) => {
    const lastPage = filteredEntriesBySearch.length;
    const pageButtonClick = (event) => {
        event.preventDefault();
        const buttonTextClicked = event.target.textContent || event.target.innerText;
        let myButtonText;
        // if pagina button clicked
        if ( Number(buttonTextClicked ) >= 0 ){
            begin =  Number(buttonTextClicked) * postsPerPage;
            // get list of all buttons
            const buttonsDom = event.target.parentElement.children;
            // remove backgroud from previous button
            buttonsDom[Number(buttonText)].classList.remove('button_on');
            // add background to clicked button
            event.target.classList.add('button_on');
            myButtonText = buttonTextClicked - next;
        }
        // if 'next' button clicked
        if (buttonTextClicked === 'next'){
            myButtonText = 0;
            if (next < (lastPage / postsPerPage) - paginateSize ){
                next += paginateSize;
                begin = postsPerPage * next;
            }
        }
        // if 'prev' button clicked
        if (buttonTextClicked === 'prev'){
            myButtonText = 0;
            if (next > paginateSize - 1){
                next -= paginateSize;
                begin = postsPerPage * next;
            }
        }
        paginate({
            begin : begin,
            next: next,
            buttonText : myButtonText
        });
    }

    // [UI] generate pagination button list 
    const showPagination = () => {
        let buttonPageList = [];
        for( let i = next; i < lastPage / postsPerPage; i++ ){
            if( i < next + paginateSize ){
                const buttonClass = `pagina ${i === next ? 'button_on' : null}`;
                buttonPageList.push(
                    <button 
                        // set background-color for 1st button
                        className = { buttonClass }
                        //className = {i === next ? 'button_on' : null}
                        key = {i}
                        onClick = {e => pageButtonClick(e)}>
                        {i}
                    </button>
                );
            }
        }
        return buttonPageList;
    }

    return ( 
        <div className="kniha_pagination">
            <button className="paginaPrev" onClick={ e => pageButtonClick(e) }>prev</button>
            <span>
                { showPagination() }
            </span>
            <button className="paginaNext" onClick={ e => pageButtonClick(e) }>next</button>
        </div>
    );
}
export default Paginations;