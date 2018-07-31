/**
 * @providesModule ReduxReducers
 */
import { combineReducers } from 'redux';
import { sidebar } from './sidebarReducers';

export default combineReducers({
  sidebar
});
