import {likeArt, dislikeArt, getLikes} from './likesReducer'


describe('Action creators for likes reducer', () => {
  it ('should create an action that likes art', () => {
    const likedArt = []
    const expectedAction = {
      type: 'LIKE_ART',
      likedArt
    }
    expect(likeArt(likedArt)).toEqual(expectedAction)
  })

  it ('should create an action that dislikes art', () => {
    const dislikedArt = []
    const expectedAction = {
      type: 'DISLIKE_ART',
      dislikedArt
    }
    expect(dislikeArt(dislikedArt)).toEqual(expectedAction)
  })

  it ('should create an action that gets all likes', () => {
    const likes = []
    const expectedAction = {
      type: 'GET_LIKES',
      likes
    }
    expect(getLikes(likes)).toEqual(expectedAction)
  })
})