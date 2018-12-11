import { LOGIN_SUCCESS, LOGIN_FAIL } from 'state/actions';

export const loginSuccess  = ( user ) => ({ type: LOGIN_SUCCESS, payload: user });
export const loginFail     = () => ({ type: LOGIN_FAIL });

function errorHandler(response) {
    if(!response.ok) throw Error(response.statusText);
    
    return response;
}

export const loginUser = (user, password) => dispatch => {

    // fetch('/login', {
    //     method  : 'POST',
    //     headers : {'Content-Type' : 'application/json'},
    //     body    : JSON.stringify({
    //         username: user,
    //         password: password
    //     })
    // })
    // .then(errorHandler)
    // .then(res => res.text())
    // .then(text => console.log(text))
}