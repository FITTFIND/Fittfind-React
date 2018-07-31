import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { Client } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class ClientContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    showSideBar: PropTypes.func
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  render() {
    const { feathers, showSideBar } = this.props;
    return (
      <View style={styles.container}>
        <Client
          feathers={feathers}
          showSideBar={showSideBar}
        />
      </View>
    );
  }
}
export default connectFeathers(ClientContainer);
