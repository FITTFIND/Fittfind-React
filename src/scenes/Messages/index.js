import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { MessagesContainer } from 'AppContainers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
class _MessagesScene extends Component {
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
    this.props.disableSideBar(false);
  }

  render() {
    const { showSideBar, navigator } = this.props;
    return (
      <View style={styles.container}>
        <MessagesContainer
          showSideBar={showSideBar}
          navigator={navigator}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const MessagesScene = sideBarContainer(_MessagesScene);
