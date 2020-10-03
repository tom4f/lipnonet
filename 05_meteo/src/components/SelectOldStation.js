import React                from 'react';
import { ShowOldStationTable }     from './ShowOldStationTable';
import { ShowOldStationGraphCanvas } from './ShowOldStationGraphCanvas';

export const SelectOldStation = () => {

    return (
        <>
            <ShowOldStationGraphCanvas />
            <ShowOldStationTable />
        </>
    )
}