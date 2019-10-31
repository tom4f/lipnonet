import React from 'react';

const SearchForum = ( {allEntries, begin, postsPerPage, paginate} ) => {

    const searchForumLocaly = event => {
        const end = begin + postsPerPage;
        const searchText = event.target.value;
        let filteredForum = allEntries.filter( alarm => {
          const regex = new RegExp(`${searchText}`, 'gi');
          return alarm.text.match(regex) || alarm.jmeno.match(regex);
        });
        if( searchText.length === 0 ) {
            paginate({
              filteredEntries : allEntries,
              begin : 0,
              entries : allEntries.slice(begin, end + 1)
            });
        } else if (filteredForum.length === 0 ) {
            paginate( {entries : []} );
          } else { 
                paginate({
                  filteredEntries : filteredForum,
                  begin : 0,
                  entries : filteredForum.slice(begin, end + 1),
                });
            }
      }

    return (
        <input placeholder="hledej" type="text" onChange={ event => searchForumLocaly(event)} />
      )
}

export default SearchForum;