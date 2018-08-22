import axios from "axios";
import domain from "../domain.js";

const initialState = {
  user: {}
};

const LOGIN_ME = "LOGIN_ME";
const SIGN_UP_WITHOUT_GOOGLE = "SIGN_UP_WITHOUT_GOOGLE";
const SET_USER = "SET_USER"
const UPDATE_USER = 'UPDATE_USER'

export const loginWithoutGoogle = user => ({
  type: LOGIN_ME,
  user: user
});

export const signUpWithoutGoogle = user => ({
  type: SIGN_UP_WITHOUT_GOOGLE,
  user: user
});

export const setCurrentUser = user => ({
  type: SET_USER,
  user: user
})

export const updateUser = user => ({
  type: UPDATE_USER,
  user: user
});

export const login = formData => async dispatch => {
  try {
    const res = await axios.put(`${domain}/api/user/login`, formData);
    const user = res.data;
    dispatch(loginWithoutGoogle(user));
  } catch (error) {
    console.log('do we get error?',error);
    dispatch(loginWithoutGoogle(error));
  }
};

export const signup = formData => async dispatch => {
  try {
    const res = await axios.post(`${domain}/api/user/signup`, formData);
    const user = res.data;
    dispatch(signUpWithoutGoogle(user));
  } catch (error) {
    console.log(error);
  }
};

export const updatingUser = (userData) => async dispatch => { 
  try {
      await axios.put(`${domain}/api/user/update`, userData)
      const res = await axios.put(`${domain}/api/user/login`, {email: userData.email, password: userData.password})
      const user = res.data;
      dispatch(updateUser(user))
  } catch (error) {
      console.log(error);
  }
}
const userReducer = (userState = initialState, action) => {
  switch (action.type) {
    case LOGIN_ME:
      return {
        ...userState,
        user: action.user
      };
    case SIGN_UP_WITHOUT_GOOGLE:
      return {
        ...userState,
        user: action.user
      };
    
    case SET_USER:
      return {
        ...userState,
        user: action.user
      }
    case UPDATE_USER:
      return {
        ...userState,
        user: action.user
      };

    default:
      return userState;
  }
};

export default userReducer;
