import React, { useState } from 'react';
import './index.css';
import Menu           from './components/Menu';
import LoginPage      from './components/LoginPage';
import ShowValues     from './components/ShowValues';
import ForgetPassword from './components/ForgetPassword';
import NewUser        from './components/NewUser';
import About          from './components/About';

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
    login  : false,
    forget : false,
    new    : false,
    about  : false,
    values : false
  }

  const [ items, setItems ]               = useState( initItems );
  const [ origSettings, setOrigSettings ] = useState( initItems );
  const [ isLogged, setIsLogged ]         = useState( false );
  const [ showStatus, setShowStatus ]     = useState( { ...initShow, login: true } );

  const loginStatus = (status : boolean) => {
    setIsLogged( status );
    setShowStatus( { ...initShow, values:  status, login: !status } );
}

  return (
    <div className="container-top">
        <Menu
            isLogged      = { isLogged }
            showStatus    = { showStatus }
            setShowStatus = { setShowStatus }
            loginStatus   = { loginStatus }
            initShow      = { initShow }
        />
        <header className="header-main">Lipno Meteo Alert</header>
        <span>
            { showStatus.values  ? <ShowValues
                  items           = { items }
                  setItems        = { setItems }
                  origSettings    = { origSettings }
                  setOrigSettings = { setOrigSettings }
              /> : null }

            { showStatus.login  ? <LoginPage
                  setOrigSettings = { setOrigSettings }
                  setItems        = { setItems }
                  loginStatus     = { loginStatus }
              /> : null }
            { showStatus.forget ? <ForgetPassword /> : null }
            { showStatus.new    ? <NewUser />        : null }
            { showStatus.about  ? <About />          : null }
        </span> 
    </div>
  );
};

export default App;