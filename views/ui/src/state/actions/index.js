export const LOGIN_SUCCESS   = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE   = 'LOGIN_FAILURE';

export const REGISTER_SUCCESS = 'REGISTER_SUCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const FETCHING_ROOM      = 'FETCHING_ROOM';
export const ROOM_FETCH_SUCCESS = 'ROOM_SUCCESS';
export const ROOM_FETCH_FAILURE = 'ROOM_FETCH_FAILURE';
export const FETCHING_MESSAGE_HISTORY      = 'FETCHING_MESSAGE_HISTORY';
export const MESSAGE_HISTORY_FETCH_SUCCESS = 'MESSAGE_HISTORY_FETCH_SUCCESS';
export const MESSAGE_HISTORY_FETCH_FAILURE = 'MESSAGE_HISOTRY_FETCH_FAILURE';

export function errorHandler(response) {
    if(!response.ok) throw Error(response.statusText);
    
    return response;
}