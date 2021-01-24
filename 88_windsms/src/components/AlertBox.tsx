import { useEffect } from 'react';

interface AlertBoxProps {
    alert: {
        header : string;
        text   : string;
        color? : string;
    };
}

export const AlertBox = ( { alert: { header = '', text = '', color= 'red' } }: AlertBoxProps ) => {

    console.log(`${header} - ${text}`);
    return (
        header ? <article className="alert" style={ { color } }>
                    <header className="header">{`${header}`}</header>
                    <header className="text">  {`${text}`  }</header>
                 </article>
               : null
    );
};


export const Delay = ( alert = { header: '', text: '' }, setAlert: Function ): void => {
    
    const delay = () => {
        const timeout = setTimeout( () => {
            setAlert( { header: '', text: '' } );
        }, 5000 );
        return () => clearTimeout( timeout );
    }
    useEffect( delay, [ alert, setAlert ] );
}


