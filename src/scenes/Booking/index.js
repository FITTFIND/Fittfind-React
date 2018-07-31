import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { BookingContainer } from 'AppContainers';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class _BookingScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    trainer: PropTypes.object,
    navigator: PropTypes.object,
    setCurrentScene: PropTypes.func,
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
      disableSideBar,
      showSideBar,
      trainer,
      navigator,
      setCurrentScene
    } = this.props;
    return (
      <View style={styles.container}>
        <BookingContainer
          disableSideBar={disableSideBar}
          showSideBar={showSideBar}
          trainer={trainer}
          navigator={navigator}
          setCurrentScene={setCurrentScene}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const BookingScene = sideBarContainer(_BookingScene);
