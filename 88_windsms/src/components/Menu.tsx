// for Dispatch<SetStateAction<showStatusType>>
import { Dispatch, SetStateAction } from 'react'

// alias
type Dispatcher<S> = Dispatch<SetStateAction<S>>;

type showStatusType = {
    login  : boolean;
    forget : boolean;
    new    : boolean;
    about  : boolean;
    values : boolean;}

interface HeaderTypes {
    isLogged     : boolean;
    initShow     : showStatusType;
    showStatus   : showStatusType;
    // define useState type from parent
    // setShowStatus: (value: showStatusType | ((prevVar: showStatusType) => showStatusType)) => void;
    // or:
    setShowStatus: Dispatcher<showStatusType>;
    // or without alias:
    // setShowStatus: Dispatch<SetStateAction<showStatusType>>;
    loginStatus   : (status: boolean) => void;
}

export default function Menu( {isLogged, showStatus, setShowStatus, loginStatus, initShow } : HeaderTypes ) {

    return (
        <header className="menu">
            { 
            isLogged
            ? (!showStatus.values ? <span onClick={ () => setShowStatus( { ...initShow, values: true } ) }>nastavení</span>
                                 :  <span onClick={ () => loginStatus( false ) }>odhlášení</span>)
            : <span onClick={ () => setShowStatus( { ...initShow, login:  !showStatus.login } ) }>přihlášení</span>
            }
            <span onClick={ () => setShowStatus( { ...initShow, forget: !showStatus.forget} ) }>zapomenuté heslo?</span>
            <span onClick={ () => setShowStatus( { ...initShow, new:    !showStatus.new   } ) }>registrace</span>
            <span onClick={ () => setShowStatus( { ...initShow, about:  !showStatus.about } ) }>info</span>
        </header>
    )
}
