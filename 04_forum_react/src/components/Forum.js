import React from 'react';

const Forum = ( {entries} ) => {
    const typText = [
      'Fórum',
      'Inzerce',
      'Seznamka',
      'K obsahu stránek',
      'noname1',
      'noname2',
    ];

    return (
      Object.keys(entries).map(key => (
        <div key={key} className="kniha_one_entry">
          <div className="kniha_datum">{typText[entries[key].typ]} - { entries[key].datum.slice(0,10)}</div> 
          <div className="kniha_jmeno"><b>{entries[key].id} - {entries[key].email ? <a href={entries[key].email}>{entries[key].jmeno}</a> : entries[key].jmeno }</b></div> 
          <div className="kniha_text">{entries[key].text}</div>
        </div>
      ))
    )
}

export default Forum;