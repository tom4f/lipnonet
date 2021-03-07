import { useState, Dispatch, SetStateAction } from 'react';

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

interface ShowWindSpeedTypes {
    items: myItems;
    setItems: Dispatch<SetStateAction<myItems>>;
}

const ShowWindSpeed = ( { items, setItems }: ShowWindSpeedTypes ) => {

    // storage of selected values in multiSelectItems
    const [selectedWindSpeed, setSelectedWindSpeed] = useState( items.sms );

    // generate <option> list
    let optionList = [];
    for ( let i = 4; i < 18; i++ ) {
        const textInList =  i < 17 ? `> ${i} m/s` : '- vypnuto -  ';
        optionList[i] = <option key={i}  value={i} >{ textInList }</option>;
    }

    const setWindSpeed = (value: number) => {
        setItems( { ...items, sms: value } )
        setSelectedWindSpeed( value );
    }

return (
        <section className="input-section">
            <label>Limit větru</label>
            <select value={selectedWindSpeed} onChange={ (event) => setWindSpeed( +event.target.value )} >
                {  optionList }
            </select>
        </section>
    );
};

export { ShowWindSpeed };