import { combineReducers } from 'redux';
import userReducer from 'state/reducers/user';
import serverReducer from 'state/reducers/server';

export default combineReducers({ userReducer, serverReducer });