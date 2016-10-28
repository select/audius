
export const addVideos = (videos) => {
  return {
    type: 'ADD_VIDEOS',
    videos,
  }
}


export const menuVideo = (id) => {
  return {
    type: 'MENU_VIDEO',
    id,
  }
}

export const playVideo = (id) => {
  return {
    type: 'PLAY_VIDEO',
    id,
  }
}

export const play = () => {
  return {
    type: 'PLAY',
  }
}

export const pause = () => {
  return {
    type: 'PAUSE',
  }
}

export const nextVideo = () => {
  return {
    type: 'NEXT_VIDEO',
  }
}

export const previousVideo = () => {
  return {
    type: 'PREV_VIDEO',
  }
}

export const toggleShuffle = () => {
  return {
    type: 'TOGGLE_SHUFFLE',
  }
}

export const toggleRepeat = () => {
  return {
    type: 'TOGGLE_REPEAT',
  }
}


export const changeVolume = (volume) => {
  return {
    type: 'CHANGE_VOLUME',
    volume,
  }
}

export const mute = () => {
  return {
    type: 'MUTE',
  }
}
