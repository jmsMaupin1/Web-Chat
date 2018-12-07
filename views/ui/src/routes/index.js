import React from 'react';
import { Route } from 'react-router-dom';
import App from 'containers/App';

export default () => {
    return (
        <Route exact path = '/' component = {App}/>
    );
}