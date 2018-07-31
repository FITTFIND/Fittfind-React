import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { InviteCategoryContainer } from 'AppContainers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange'
  }
});

class _InviteCategoryScene extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    disableSideBar: PropTypes.func,
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
        <InviteCategoryContainer
          navigator={navigator}
          disableSideBar={disableSideBar}
        />
      </View>
    );
  }
}
import { sideBarContainer } from 'ReduxContainers';
export const InviteCategoryScene = sideBarContainer(_InviteCategoryScene);
