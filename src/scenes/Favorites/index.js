import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { FavoritesContainer } from 'AppContainers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class _FavoritesScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
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
    const { showSideBar } = this.props;
    return (
      <View style={styles.container}>
        <FavoritesContainer
          showSideBar={showSideBar}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const FavoritesScene = sideBarContainer(_FavoritesScene);
