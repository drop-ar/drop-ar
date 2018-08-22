import {getAllArt, getSingleArt, saveSingleArt, editSingleArt, getUserArt}  from './artReducer'



describe('Action creators Art Reducer', () => {
  it('should create an action to get all art', () => {
    const allArt = []
    const expectedAction = {
      type: 'GET_ALL_ART',
      allArt
    }
    expect(getAllArt(allArt)).toEqual(expectedAction)
  })

  it('should create an action to get single art', () => {
    const singleArt = {}
    const expectedAction = {
      type: 'GET_SINGLE_ART',
      singleArt
    }
    expect(getSingleArt(singleArt)).toEqual(expectedAction)
  })

  it('should create an action to save single art', () => {
    const singleArt = {}
    const expectedAction = {
      type: 'SAVE_SINGLE_ART',
      singleArt
    }
    expect(saveSingleArt(singleArt)).toEqual(expectedAction)
  })

  it('should create an action to get user art', () => {
    const userArt = []
    const expectedAction = {
      type: 'GET_USER_ART',
      userArt
    }
    expect(getUserArt(userArt)).toEqual(expectedAction)
  })

  it('should create an action to edit single art', () => {
    const singleArt = {}
    const expectedAction = {
      type: 'EDIT_SINGLE_ART',
      singleArt
    }
    expect(editSingleArt(singleArt)).toEqual(expectedAction)
  })
})

