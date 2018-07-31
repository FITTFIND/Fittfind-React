import React, { Component, PropTypes } from 'react';
import { View, Animated } from 'react-native';
import Keyboard from 'Keyboard';

export class KeyboardSpacing extends Component {
  static propTypes = {
    enableAndroid: PropTypes.bool.isRequired,
    onKeyboardUpdated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    enableAndroid: false,
    onKeyboardUpdated: () => {}
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      keyboardHeight: new Animated.Value(0),
      keyboardShown: false,
    };
    this.onKeyboardUpdated = this.onKeyboardUpdated.bind(this);
  }

  componentWillMount() {
    this.subscriptions = [];
    // if (Platform.OS === 'ios') {
    //
    // }
    this.subscriptions = [
      Keyboard.addListener('keyboardWillHide', (event) => this.onKeyboardUpdated(event, false)),
      Keyboard.addListener('keyboardWillShow', (event) => this.onKeyboardUpdated(event, true)),
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.remove());
  }

  onKeyboardUpdated(event, type) {
    console.info('event', type);
    const toValue = !type ? 0 : event.endCoordinates.height;

    Animated.timing(
      this.state.keyboardHeight, {
        toValue,
        duration: 150,
      }
    ).start();
    this.setState({ keyboardShown: type });
  }

  render() {
    return (
      <Animated.View style={{ height: this.state.keyboardHeight }} />
    );
  }
}
