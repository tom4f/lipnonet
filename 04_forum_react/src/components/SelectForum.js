import React from 'react';

const SelectForum = ( {  searchText, filteredEntriesCalculate, categoryFromUrl } ) => {

    const optionList = categoryFromUrl !== 8 ? [
        <option key='1' value="999999">Všechny kategorie</option>,
        <option key='2' value="0">Fórum</option>,
        <option key='3' value="1">Inzerce</option>,
        <option key='4' value="2">Seznamka</option>,
        <option key='5' value="3">K obsahu stránek</option>
    ] : null;

    return (
        <select required name="typ" onChange={ event => filteredEntriesCalculate( searchText, event.target.value )} >
            {  optionList }
            <option value="8">Kaliště 993m n.m.</option>
        </select>
      )
}

export default SelectForum;