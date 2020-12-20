import React, { useState } from 'react';
import PropTypes from 'prop-types';

interface ShowWindSpeedTypes {
    items: {
        date: string;
        days: number;
        email: string;
        id: number;
        name: string;
        password: string;
        sms: number;
        username: string;
    }
    setItems: any;
}

const ShowWindSpeed = ( { items, setItems }: ShowWindSpeedTypes ) => {

    // storage of selected values in multiSelectItems
    const [selectedWindSpeed, setSelectedWindSpeed] = useState( items.sms.toString() );

    const optionList = [
        <option key='5'  value="5" >&gt; 5 m/s </option>,
        <option key='6'  value="6" >&gt;6 m/s </option>,
        <option key='7'  value="7" >&gt;7 m/s </option>,
        <option key='8'  value="8" >&gt;8 m/s </option>,
        <option key='9'  value="9" >&gt;9 m/s </option>,
        <option key='10' value="10">&gt;10 m/s</option>,
        <option key='11' value="11">&gt;11 m/s</option>,
        <option key='12' value="12">&gt;12 m/s</option>,
        <option key='13' value="13">&gt;13 m/s</option>,
        <option key='14' value="14">&gt;14 m/s</option>,
        <option key='15' value="15">&gt;15 m/s</option>,
        <option key='16' value="16">&gt;16 m/s</option>,
        <option key='17' value="17">- off - </option>,
    ];

    const setWindSpeed = (value: any) => {
        console.log(value);
        setItems( { ...items, sms: value } )
        setSelectedWindSpeed( value );
    }

return (
        <section className="input-section">
            <label>Wind limit</label>
            <select value={selectedWindSpeed} required name="typ" onChange={ (event) => setWindSpeed( event.target.value )} >
                {  optionList }
            </select>
        </section>
    );
};

ShowWindSpeed.propTypes = {
    items        : PropTypes.object,
    setItems     : PropTypes.func,
}

export { ShowWindSpeed };