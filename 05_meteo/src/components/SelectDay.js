import React                from 'react';
import { ShowDayGraph }     from './ShowDayGraph';
import { ShowDayTable }     from './ShowDayTable';
import { ShowDayStatistic } from './ShowDayStatistic';

export const SelectDay = () => {

    return (
        <>
            <ShowDayGraph />
            <ShowDayTable />
            <ShowDayStatistic />
        </>
    )
}