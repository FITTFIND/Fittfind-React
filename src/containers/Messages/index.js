import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Messages } from 'AppComponents';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { DARK_COLOR } from 'AppColors';
import { SimpleTopNav } from 'AppComponents';
import { connectFeathers } from 'AppConnectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NAVBAR_MARGIN_TOP,
    backgroundColor: DARK_COLOR
  },
  navIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImage: {
    width: 20,
    resizeMode: 'contain',
  }
});

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_menu.png')} style={styles.menuImage} />
  </View>
);

export class MessagesContainer extends Component {
  static propTypes = {
    showSideBar: PropTypes.func,
    feathers: PropTypes.object,
    navigator: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.showMenu = ::this.showMenu;
  }

  showMenu() {
    this.props.showSideBar(true);
  }

  render() {
    const { feathers, navigator } = this.props;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          centerLabel="Messages"
          leftAction={this.showMenu}
          backgroundColor={DARK_COLOR}
          leftLabel = {leftNavbar}
          rightLabel = {<View style={styles.navIconContainer} />}
          centerFontSize = {16}
        />
        <Messages
          feathers={feathers}
          navigator={navigator}
        />
      </View>
    );
  }
}
export default connectFeathers(MessagesContainer);
