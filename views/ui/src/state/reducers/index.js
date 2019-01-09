import { combineReducers } from 'redux';
import user from 'state/reducers/user';
import sidebar from 'state/reducers/sidebar';
import chat from 'state/reducers/chat';

export default combineReducers({ user, sidebar, chat });