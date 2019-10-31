import React from 'react';

const SelectForum = ( {allEntries, postsPerPage, paginate} ) => {

    const filteredForum = event => {
        const filteredForum = event.target.value === "999999"
            ? allEntries
            : allEntries.filter( one => one.typ === event.target.value );
        const begin = 0;
        const end = begin + postsPerPage;
        paginate({
            filteredEntries : filteredForum,
            begin : 0,
            next : 0,
            entries : filteredForum.slice(begin, end + 1),
        });
      }

    return (
        <select required name="typ" onChange={(e) => filteredForum(e)} >
            <option value="999999">  --- Všechny kategorie ---</option>
            <option value="0">Fórum</option>
            <option value="1">Inzerce</option>
            <option value="2">Seznamka</option>
            <option value="3">K obsahu stránek</option>
        </select>
      )
}

export default SelectForum;