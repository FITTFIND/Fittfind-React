import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { TrainerContainer } from 'AppContainers';
import { BACKGROUND_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  }
});

class _TrainerScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    navigator: PropTypes.object

  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    console.info('trainer~~~~~~~~');
  }

  componentDidMount() {
    this.props.disableSideBar(false);
    this.props.showSideBar(false);
  }

  render() {
    const { showSideBar, navigator } = this.props;
    return (
      <View style={styles.container}>
        <TrainerContainer
          showSideBar={showSideBar}
          navigator={navigator}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const TrainerScene = sideBarContainer(_TrainerScene);
