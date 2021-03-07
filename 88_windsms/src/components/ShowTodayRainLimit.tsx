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

interface ShowTodayRainLimitTypes {
    items: myItems;
    setItems: Dispatch<SetStateAction<myItems>>;
}

const ShowTodayRainLimit = ( { items, setItems }: ShowTodayRainLimitTypes ) => {

    // storage of selected values in multiSelectItems
    const [selectedTodayRainLimit, setSelectedTodayRainLimit] = useState( items.todayRainLimit );
    // generate <option> list
    let optionList = [];
    for ( let i = 0; i < 21; i++ ) {
        const showInList =  i > 0 ? `> ${i} mm` : '- vypnuto -  ';
        optionList[i] = <option key={i}  value={i} >{ showInList }</option>;
    }

    const setTodayRainLimit = (value: number) => {
        setItems( { ...items, todayRainLimit: value } )
        setSelectedTodayRainLimit( value );
    }

return (
        <section className="input-section">
            <label>Limit deště (dnes)</label>
            <select value={ selectedTodayRainLimit } onChange={ (event) => setTodayRainLimit( +event.target.value )}  >
                {  optionList }
            </select>
        </section>
    );
};

export { ShowTodayRainLimit };