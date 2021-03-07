import React from 'react';
import { render, screen } from '@testing-library/react';

import About from '../components/About';

describe('First About Test', () => {
    test('render About component', () => {
        render(<About/>);

        screen.debug();
    })
})