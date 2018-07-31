import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SideBarActions } from 'ReduxActions';
import { createSelector } from 'reselect';


export const sidebar$ = (state) => state.sidebar;
const selector$ = createSelector(sidebar$,
  (sidebar) => ({
    sidebar
  })
);

const mapStateToProps = (state) => ({ ...selector$(state) });
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...SideBarActions }, dispatch);

export default (component) => connect(mapStateToProps, mapDispatchToProps)(component);
