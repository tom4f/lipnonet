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
  };

interface ShowWindDaysTypes {
    items: myItems;
    setItems: Dispatch<SetStateAction<myItems>>;
}

export const ShowWindDays = ( { items, setItems }: ShowWindDaysTypes ) => {

    const multiSelectItems = [
        //{ id:  "0", name: 'Dummy' },
        { id:  1, name: 'Neděle' },
        { id:  2, name: 'Pondělí' },
        { id:  4, name: 'Úterý' },
        { id:  8, name: 'Středa' },
        { id: 16, name: 'Čtvrtek' },
        { id: 32, name: 'Pátek' },
        { id: 64, name: 'Sobota' },
        { id:128, name: '[1] Posílat jednu SMS za den' },
        { id:256, name: '[2] Dnes SMS již posláno' },
        { id:512, name: 'Posilat jen při sílící tendenci, vypina [1] a [2]' },
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