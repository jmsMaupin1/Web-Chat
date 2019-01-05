import {
    CHOOSE_ROOM,
    CHOOSE_VIEW,
} from './index'

export const chooseSidebarView = view => ({type: CHOOSE_VIEW, payload: view});

export const chooseRoom = room => ({type: CHOOSE_ROOM, payload: room});