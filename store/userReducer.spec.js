import {loginWithoutGoogle, signUpWithoutGoogle, setCurrentUser, updateUser} from './userReducer'


describe('Action creators for User Reducer', () => {
  it ('should create an action to login without OAuth', () => {
    const user = {}
    const expectedAction = {
      type: 'LOGIN_ME',
      user 
    }
    expect(loginWithoutGoogle(user)).toEqual(expectedAction)
  })
  
  it ('should create an action to signup without OAuth', () => {
    const user = {}
    const expectedAction = {
      type: 'SIGN_UP_WITHOUT_GOOGLE',
      user 
    }
    expect(signUpWithoutGoogle(user)).toEqual(expectedAction)
  })

  it ('should create an action to set user on state', () => {
    const user = {}
    const expectedAction = {
      type: 'SET_USER',
      user 
    }
    expect(setCurrentUser(user)).toEqual(expectedAction)
  })

  it ('should create an action to update user', () => {
    const user = {}
    const expectedAction = {
      type: 'UPDATE_USER',
      user 
    }
    expect(updateUser(user)).toEqual(expectedAction)
  })
})