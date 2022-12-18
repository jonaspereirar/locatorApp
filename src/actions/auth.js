export const LOGIN_ACTION = 'LOGIN_ACTION';
export const LOGOUT_ACTION = 'LOGOUT_ACTION';

export function login(data) {
  return {
    type: LOGIN_ACTION,
    data,
  };
}

export function logout() {
  return {
    type: LOGOUT_ACTION,
  };
}
