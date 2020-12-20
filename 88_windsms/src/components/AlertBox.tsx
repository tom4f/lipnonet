
export const AlertBox = ( { alert: { header = '', text= '' } }: any ) => {

    console.log(`${header} - ${text}`);

    return (
        <>       
        { 
        header ? <article className="alert">
                    <header className="header">{`${header}`}</header>
                    <header className="text">  {`${text}`}</header>
                 </article>
               : null
        }
        </>
    );
};



