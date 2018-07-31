import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SimpleTopNav, Booking } from 'AppComponents';
import { DARK_COLOR } from 'AppColors';
import { NAVBAR_MARGIN_TOP } from 'AppConstants';
import { connectFeathers } from 'AppConnectors';

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
  }
});

const leftNavbar = (
  <View style={styles.navIconContainer}>
    <Image source={require('img/icon_back.png')} style={styles.menuImage} />
  </View>
);

class BookingContainer extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    trainer: PropTypes.object,
    navigator: PropTypes.object,
    setCurrentScene: PropTypes.func,
    feathers: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.goBack = ::this.goBack;
  }

  goBack() {
    this.props.navigator.pop();
    // this.props.disableSideBar(false);
  }

  render() {
    const {
      navigator,
      setCurrentScene,
      trainer,
      feathers
    } = this.props;
    return (
      <View style={styles.container}>
        <SimpleTopNav
          centerLabel="Book Trainer"
          leftAction={this.goBack}
          backgroundColor={DARK_COLOR}
          leftLabel={leftNavbar}
          rightLabel={<View style={styles.navIconContainer} />}
          centerFontSize={16}
        />
        <Booking
          navigator={navigator}
          setCurrentScene={setCurrentScene}
          trainer={trainer}
          feathers={feathers}
        />
      </View>
    );
  }
}
export default connectFeathers(BookingContainer);
