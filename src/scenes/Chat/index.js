import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { ChatContainer } from 'AppContainers';
import { WINDOW_HEIGHT } from 'AppConstants';
import Keyboard from 'Keyboard';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: WINDOW_HEIGHT,
  }
});

class _ChatScene extends Component {
  static propTypes = {
    disableSideBar: PropTypes.func,
    showSideBar: PropTypes.func,
    onBack: PropTypes.func,
    otherUser: PropTypes.object,
    threadId: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
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

  componentDidMount() {
    this.props.disableSideBar(true);
    this.props.showSideBar(false);
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.remove());
  }

  onKeyboardUpdated(event, type) {
    console.info('event', type);
    const toValue = !type ? 0 : event.endCoordinates.height * -1;
    console.info('toValue', toValue);
    Animated.timing(
      this.state.keyboardHeight, {
        toValue,
        duration: 150,
      }
    ).start();
    this.setState({ keyboardShown: type });
  }

  render() {
    const {
      disableSideBar,
      showSideBar,
      onBack,
      otherUser,
      threadId
    } = this.props;
    const { keyboardHeight } = this.state;
    return (
      <Animated.View style={[styles.container, { top: keyboardHeight }]}>
        <ChatContainer
          disableSideBar={disableSideBar}
          showSideBar={showSideBar}
          onBack={onBack}
          otherUser={otherUser}
          threadId={threadId}
        />
      </Animated.View>
    );
  }
}

import { sideBarContainer } from 'ReduxContainers';
export const ChatScene = sideBarContainer(_ChatScene);
