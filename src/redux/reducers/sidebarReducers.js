import { SideBarActions } from 'ReduxActions';
import defaultValues from './defaultState';
export const sidebar = (state = defaultValues.sidebar, action) => {
  switch (action.type) {
    case SideBarActions.SHOW_SIDEBAR:
      {
        const newState = { ...state };
        newState.showSidebar = action.payload;
        return newState;
      }
    case SideBarActions.DISABLE_SIDEBAR:
      {
        const newState = { ...state };
        newState.disableSidebar = action.payload;
        return newState;
      }
    case SideBarActions.SET_CURRENTSCENE:
      {
        const newState = { ...state };
        newState.currentScene = action.payload;
        return newState;
      }
    // case SideBarActions.SET_CURRENTSCENE_NAME:
    //   {
    //     const newState = { ...state };
    //     newState.currentSceneName = action.payload;
    //     return newState;
    //   }
    default:
      return state;
  }
};
