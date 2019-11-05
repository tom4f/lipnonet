import React from 'react';

const SearchForum = ( { filteredEntriesCalculate, selectedCategory } ) => {

    return (
        <input placeholder="hledej" type="text" size="5" onChange={ event => filteredEntriesCalculate( event.target.value, selectedCategory )} />
      )
}

export default SearchForum;