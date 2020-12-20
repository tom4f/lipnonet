import React, { useState } from 'react';
import './index.css';
import LoginPage      from './components/LoginPage';
import ShowValues     from './components/ShowValues';
import ForgetPassword from './components/ForgetPassword';
import NewUser        from './components/NewUser';

//const App = ():React.ReactNode => {
const App: React.FC = () => {

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

  const initShow = {
    login          : true,
    forgetPassword : false,
    newUser        : false
  }

  const [ items, setItems ]               = useState( initItems );
  const [ origSettings, setOrigSettings ] = useState( initItems );
  const [ isLogged, setIsLogged ]         = useState( false );
  const [ showStatus, setShowStatus ]     = useState( initShow );

  return (
    <div className="container-top">
        <header className="header-top">
        { 
          isLogged
          ? <span onClick={ () => setIsLogged( current => !current ) }>odhlášení</span>
          : <span onClick={ () => setShowStatus( current => ({ ...current, login: !showStatus.login, forgetPassword: false, newUser: false })  ) }>přihlášení</span>
        }
            <span onClick={ () => setShowStatus( current => ({ ...current, forgetPassword: !showStatus.forgetPassword, login: false, newUser: false })  ) }>zapomenuté heslo?</span>
            <span onClick={ () => setShowStatus( current => ({ ...current, newUser: !showStatus.newUser, login: false, forgetPassword: false })  ) }>registrace nového uživatele</span>
        </header>
        <header className="header-main">Lipno Wind SMS</header>
        { 
        isLogged
        ? <ShowValues
              items           = { items }
              setItems        = { setItems }
              origSettings    = { origSettings }
              setOrigSettings = { setOrigSettings }
          />
          : <span>
                { showStatus.login ? <LoginPage
                    setOrigSettings = { setOrigSettings }
                    setItems        = { setItems }
                    setIsLogged     = { setIsLogged }
                /> : null }
                { showStatus.forgetPassword ? <ForgetPassword /> : null }
                { showStatus.newUser        ? <NewUser />        : null }
            </span> 
        }

    </div>
  );
};

export default App;