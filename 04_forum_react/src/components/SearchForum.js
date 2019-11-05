import React from 'react';

const SearchForum = ( { filteredEntriesCalculate } ) => {

    return (
        <input placeholder="hledej" type="text" size="5" onChange={ event => filteredEntriesCalculate( event.target.value  )} />
      )
}

export default SearchForum;