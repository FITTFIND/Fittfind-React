import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { PersonalTrainerContainer } from 'AppContainers';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: WINDOW_WIDTH * 2,
    height: WINDOW_HEIGHT
  }
});

class _PersonalTrainerScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    navigator: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.disableSideBar(false);
  }

  render() {
    const { disableSideBar, showSideBar, navigator } = this.props;
    return (
      <View style={styles.container}>
        <PersonalTrainerContainer
          disableSideBar={disableSideBar}
          showSideBar={showSideBar}
          navigator={navigator}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const PersonalTrainerScene = sideBarContainer(_PersonalTrainerScene);
