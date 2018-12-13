export const LOGIN_SUCCESS   = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE   = 'LOGIN_FAILURE';

export const REGISTER_SUCCESS = 'REGISTER_SUCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export function errorHandler(response) {
    if(!response.ok) throw Error(response.statusText);
    
    return response;
}