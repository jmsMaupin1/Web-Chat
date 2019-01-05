import { combineReducers } from 'redux';
import userReducer from 'state/reducers/user';
import serverReducer from 'state/reducers/server';
import sidebarReducer from 'state/reducers/sidebar';

export default combineReducers({ userReducer, serverReducer, sidebarReducer });