import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { connectFeathers } from 'AppConnectors';
import { DARK_COLOR } from 'AppColors';
import { SimpleTopNav } from 'AppComponents';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { Invite } from 'AppComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLOR,
    paddingTop: NAVBAR_MARGIN_TOP,
  },
  navIconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImage: {
    width: 10,
    resizeMode: 'contain',
  },
});

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_back.png')} style={styles.menuImage} />
  </View>
);

class InviteContainer extends Component {
  static propTypes = {
    feathers: PropTypes.object,
    navigator: PropTypes.object,
    disableSideBar: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.goBack = ::this.goBack;
  }

  goBack() {
    this.props.navigator.pop();
    this.props.disableSideBar(false);
  }

  render() {
    const { feathers } = this.props;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          centerLabel="Invite friends"
          leftAction={this.goBack}
          backgroundColor={DARK_COLOR}
          leftLabel = {leftNavbar}
          rightLabel = {<View style={styles.navIconContainer} />}
          centerFontSize = {16}
        />
        <Invite feathers={feathers} />
      </View>
    );
  }
}
export default connectFeathers(InviteContainer);
