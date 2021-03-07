import { useState, useEffect, Dispatch, SetStateAction } from 'react';

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

interface ShowRainConfigTypes {
    items: myItems;
    setItems: Dispatch<SetStateAction<myItems>>;
}

export const ShowRainConfig = ( { items, setItems }: ShowRainConfigTypes ) => {

    const [ checked, setChecked ] = useState( items.todayRainSent === 1 ? true : false );

    const updCheckedList = () => {
        setItems ( current => ({
            ...current,
            todayRainSent: current.todayRainSent === 1 ? 0 : 1
        }))
    }

    useEffect(
        () => ( setChecked( items.todayRainSent === 1 ? true : false ) ),
        [ items.todayRainSent ]
    );
   
    return (
        <section className="input-section">
        <label>Nastavení deště</label>
            <ul>
                <li>
                    <label>
                        <input type="checkbox" 
                            onChange={ updCheckedList }
                            checked={ checked }
                            //value={ items.todayRainSent }
                        />
                        dnešní zpráva již poslána
                    </label>
                </li>
            </ul>
        </section>
    );
};