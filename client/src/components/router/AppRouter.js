import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import LoginContextProvider from '../../context/loginContext';
import HomePage from '../home/HomePage';
import LoginForm from '../login/LoginForm';
import Header from '../main/Header';
import NotFoundPage from '../not-found/NotFoundPage';
import LoginRoute from './LoginRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Header />
                <Switch>
                    <Route path="/" exact>
                        <Redirect to="/home" />
                    </Route>
                    <Route path="/home" component={HomePage} />
                    <LoginRoute path="/login" component={LoginForm} />
                    <Route path="*" component={NotFoundPage} />
                </Switch>
            </LoginContextProvider>
        </BrowserRouter>
    )
};

export default AppRouter;