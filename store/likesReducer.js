import axios from 'axios';
import domain from '../domain.js';

const initialState = {
  likeArt: [],
  allLikes: [],
};

const LIKE_ART = 'LIKE_ART';
const DISLIKE_ART = 'DISLIKE_ART';
const GET_LIKES = 'GET_LIKES';
const CHANGE_LIKED = 'CHANGE_LIKED'

export const likeArt = likedArt => ({
  type: LIKE_ART,
  likedArt,
});

export const dislikeArt = dislikedArt => ({
  type: DISLIKE_ART,
  dislikedArt,
});

export const getLikes = likes => ({
  type: GET_LIKES,
  likes,
});



export const fetchAllLikes = () => async dispatch => {
  try {
    const res = await axios.get(`${domain}/api/likes/`);
    // console.log(res);
    const allLikes = res.data;
    dispatch(getLikes(allLikes));
  } catch (error) {
    console.log(error);
  }
};

export const saveDislikeArt = dislikeArtData => async dispatch => {
  try {
    console.log(dislikeArtData);
    const response = await axios.put(`${domain}/api/likes`, dislikeArtData);
    return dispatch(dislikeArt(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const saveLikeArt = likeData => async dispatch => {
  try {
    const response = await axios.post(`${domain}/api/likes`, likeData);
    return dispatch(likeArt(response.data));
  } catch (error) {
    console.log(error);
  }
};

const likesReducer = (likesState = initialState, action) => {
  switch (action.type) {
    case DISLIKE_ART:
      return {
        ...likesState,
        likeArt: action.dislikedArt,
      };
    case LIKE_ART:
      return {
        ...likesState,
        likeArt: action.likedArt,
      };
    case GET_LIKES:
      return {
        ...likesState,
        allLikes: action.likes,
      };
    default:
      return likesState;
  }
};

export default likesReducer;
