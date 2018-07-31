import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { BLUE, BLACK_COLOR } from 'AppColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK_COLOR
  },
  triangleCornorRight: {
    position: 'absolute',
    top: 0,
    left: (WINDOW_WIDTH - WINDOW_HEIGHT) / 2 - 1,
    width: 0,
    height: 0,

    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: WINDOW_HEIGHT,
    borderBottomWidth: WINDOW_HEIGHT,
    borderLeftColor: 'transparent',
    borderBottomColor: BLUE
  },
  triangleCornorLeft: {
    position: 'absolute',
    top: 0,
    left: (WINDOW_WIDTH - WINDOW_HEIGHT) / 2 + 1,
    width: 0,
    height: 0,

    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: WINDOW_HEIGHT,
    borderTopWidth: WINDOW_HEIGHT,
    borderRightColor: 'transparent',
    borderTopColor: BLUE
  },
  loadingBar: {
    width: 60,
    height: 60,
  },
  loadingContainer: {
    top: WINDOW_HEIGHT / 2 + 10,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  subContainer: {
    flex: 1,
  },
  logoContainer: {
    top: WINDOW_HEIGHT / 2 - 180,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  logoImg: {
    width: 200,
    height: 100,
    resizeMode: 'contain'
  }
});

export class SplashScene extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      topAnimatedValue: new Animated.Value(0),
      bottomAnimatedValue: new Animated.Value(0)
    };
    this.animationTimeout = null;
    this.startAnimate = ::this.startAnimate;
  }
  componentDidMount() {
    this.startAnimate();
    this.animationTimeout = setTimeout(() => {
      this.animationTimeout = null;
      this.props.navigator.push('LoginScene');
    }, 3000);
  }
  componentWillUnmount() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
  startAnimate() {
    const { topAnimatedValue, bottomAnimatedValue } = this.state;
    Animated.parallel([
      Animated.timing(topAnimatedValue, {
        toValue: -350,
        duration: 500,
        easing: Easing.linear
      }),
      Animated.timing(bottomAnimatedValue, {
        toValue: 350,
        duration: 500,
        easing: Easing.linear
      })
    ]).start(() => this.startAnimate());
  }
  render() {
    const { topAnimatedValue, bottomAnimatedValue } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.triangleCornorLeft, { top: topAnimatedValue }]} />
        <Animated.View style={[styles.triangleCornorRight, { top: bottomAnimatedValue }]} />
        <View style={styles.subContainer}>
          <View style={styles.loadingContainer}>
            <Image
              source={require('img/loading_bar.gif')}
              style={styles.loadingBar}
            />
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={require('img/icon_app_logo.png')}
              style={styles.logoImg}
            />
          </View>
        </View>
      </View>
    );
  }
}

// import { sideBarContainer } from 'ReduxContainers';
// export const SplashScene = sideBarContainer(_SplashScene);
