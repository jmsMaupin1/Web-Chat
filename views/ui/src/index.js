import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from 'state';
import ReactRouter from './routes';
import './index.css';

ReactDOM.render(
<Provider store={store}>
    <Router>
        <ReactRouter/>
    </Router>
</Provider>, document.getElementById('root'));
