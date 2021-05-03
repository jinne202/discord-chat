import React from 'react';
import { Switch, Route, Redirect  } from 'react-router-dom';
import loadable from '@loadable/component';

const LoginPage = loadable(() => import('../pages/Login'));
const RegisterPage = loadable(() => import('../pages/Register'));;
const Workspace = loadable(() => import('./Workspace'));

const App = () => {
    return (
        <Switch>
            <Redirect exact path="/" to="/login"/>
            <Route path="/login" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/>
            <Route path="/workspace/:workspace" component={Workspace}/>
        </Switch>
    );
};

export default App;