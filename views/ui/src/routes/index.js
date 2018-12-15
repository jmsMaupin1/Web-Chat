import React from 'react';
import { Router, Route } from 'react-router-dom';
import { history } from 'helper/history';
import Chat from 'containers/Chat';
import App from 'containers/App';

export default () => {
    return (
        <Router history={history}>
            <>
                <Route exact path = '/' component = {App}/>
                <Route path = '/chat' component = {Chat} />
            </>
        </Router>
    );
}