import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Favorites, SimpleTopNav } from 'AppComponents';
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

class FavoritesContainer extends Component {
  static propTypes = {
    showSideBar: PropTypes.func,
    feathers: PropTypes.object,
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
    const { feathers } = this.props;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          centerLabel="Favorites"
          leftAction={this.showMenu}
          backgroundColor={DARK_COLOR}
          leftLabel = {leftNavbar}
          rightLabel = {<View style={styles.navIconContainer} />}
          centerFontSize = {16}
        />
        <Favorites feathers={feathers} />
      </View>
    );
  }
}
export default connectFeathers(FavoritesContainer);
