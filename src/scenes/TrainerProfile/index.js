import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { TrainerProfileContainer } from 'AppContainers';
import { BACKGROUND_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  }
});

class _TrainerProfileScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    otherUser: PropTypes.object.isRequired,
    navigator: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.disableSideBar(true);
    this.props.showSideBar(false);
  }

  render() {
    const {
      navigator,
      otherUser,
      disableSideBar
    } = this.props;
    return (
      <View style={styles.container}>
        <TrainerProfileContainer
          navigator={navigator}
          otherUser={otherUser}
          disableSideBar={disableSideBar}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const TrainerProfileScene = sideBarContainer(_TrainerProfileScene);
