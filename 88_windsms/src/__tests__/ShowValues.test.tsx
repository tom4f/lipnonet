import React from 'react';
import { render, screen } from '@testing-library/react';

import ShowValues from '../components/ShowValues';

describe('First ShowValues Test', () => {
    test('render ShowValues component', () => {
        
        const initItems = {
            date    : '',
            days    : 0,
            email   : '',
            id      : 0,
            name    : '',
            password: '',
            sms     : 0,
            username: '',
          }
        
        render(<ShowValues
            items           = { initItems }
            setItems        = { null }
            origSettings    = { initItems }
            setOrigSettings = { null }
        />);

        screen.debug();
    })
})