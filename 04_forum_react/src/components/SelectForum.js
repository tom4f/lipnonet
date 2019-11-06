import React from 'react';

const SelectForum = ( {  searchText, filteredEntriesCalculate } ) => {

    return (
        <select required name="typ" onChange={ event => filteredEntriesCalculate( searchText, event.target.value )} >
            <option value="999999">Všechny kategorie</option>
            <option value="0">Fórum</option>
            <option value="1">Inzerce</option>
            <option value="2">Seznamka</option>
            <option value="3">K obsahu stránek</option>
        </select>
      )
}

export default SelectForum;