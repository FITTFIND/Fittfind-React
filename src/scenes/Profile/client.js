import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { ClientContainer } from 'AppContainers';
// import { BG_DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class _ClientScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  
  componentDidMount() {
    this.props.disableSideBar(false);
    this.props.showSideBar(false);
  }

  render() {
    const { showSideBar } = this.props;
    return (
      <View style={styles.container}>
        <ClientContainer
          showSideBar={showSideBar}
        />
      </View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const ClientScene = sideBarContainer(_ClientScene);
