import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScheduleContainer } from 'AppContainers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class _ScheduleScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    navigator: PropTypes.object,
    setCurrentScene: PropTypes.func,
    showSideBar: PropTypes.func,
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
    const { navigator, setCurrentScene, showSideBar } = this.props;
    return (
      <View style={styles.container}>
        <ScheduleContainer
          navigator={navigator}
          setCurrentScene={setCurrentScene}
          showSideBar={showSideBar}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const ScheduleScene = sideBarContainer(_ScheduleScene);
