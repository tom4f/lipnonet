import React             from 'react';
import { ShowYearGraph } from './ShowYearGraph';
import { ShowYearTable } from './ShowYearTable';

export const SelectYear = () => {
    return (
        <>
            <ShowYearGraph />
            <ShowYearTable />
        </>
    )
}