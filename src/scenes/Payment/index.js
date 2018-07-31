import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { PaymentContainer } from 'AppContainers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export class PaymentScene extends Component {
  static propTypes = {
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <PaymentContainer
          {...this.props}
        />
      </View>
    );
  }
}

// import { sideBarContainer } from 'ReduxContainers';
// export const PaymentScene = sideBarContainer(_PaymentScene);
