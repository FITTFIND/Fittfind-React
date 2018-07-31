import React, { PropTypes, Component } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { BACKGROUND_COLOR } from 'AppColors';
import { NOTIFICATION_HEIGHT } from 'AppConstants';
import { MessageNotification } from './MessageNotification';
import { BookingNotification } from './BookingNotification';
const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    left: 0,
    top: -NOTIFICATION_HEIGHT,
    right: 0,
    height: NOTIFICATION_HEIGHT,
    backgroundColor: BACKGROUND_COLOR
  },
});

export class Notification extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    content: PropTypes.object,
    isSent: PropTypes.bool,
    returnToInitState: PropTypes.func,
    onPress: PropTypes.func,
    touchable: PropTypes.bool
  };

  static defaultProps = {
    type: 'message',
    content: {
      createdBy: {
        avatarUrl: '',
        isClient: false,
        name: 'Marcelo Perdon',
      },
      createdAt: new Date().toString(),
      messageType: 'text',
      messageContent: 'Hello Alex',
      messageName: 'Great Image',
    },
    isSent: false,
    touchable: true,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      messageAlertHeight: new Animated.Value(-NOTIFICATION_HEIGHT),
      content: props.content,
      isSent: props.isSent,
    };
    this.returnToInitState = ::this.returnToInitState;
  }

  componentWillReceiveProps(props) {
    if (props.isSent) {
      this.setState({ content: props.content, isSent: true });
      this.showMessageNotification();
    }
  }

  showMessageNotification() {
    Animated.sequence([
      Animated.timing(
        this.state.messageAlertHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
        }),
      Animated.delay(6000),
      Animated.timing(
        this.state.messageAlertHeight, {
          toValue: -NOTIFICATION_HEIGHT,
          duration: 200,
          easing: Easing.linear,
        })
    ]).start(this.returnToInitState);
  }

  returnToInitState() {
    this.setState({ content: null, isSent: false });
    this.props.returnToInitState();
  }

  renderNotification(content, type) {
    const { touchable, onPress } = this.props;
    const { isSent } = this.state;
    switch (type) {
      case 'message':
        return (
          <MessageNotification
            content = {content}
            touchable={touchable}
            onPress={onPress}
            isSent={isSent}
          />
        );
      case 'booking':
        return (
          <BookingNotification
            content = {content}
            touchable={touchable}
            onPress={onPress}
            isSent={isSent}
          />
        );
      case 'payment':
        return (
          <BookingNotification
            content = {content}
            touchable={touchable}
            onPress={onPress}
            isSent={isSent}
          />
        );
      default:
        return (<View />);
    }
  }

  render() {
    const { messageAlertHeight, content } = this.state;
    const { type } = this.props;
    console.info('content Notification', content);
    return (
      <Animated.View style={[styles.notificationContainer, { top: messageAlertHeight }]}>
        {this.renderNotification(content, type)}
      </Animated.View>
    );
  }
}
