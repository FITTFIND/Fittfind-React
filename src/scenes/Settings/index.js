import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { SettingsContainer } from 'AppContainers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class _SettingsScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    navigator: PropTypes.object,
    setCurrentScene: PropTypes.func.isRequired,
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
    const { showSideBar, navigator, setCurrentScene, disableSideBar } = this.props;
    return (
      <View style={styles.container}>
        <SettingsContainer
          showSideBar={showSideBar}
          navigator={navigator}
          setCurrentScene={setCurrentScene}
          disableSideBar={disableSideBar}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const SettingsScene = sideBarContainer(_SettingsScene);
