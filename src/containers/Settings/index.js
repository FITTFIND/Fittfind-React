import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SimpleTopNav, Settings } from 'AppComponents';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { DARK_COLOR } from 'AppColors';
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

class SettingsContainer extends Component {
  static propTypes = {
    showSideBar: PropTypes.func,
    navigator: PropTypes.object,
    feathers: PropTypes.object,
    setCurrentScene: PropTypes.func,
    disableSideBar: PropTypes.func,
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
    const { navigator, feathers, setCurrentScene, disableSideBar, showSideBar } = this.props;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          centerLabel="Settings"
          leftAction={this.showMenu}
          backgroundColor={DARK_COLOR}
          leftLabel = {leftNavbar}
          rightLabel = {<View style={styles.navIconContainer} />}
          centerFontSize = {16}
        />
        <Settings
          navigator={navigator}
          feathers={feathers}
          setCurrentScene={setCurrentScene}
          disableSideBar={disableSideBar}
          showSideBar={showSideBar}
        />
      </View>
    );
  }
}
export default connectFeathers(SettingsContainer);
