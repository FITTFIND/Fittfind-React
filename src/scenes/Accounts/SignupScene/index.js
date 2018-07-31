import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { SignupContainer } from 'AppContainers';
import { WINDOW_HEIGHT } from 'AppConstants';
import Keyboard from 'Keyboard';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: WINDOW_HEIGHT,
  }
});


export class SignupScene extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    socialUser: PropTypes.object,
  };

  static defaultProps = {
    socialUser: null
  };

  constructor(props, context) {
    super(props, context);
    this.routeSignupSuccess = ::this.routeSignupSuccess;
    this.state = {
      keyboardHeight: new Animated.Value(0),
      keyboardShown: false,
    };
    this.onKeyboardUpdated = ::this.onKeyboardUpdated;
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillHide', (event) => this.onKeyboardUpdated(event, false)),
        Keyboard.addListener('keyboardWillShow', (event) => this.onKeyboardUpdated(event, true)),
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener('keyboardDidHide', (event) => this.onKeyboardUpdated(event, false)),
        Keyboard.addListener('keyboardDidShow', (event) => this.onKeyboardUpdated(event, true)),
      ];
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.remove());
  }

  onKeyboardUpdated(event, type) {
    console.info('event', type);
    const toValue = !type ? 0 : 100 * -1;
    console.info('toValue', toValue);
    Animated.timing(
      this.state.keyboardHeight, {
        toValue,
        duration: 150,
      }
    ).start();
    this.setState({ keyboardShown: type });
  }

  routeSignupSuccess(user) {
    const { navigator } = this.props;
    console.info('UserSignup', user);
    if (user.data.isClient) {
      navigator.resetTo('ClientScene');
    } else {
      navigator.resetTo('TrainerScene');
    }
  }

  render() {
    const { keyboardHeight } = this.state;
    return (
      <Animated.View style={[styles.container, { top: keyboardHeight }]}>
        <SignupContainer
          routeBack={this.props.onBack}
          routeSignupSuccess = {this.routeSignupSuccess}
          socialUser={this.props.socialUser}
        />
      </Animated.View>
    );
  }
}
