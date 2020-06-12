import React, {useState}             from 'react';
import { ShowYearGraph } from './ShowYearGraph';
import { ShowYearTable } from './ShowYearTable';

export const SelectYear = () => {

    const [ pocasi, setPocasi ] = useState([]);

    return (
        <>
            <ShowYearGraph />
            <ShowYearTable pocasi={pocasi} setPocasi={setPocasi} />
        </>
    )
}