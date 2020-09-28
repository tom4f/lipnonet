import React                from 'react';
import { ShowDayGraph }     from './ShowDayGraph';
import { ShowDayTable }     from './ShowDayTable';
import { ShowDayStatistic } from './ShowDayStatistic';

import { ShowDayGraphCanvas } from './ShowDayGraphCanvas';
import { ShowDayGraphCanvasToday } from './ShowDayGraphCanvasToday';

export const SelectDay = () => {

    return (
        <>
            <ShowDayGraphCanvasToday />
            <ShowDayGraphCanvas />
            <ShowDayTable />
            <ShowDayGraph />
            <ShowDayStatistic />
        </>
    )
}