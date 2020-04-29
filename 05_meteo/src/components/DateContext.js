import React, { //useState,
    createContext, useReducer } from 'react';

export const DateContext = createContext(null);

//export const DateProvider = ( props ) => {
export const DateProvider = ( { children } ) => {

    // get Dates from localStorage
    class Store {
        static getDateFromStorage() {
            let myDate;
            if (localStorage.getItem('myDate') === null) {
                myDate =  {
                    daily       : new Date(),
                    yearSum     : new Date(),
                    davisStat   : new Date()
                }
            } else {
                const { daily, yearSum, davisStat } = JSON.parse(localStorage.getItem('myDate'));
                myDate =  {
                    daily       : new Date(daily),
                    yearSum     : new Date(yearSum),
                    davisStat   : new Date(davisStat)
                }
            }
            return myDate;
        } 
    }

    // Reducer
    // AppReducer.js
    const AppReducer = (oldDate, action) => {
        switch(action.type) {
        case 'UPDATE_DATE':
            const newDate = {
                ...oldDate,
                [action.payload.param] : action.payload.value 
                };
            localStorage.setItem('myDate', JSON.stringify( newDate ));
            return newDate
        default:
            return oldDate;
        }
    }
    const [ date, dispatch ] = useReducer( AppReducer, Store.getDateFromStorage() );
    const globalDate = ( param, value ) => {
        //
        dispatch(
            // action object :
            {
                type: 'UPDATE_DATE',
                payload : { param, value }
            }
        )
    }




    // for useState
    // store Dates values for different graphs
    // const [ date, setDate ] = useState( Store.getDateFromStorage() );

    // update Dates + localStorage
    // const globalDate = (param, value) => {

    //     const globalDateJob = ( newValue ) => {
    //         // update localStorage - can be disabled
    //         localStorage.setItem('myDate', JSON.stringify( newValue ));
    //         return ( newValue );
    //     }

    //     setDate( prevDate => globalDateJob( { ...prevDate, [param] : value } ) );
    // }

    return (
        <DateContext.Provider value = {
            { 
                date,
                globalDate
            }
        }>
            { children }
        </DateContext.Provider>
    );

}