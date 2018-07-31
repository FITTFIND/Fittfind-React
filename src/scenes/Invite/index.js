import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { InviteContainer } from 'AppContainers';
import { BACKGROUND_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  }
});

class _InviteScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    navigator: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.disableSideBar(true);
  }

  render() {
    const { navigator, disableSideBar } = this.props;
    return (
      <View style={styles.container}>
        <InviteContainer
          navigator={navigator}
          disableSideBar={disableSideBar}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const InviteScene = sideBarContainer(_InviteScene);
