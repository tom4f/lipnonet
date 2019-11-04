import React from 'react';

const Paginations = ( {allEntries, begin, postsPerPage, paginate, paginateSize, next, filteredEntries} ) => {
    const lastPage = filteredEntries.length;
    const pageButtonClick = (event, param) => {
        event.preventDefault();
        const buttonText = event.target.textContent || event.target.innerText;
        let end;
        if (Number(buttonText) >= 0 ){
            begin = (1 + postsPerPage) * Number(buttonText);
            end = begin + postsPerPage;
            paginate( {
                entries : filteredEntries.slice(begin, end + 1),
                begin : begin
            } );
        }
        if (buttonText === 'next'){
            if (next < (lastPage / (postsPerPage + 1)) - paginateSize ){
                next+=paginateSize;
                begin = (1 + postsPerPage) * next;
                end = begin + postsPerPage;
                paginate({
                    next: next,
                    begin: begin,
                    entries : filteredEntries.slice(begin, end + 1)
                });
            }
        }
        if (buttonText === 'prev'){
            if (next > paginateSize - 1){
                next-=paginateSize;
                begin = (1 + postsPerPage) * next;
                end = begin + postsPerPage;
                paginate({
                    next: next,
                    begin: begin,
                    entries : filteredEntries.slice(begin, end + 1)
                });
            }
        }
        console.log(`next=${next} < ${(lastPage / end) - paginateSize}`);
        console.log(`Pagination: buttonText=${buttonText}, begin=${begin}, end=${end}`);
      }

    const showPagination = () => {
        let buttonPageList = [];
        buttonPageList.push(<button key={999999} className="prev" onClick={ e => pageButtonClick(e, 'prev') }>prev</button>);
        for( let i = next; i < lastPage / postsPerPage; i++ ){
            if( i < next + paginateSize ){
                //returning an array of JSX elements
                //https://www.freecodecamp.org/forum/t/react-rendering-raw-html-code-instead-of-interpreting-it/208624/2
                buttonPageList.push(<button key={i} className="pagina" onClick={ e => pageButtonClick(e, i) }>{i}</button>);
            }
        }
        buttonPageList.push(<button key={999998} className="next" onClick={ e => pageButtonClick(e, 'next') }>next</button>);
        return buttonPageList;
    }
    return ( 
        <div className="kniha_pagination">
            { showPagination() }
        </div>
    );
}
export default Paginations;