import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SimpleTopNav, Payment } from 'AppComponents';
import { DARK_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { connectFeathers } from 'AppConnectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLOR,
    paddingTop: NAVBAR_MARGIN_TOP
  },
  menuImage: {
    width: 10,
    resizeMode: 'contain',
  },
  navIconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class PaymentContainer extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    feathers: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.leftNavbar = (
      <View style={styles.navIconContainer}>
        <Image source={require('img/icon_back.png')} style={styles.menuImage} />
      </View>
    );
    this.rightNavbar = (
      <View style={styles.navIconContainer} />
    );
    this.onBack = ::this.onBack;
  }

  onBack() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <SimpleTopNav
          centerLabel="Payment"
          leftAction={this.onBack}
          backgroundColor={DARK_COLOR}
          leftLabel = {this.leftNavbar}
          rightLabel = {this.rightNavbar}
          centerFontSize = {16}
        />
        <Payment
          feathers={this.props.feathers}
        />
      </View>
    );
  }
}
export default connectFeathers(PaymentContainer);
