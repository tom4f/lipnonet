import React, { useState, Dispatch, SetStateAction } from 'react';

import { ShowOneValue } from './ShowOneValue';

// alias
// type Dispatcher<S> = Dispatch<SetStateAction<S>>;

type myItems = {
    date: string;
    days: number;
    email: string;
    id: number;
    name: string;
    password: string;
    sms: number;
    username: string;
    todayRainLimit: number;
    todayRainSent: number;
  };

interface ShowWindDaysTypes {
    items: myItems;
    setItems: Dispatch<SetStateAction<myItems>>;
}

export const ShowWindDays = ( { items, setItems }: ShowWindDaysTypes ) => {

    const multiSelectItems = [
        //{ id:  "0", name: 'Dummy' },
        { id:  1, name: 'neděle' },
        { id:  2, name: 'pondělí' },
        { id:  4, name: 'úterý' },
        { id:  8, name: 'středa' },
        { id: 16, name: 'čtvrtek' },
        { id: 32, name: 'pátek' },
        { id: 64, name: 'sobota' },
        { id:128, name: '[1] posílat jednu zprávu za den' },
        { id:256, name: '[2] dnešní zpráva již poslána' },
        { id:512, name: 'posilat jen při sílící tendenci, vypíná [1] a [2]' },
    ];


    // create initial multiselect array based on MySQL
    const initSelect = (days: number) => {
        // dec to binary
        if ( days === 0 ) return []; 
        const bin = days.toString(2);
        // bin to array
        const arr = [ ...bin ].reverse();
        // calculate array of selected values in multiSelectItems
        return arr.map( (value, index) => ( parseInt(value) * Math.pow(2, index) ) );
    }

    // storage of selected values in multiSelectItems
    const [ selectedItems, setSelectedItems ] = useState( initSelect(items.days) );
  
    const onSelectedItemsChange = (selectedItems: number[]) => {
        // calculate value for MySQL
        const sum = selectedItems.reduce( (acc: number, item: number) => (acc + item), 0 );
        setItems( { ...items, days: sum } )
        setSelectedItems( selectedItems );
    };

    return (

        <section className="input-section">
            <label>Nastavení větru</label>
            <ul>
                {
                    multiSelectItems.map( (one) => {
                        return (
                            <ShowOneValue
                                key={one.id}
                                one={one}
                                selectedItems={selectedItems}
                                onSelectedItemsChange={onSelectedItemsChange}
                            />
                        )
                    })
                }
            </ul>
        </section>
    );
};